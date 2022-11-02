import { degToRad } from "three/src/math/MathUtils";
import * as THREE from 'three';

export function sphericalToCartesian(lon: number, lat: number, radius: number): THREE.Vector3 {
    let result = {
        x: Math.sin(degToRad(lon)) * Math.cos(degToRad(lat)) * radius,
        y: Math.sin(degToRad(lat)) * radius,
        z: Math.cos(degToRad(lon)) * Math.cos(degToRad(lat)) * radius
    };
    //console.log(result);
    return new THREE.Vector3(result.x, result.y, result.z);
}

export function getSphericalHorizontalRingSize(lat: number, radius: number) {
    return Math.cos(degToRad(lat)) * radius;
}