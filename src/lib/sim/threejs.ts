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

export interface AxisInfo {
    north: THREE.Vector3; // normalized, Y-up
    spin: number; // radians
}

// Y-up
// Ecliptic positions relative to the sun, in world units
export interface SimData {
    earth: {
        pos: THREE.Vector3;
        axis: AxisInfo;
    }
}

export const sim = derived(astroSim, adaptSimDataForThreeJS);
export const earthOrbit = derived(astroEarthOrbit, adaptVectorsForThreeJS);

function adaptSimDataForThreeJS(astroSim: AstroSimData): SimData {
    return {
        earth: {
            pos: astroVectorToThreeJS(astroSim.earth.pos),
            axis: adaptAxisInfoForThreeJS(astroSim.earth.axis)
        }
    }
}

function adaptVectorsForThreeJS(arr: ae.Vector[]): THREE.Vector3[] {
    return arr.map(astroVectorToThreeJS);
}

function astroVectorToThreeJS(input: ae.Vector): THREE.Vector3 {
    const threeV = new THREE.Vector3(input.x, input.z, -input.y) // switch Y and Z and inverse new Z
    return threeV.multiplyScalar(SCALE_FACTOR); // Astronomical Units to Kilometers
}

function adaptAxisInfoForThreeJS(i: ae.AxisInfo): AxisInfo {
    return {
        // Normalized vector, don't scale
        north: new THREE.Vector3(i.north.x, i.north.z, -i.north.y),  // switch Y and Z and inverse new Z
        spin: DEG2RAD * i.spin
    }
}