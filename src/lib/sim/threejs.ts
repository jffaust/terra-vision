import * as THREE from 'three';
import { derived } from "svelte/store";
import * as astro from 'astronomy-engine';
import type { SimData, AstroSimData } from '$lib/types';
import { astroEarthOrbit, astroSim } from './astro';

export const sim = derived(astroSim, adaptSimDataForThreeJS);
export const earthOrbit = derived(astroEarthOrbit, adaptVectorsForThreeJS);

function adaptSimDataForThreeJS(astroSim: AstroSimData): SimData {
    return {
        earth: {
            pos: astroToThreeJS(astroSim.earth.pos)
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