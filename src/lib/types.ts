import type * as THREE from 'three';
import type * as ae from 'astronomy-engine';

export enum Textures {
    MilkyWay,
    Sun,
    EarthColor,
}

export enum ViewTypes {
    SpaceSim,
    Test
}

export interface View {
    id: number;
    type: ViewTypes;
    region: Rect; // percentages
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number
}

// Z-up
// Ecliptic positions relative to the sun, in Astronomical Units
export interface AstroSimData {
    earth: {
        pos: ae.Vector;
        axis: ae.AxisInfo;
    }
}

export interface AxisInfo {
    north: THREE.Vector3; // normalized, Y-up
    spin: number; // radians
}

// Y-up
// Ecliptic positions relative to the sun, in Kilometers
export interface SimData {
    earth: {
        pos: THREE.Vector3;
        axis: AxisInfo;
    }
}