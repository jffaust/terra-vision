import type { Rect } from "./types";

export function updateSearchParams(key: string, val: string, replaceState: boolean) {

    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, val);

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