import * as astro from 'astronomy-engine';
import { get, writable } from "svelte/store";

export const playSimulation = writable<boolean>(false);
export const datetime = writable<Date>(new Date());

export const pos = writable<number>(0);
datetime.subscribe(updateSimulation)

function updateSimulation(date: Date) {
    //pos.set(get(pos) + 1)
    console.log(astro.HelioVector(astro.Body.Earth, date))
}
