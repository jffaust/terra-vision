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