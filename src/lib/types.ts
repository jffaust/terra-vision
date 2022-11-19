export const texturesContextKey = Symbol("textures");

export interface GPS {
    lon: number;
    lat: number;
}

export enum Textures {
    MilkyWay,
    Sun,
    EarthColor,
    EarthSpecular
}

export enum VizTypes {
    DefaultSpace,
    TestEarthSpin,
    TestGPS
}

export interface View {
    id: number;
    type: VizTypes;
    region: Rect; // percentages
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number
}
