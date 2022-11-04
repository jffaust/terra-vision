import { get, writable, type Writable } from 'svelte/store';

export enum AppView {
    Map,
    Sunlight
}
export const appView = writable(AppView.Map);

export interface CameraView {
    center: {
        lon: number;
        lat: number;
    }
    rotation: number; // radians
    zoom: number; // arbitrary unit
}

export const collapsed = writable(true);
export const mapsCamera: Writable<CameraView> = writable({
    center:
        { lon: -73.408560, lat: 45.487928 },
    rotation: 0,
    zoom: 18
});