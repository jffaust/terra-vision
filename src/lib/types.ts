import type { Vector3 } from 'three';

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

export interface SimProps {
    earth: {
        pos: Vector3;
    }
}