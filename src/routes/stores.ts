import { get, writable, type Writable } from 'svelte/store';

export enum AppView {
    Map,
    Sunlight
}
export const appView = writable(AppView.Map);

export interface CameraView {
    centerLonLat: [number, number];
    rotation: number; // radians
    zoom: number; // arbitrary unit
}

export const collapsed = writable(true);
export const initialView: Writable<CameraView> = writable({
    centerLonLat: [-73.408560, 45.487928],
    rotation: 0,
    zoom: 18
});