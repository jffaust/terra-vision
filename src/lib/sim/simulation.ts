import * as astro from 'astronomy-engine';
import { derived, get, writable } from "svelte/store";
import { Vector3 } from 'three';
import { calculateOrbits, calculateProperties } from './calcs';

export const playSimulation = writable<boolean>(false);

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);

export const sim = derived(simCurrentDate, calculateProperties);
export const orbit = derived(simStartDate, calculateOrbits);
