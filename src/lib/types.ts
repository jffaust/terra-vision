import type * as THREE from 'three';
import type * as astro from 'astronomy-engine';

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
export interface SimPropsAstro {
    earth: {
        pos: astro.Vector;
    }
}

// Y-up
// Ecliptic positions relative to the sun, in Kilometers
export interface SimProps {
    earth: {
        pos: THREE.Vector3;
    }
}