import type { AstroSimData } from '$lib/types';
import * as ae from 'astronomy-engine';
import { derived, writable } from "svelte/store";

const start = new Date();
export const simStartDate = writable<Date>(start)
export const simCurrentDate = writable<Date>(start);

// not to be consumed by ThreeJS directly (z-up, in astronomical units)
export const astroSim = derived(simCurrentDate, calculateProperties);
export const astroEarthOrbit = derived(simStartDate, calculateEarthOrbit);

function calculateProperties(date: Date): AstroSimData {
    const pos = ae.Ecliptic(ae.HelioVector(ae.Body.Earth, date)).vec;
    const info = ae.RotationAxis(ae.Body.Earth, date)
    const eclipticNorth = ae.Ecliptic(info.north).vec
    const axis = new ae.AxisInfo(info.ra, info.dec, info.spin, eclipticNorth);
    return { earth: { pos, axis } };
}

// calculates the orbital points for 6 months before the given date and 
// to 6 months after (to allow moving backward and forward in the sim)
function calculateEarthOrbit(date: Date): ae.Vector[] {
    const monthMs = 2629743833.333;
    const yearMs = monthMs * 12;
    const segments = 3600;

    const points: ae.Vector[] = [];
    const segmentDelta = yearMs / segments;
    const firstDate = new Date(date.getTime() - 6 * monthMs);

    let nextDate = firstDate;
    for (let i = 0; i <= segments; i++) {
        nextDate = new Date(nextDate.getTime() + segmentDelta);
        const pos = ae.HelioVector(ae.Body.Earth, nextDate)
        points.push(ae.Ecliptic(pos).vec)
    }

    return points;
}