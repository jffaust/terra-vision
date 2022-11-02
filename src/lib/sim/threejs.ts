import * as THREE from 'three';
import { derived } from "svelte/store";
import * as astro from 'astronomy-engine';
import type { SimData, AstroSimData, AxisInfo } from '$lib/types';
import { astroEarthOrbit, astroSim } from './astro';
import { DEG2RAD } from 'three/src/math/MathUtils';

export const sim = derived(astroSim, adaptSimDataForThreeJS);
export const earthOrbit = derived(astroEarthOrbit, adaptVectorsForThreeJS);

function adaptSimDataForThreeJS(astroSim: AstroSimData): SimData {
    return {
        earth: {
            pos: astroToThreeJS(astroSim.earth.pos),
            axis: adaptAxisInfoForThreeJS(astroSim.earth.axis)
        }
    }
}

function adaptVectorsForThreeJS(arr: astro.Vector[]): THREE.Vector3[] {
    return arr.map(astroToThreeJS);
}

function astroToThreeJS(input: astro.Vector): THREE.Vector3 {
    const threeV = new THREE.Vector3(input.x, input.z, input.y) // switch Y and Z
    return threeV.multiplyScalar(astro.KM_PER_AU); // Astronomical Units to Kilometers
}

function adaptAxisInfoForThreeJS(i: astro.AxisInfo): AxisInfo {
    return {
        //TODO probably have to switch axis
        // Normalized vector, don't scale
        north: new THREE.Vector3(i.north.x, i.north.z, i.north.y),
        spin: DEG2RAD * i.spin
    }
}