import * as astro from 'astronomy-engine';
import { derived, get, writable } from "svelte/store";
import { Vector3 } from 'three';

export const playSimulation = writable<boolean>(false);
export const datetime = writable<Date>(new Date());

export const pos = derived(datetime, updateSimulation);

// export const orbit = derived(pos, updateSimulation);

function updateSimulation(date: Date): Vector3 {
    //pos.set(get(pos) + 1)
    const aPos = astro.HelioVector(astro.Body.Earth, date)
    const tPos = new Vector3(aPos.x, aPos.y, aPos.z)
    return tPos.multiplyScalar(10)
}