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