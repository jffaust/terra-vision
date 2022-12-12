export const CTX_TEXTURES = Symbol("textures");

export interface Point2D {
    x: number;
    y: number;
}

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
    SkyView,
    TestEarthTilt,
    TestEarthSpin,
    TestObserver,
}

export interface View {
    id: number;
    type: VizTypes;
    region: Rect; // percentages (0 to 1)
    splitSibling?: View
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number
}
