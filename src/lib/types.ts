export enum Textures {
    MilkyWay,
    Sun,
    EarthColor,
}

export enum ViewTypes {
    SpaceSim
}

export interface View {
    id: number;
    view: ViewTypes;
    region: Rect; // percentages
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number
}