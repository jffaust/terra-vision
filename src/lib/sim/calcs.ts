import { Vector3 } from 'three';
import * as astro from 'astronomy-engine';
import type { SimProps } from '$lib/types';

export function calculateProperties(date: Date): SimProps {
    const hVec = astro.HelioVector(astro.Body.Earth, date)
    const eVec = astro.Ecliptic(hVec).vec;
    const tPos = new Vector3(eVec.x, eVec.y, eVec.z)
    return {
        earth: {
            pos: tPos.multiplyScalar(astro.KM_PER_AU)
        }
    }
}

// calculates the orbital points for 6 months before the given date and 
// to 6 months after
export function calculateOrbits(date: Date): Vector3[] {
    const monthMs = 2629743833.333;
    const yearMs = monthMs * 12;
    const segments = 3600;

    const points: Vector3[] = [];
    const segmentDelta = yearMs / segments;
    const firstDate = new Date(date.getTime() - 6 * monthMs);

    let nextDate = firstDate;
    for (let i = 0; i <= segments; i++) {
        nextDate = new Date(nextDate.getTime() + segmentDelta);
        const hVec = astro.HelioVector(astro.Body.Earth, nextDate)
        const eVec = astro.Ecliptic(hVec).vec;
        const tPos = new Vector3(eVec.x, eVec.y, eVec.z)
        points.push(tPos.multiplyScalar(astro.KM_PER_AU))
    }

    return points;
}