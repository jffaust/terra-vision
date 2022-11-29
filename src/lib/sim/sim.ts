import { writable } from "svelte/store";
import type { GPS } from '$lib/types';

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);
export const simGPS = writable<GPS>({ lat: 45.5114752, lon: -73.4363648 })