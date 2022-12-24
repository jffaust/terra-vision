export const CTX_TEXTURES = Symbol("textures");

export interface Point2D {
    x: number;
    y: number;
}

export interface GPSCoords {
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
    SunAltitudeChart,
    TestEarthTilt,
    TestEarthSpin,
    TestObserver,
    SunWithShaders
}

export interface View {
    id: string; // generated with crypto.randomUUID();
    type: VizTypes;
    region: Rect; // percentages (0 to 1)
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number
}
