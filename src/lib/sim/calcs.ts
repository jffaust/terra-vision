import * as astro from 'astronomy-engine';
import type { SimPropsAstro } from '$lib/types';

export function calculateProperties(date: Date): SimPropsAstro {
    const gv = astro.GeoVector(astro.Body.Sun, date, true);
    const pos = astro.Ecliptic(gv).vec;
    // Inverse the vector to get the Earth's position relative to the sun
    const helioPos = new astro.Vector(-pos.x, -pos.y, -pos.z, pos.t)
    return { earth: { pos: helioPos } }
}

// calculates the orbital points for 6 months before the given date and 
// to 6 months after (to allow moving backward and forward in the sim)
export function calculateEarthOrbit(date: Date): astro.Vector[] {
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