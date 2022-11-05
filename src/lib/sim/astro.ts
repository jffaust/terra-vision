import * as ae from 'astronomy-engine';
import { derived } from "svelte/store";
import { simCurrentDate, simStartDate } from './sim';

export const ASTRO_SUN_INTENSITY = 500000; // arbitrary value that will scale too
export const ASTRO_SUN_RADIUS = 0.004650467// 695700÷149597870.7 (km / au)
export const ASTRO_EARTH_RADIUS = 0.000042588; // 6371÷149597870.7 (km / au)
export const ASTRO_EARTH_ORBIT_RADIUS = 1; // approx radius of Earth's orbit

// Z-up
// Ecliptic positions relative to the sun, in Astronomical Units
export interface AstroSimData {
    earth: {
        pos: ae.Vector;
        axis: ae.AxisInfo;
    }
}

// not to be consumed by ThreeJS directly (z-up, in astronomical units)
export const astroSim = derived(simCurrentDate, calculateProperties);
export const astroEarthOrbit = derived(simStartDate, calculateEarthOrbit);

// calculate simulation properties: earth's position and axis (north pole and spin)
function calculateProperties(date: Date): AstroSimData {
    const pos = calculateEarthPosition(date);
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
        points.push(calculateEarthPosition(nextDate))
    }

    return points;
}

// The goal of the simulation is to understand how sunlight affects the Earth.
// Thus, the positions calculated will be "apparent" positions that are the result of 
// physically correcting the astrometric/true positions by considering the times it takes
// for light to travel. This will simplify rendering as light is instantaneous in ThreeJS.
// Equinoxes and solstices are based on the apparent position too.
function calculateEarthPosition(date: Date) {
    // Use GeoVector function instead of HelioVector because GeoVector 
    // corrects the true position to get the apparent one. 
    // Not sure if we should correct for aberration or not.
    const sun = ae.GeoVector(ae.Body.Sun, date, false);
    // Inverse the vector to get an heliocentric (relative to the sun) position
    const earth = new ae.Vector(-sun.x, -sun.y, -sun.z, sun.t)
    // Rotate from EQJ to Ecliptic plane so that simulation appears horizontal
    return ae.Ecliptic(earth).vec;
}