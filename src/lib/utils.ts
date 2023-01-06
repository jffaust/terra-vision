import type { GPSCoords, Rect } from "./types";

export function updateSearchParams(key: string, val: string | null, replaceState: boolean) {

    var searchParams = new URLSearchParams(window.location.search);

    if (val) {
        searchParams.set(key, val);
    } else {
        searchParams.delete(key);
    }

    let newLocation = new URL(window.location.href);
    newLocation.search = searchParams.toString();

    if (replaceState) {
        window.history.replaceState(null, document.title, newLocation.href);
    } else {
        window.history.pushState(null, document.title, newLocation.href);
    }
}

export function copyRegion(source: Rect): Rect {
    return {
        left: source.left,
        top: source.top,
        width: source.width,
        height: source.height
    };
}

export function isIdenticalRegion(a: Rect, b: Rect) {
    return a.left == b.left && a.top == b.top && a.width == b.width && a.height == b.height;
}

export function getTimeInSeconds(d: Date): number {
    return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
}

export function getTimeInHours(d: Date): number {
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / (60 * 60);
}

export function formatGPSCoords(coords: GPSCoords | null) {
    if (!coords) return "";
    else return `${coords.lat}, ${coords.lon}`
}