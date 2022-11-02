import type { AstroSimData } from '$lib/types';
import * as astro from 'astronomy-engine';
import { derived, writable } from "svelte/store";

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);

// not to be consumed by ThreeJS directly (z-up, in astronomical units)
export const astroSim = derived(simCurrentDate, calculateProperties);
export const astroEarthOrbit = derived(simStartDate, calculateEarthOrbit);

function calculateProperties(date: Date): AstroSimData {

    const ai = astro.RotationAxis(astro.Body.Earth, date);
    console.log(ai);
    console.log(astro.Ecliptic(ai.north))

    // Use GeoVector instead of HelioVector to have the position corrected for light travel time and aberration
    const gv = astro.GeoVector(astro.Body.Sun, date, true);
    // Transform to ecliptic coordinates so the orbit appears on the horizontal plane in the scene
    const ec = astro.Ecliptic(gv).vec;
    // Sun will be at the origin so we inverse the vector to get the Earth's position relative to 
    const pos = new astro.Vector(-ec.x, -ec.y, -ec.z, ec.t)

    return { earth: { pos } };
}

// calculates the orbital points for 6 months before the given date and 
// to 6 months after (to allow moving backward and forward in the sim)
function calculateEarthOrbit(date: Date): astro.Vector[] {
    const monthMs = 2629743833.333;
    const yearMs = monthMs * 12;
    const segments = 3600;

    const points: astro.Vector[] = [];
    const segmentDelta = yearMs / segments;
    const firstDate = new Date(date.getTime() - 6 * monthMs);

    let nextDate = firstDate;
    for (let i = 0; i <= segments; i++) {
        nextDate = new Date(nextDate.getTime() + segmentDelta);
        const gv = astro.GeoVector(astro.Body.Sun, nextDate, true);
        const pos = astro.Ecliptic(gv).vec;
        // Inverse the vector to get the Earth's position relative to the sun
        const helioPos = new astro.Vector(-pos.x, -pos.y, -pos.z, pos.t)
        points.push(helioPos)
    }

    return points;
}