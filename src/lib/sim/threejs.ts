import * as THREE from 'three';
import { derived } from "svelte/store";
import type * as ae from 'astronomy-engine';
import { ASTRO_SUN_INTENSITY, ASTRO_SUN_RADIUS, ASTRO_EARTH_RADIUS, type AstroSimData, ASTRO_EARTH_ORBIT_RADIUS } from './astro';
import { astroEarthOrbit, astroSim } from './astro';
import { DEG2RAD } from 'three/src/math/MathUtils';

// Here, we transform the simulation data from astronomy-engine to facilitate
// usage in a ThreeJS environment. ThreeJS uses Y-up whereas AE uses Z-up so 
// we switch them here. We also transform the astronomical units used by AE
// into world an arbitraty unit based on the scale factor.
// Still not exactly sure why but we need to inverse the new Z coordinate.
// Probably because of the astro vectors are using ecliptic coordinates. See
// https://en.wikipedia.org/wiki/Ecliptic_coordinate_system#/media/File:Heliocentric_rectangular_ecliptic.png

export const SCALE_FACTOR = 100000;

export const SUN_INTENSITY = ASTRO_SUN_INTENSITY * SCALE_FACTOR;
export const SUN_RADIUS = ASTRO_SUN_RADIUS * SCALE_FACTOR;
export const EARTH_RADIUS = ASTRO_EARTH_RADIUS * SCALE_FACTOR;
export const EARTH_ORBIT_RADIUS = ASTRO_EARTH_ORBIT_RADIUS * SCALE_FACTOR;

// Y-up
// Ecliptic positions relative to the sun, in world units
export interface SimData {
    earth: {
        pos: THREE.Vector3;
        north: THREE.Vector3;
        zeroZero: THREE.Vector3;
        rotation: THREE.Euler;
    }
}

export const sim = derived(astroSim, adaptSimDataForThreeJS);
export const earthOrbit = derived(astroEarthOrbit, mapVectorsForThreeJS);

function adaptSimDataForThreeJS(d: AstroSimData): SimData {
    const pos = astroVectorToThreeJS(d.earth.pos)
    const north = astroVectorToThreeJS(d.earth.north)
    const zeroZero = astroVectorToThreeJS(d.earth.zeroZero)
    const rotation = calcEarthRotation(north, d.earth.eqdZeroZero)
    return {
        earth: { pos, north, zeroZero, rotation }
    }
}

function mapVectorsForThreeJS(arr: ae.Vector[]): THREE.Vector3[] {
    return arr.map(astroVectorToThreeJS);
}

export function astroVectorToThreeJS(input: ae.Vector): THREE.Vector3 {
    const threeV = new THREE.Vector3(input.x, input.z, -input.y) // switch Y and Z and inverse new Z
    return threeV.multiplyScalar(SCALE_FACTOR); // Astronomical Units to Kilometers
}

// The rotation is calculated based on how the texture is applied to the sphere,
// where the zero zero vector aligns with the X axis and the north pole aligns with Y
function calcEarthRotation(north: THREE.Vector3, eqdZeroZero: ae.Vector): THREE.Euler {
    let rotation = new THREE.Euler(0, 0, 0, 'XZY');

    rotation.x = Math.atan(north.z / north.y);
    const invRotatedNorth = north.clone();
    // Apply the inverse rotation to calculate the angle for z
    invRotatedNorth.applyEuler(new THREE.Euler(-rotation.x));
    rotation.z = -Math.atan(north.x / invRotatedNorth.y);

    // We want to find the angle to rotate along the equator so
    // we use the equator of date vector instead of the ecliptic one
    let angle = Math.atan(eqdZeroZero.y / eqdZeroZero.x);
    if (eqdZeroZero.x < 0) {
        angle -= 180 * DEG2RAD;
    }
    rotation.y = angle;

    return rotation;
}