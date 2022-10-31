import { writable } from "svelte/store";

export const playSimulation = writable<boolean>(false);
export const datetime = writable<Date>(new Date());
