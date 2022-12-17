import { writable } from "svelte/store";
import type { GPSCoords } from '$lib/types';

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);
export const simGPS = writable<GPSCoords | null>(null)