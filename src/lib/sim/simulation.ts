import type { SimProps, SimPropsAstro } from '$lib/types';
import * as astro from 'astronomy-engine';
import { derived, get, writable, type Readable } from "svelte/store";
import * as THREE from 'three';
import { calculateEarthOrbit, calculateProperties } from './calcs';

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);

const astroSim = derived(simCurrentDate, calculateProperties);

// ThreeJS is y-up so we change the coordinates
export const sim: Readable<SimProps> = derived(astroSim, transformSimPropsForThreeJS);
export const earthOrbit = derived(simStartDate, ($d) => calcOrbit(astro.Body.Sun, $d));

function astroToThreeJS(input: astro.Vector): THREE.Vector3 {
    const threeV = new THREE.Vector3(input.x, input.z, input.y) // switch Y and Z
    return threeV.multiplyScalar(astro.KM_PER_AU);
}

function transformSimPropsForThreeJS(astroSim: SimPropsAstro): SimProps {
    return {
        earth: {
            pos: astroToThreeJS(astroSim.earth.pos)
        }
    }
}


function calcOrbit(body: astro.Body, date: Date,): THREE.Vector3[] {
    const astroOrbit = calculateEarthOrbit(date);
    return astroOrbit.map(astroToThreeJS);
}