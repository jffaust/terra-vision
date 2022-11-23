import { degToRad } from "three/src/math/MathUtils";
import * as THREE from 'three';

// Maybe use astro.ObserverVector instead
export function gpsToCartesian(lon: number, lat: number, radius: number): THREE.Vector3 {
    // This assumes that the equator is perpendicular to the Y-up plane and
    // that the prime meridian is perpendicular to the Z plane
    const gpsZeroZero = new THREE.Vector3(radius, 0, 0)
    const rotation = new THREE.Euler(0, degToRad(lon), degToRad(lat))
    return gpsZeroZero.applyEuler(rotation);
}

// export function sphericalToCartesian(lon: number, lat: number, radius: number): THREE.Vector3 {
//     let result = {
//         x: Math.sin(degToRad(lon)) * Math.cos(degToRad(lat)) * radius,
//         y: Math.sin(degToRad(lat)) * radius,
//         z: Math.cos(degToRad(lon)) * Math.cos(degToRad(lat)) * radius
//     };
//     //console.log(result);
//     return new THREE.Vector3(result.x, result.y, result.z);
// }

export function getGPSRingSize(lat: number, radius: number) {
    return Math.cos(degToRad(lat)) * radius;
}