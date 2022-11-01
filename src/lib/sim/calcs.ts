import { Vector3 } from 'three';
import * as astro from 'astronomy-engine';
import type { SimProps } from '$lib/types';

export function calculateProperties(date: Date): SimProps {
    const aPos = astro.HelioVector(astro.Body.Earth, date)
    const tPos = new Vector3(aPos.x, aPos.y, aPos.z)
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
    const segments = 360;

    const points: Vector3[] = [];
    const segmentDelta = yearMs / segments;
    const firstDate = new Date(date.getTime() - 6 * monthMs);

    let nextDate = firstDate;
    for (let i = 0; i <= segments; i++) {
        nextDate = new Date(nextDate.getTime() + segmentDelta);
        const aPos = astro.HelioVector(astro.Body.Earth, nextDate);
        const tPos = new Vector3(aPos.x, aPos.y, aPos.z);
        points.push(tPos.multiplyScalar(astro.KM_PER_AU))
    }

    return points;
}