import type { GPSCoords } from "$lib/types";
import { getTimeInSeconds } from "$lib/utils";
import * as ae from 'astronomy-engine';

export interface AltitudeData {
    time: number; // number of seconds since midnight
    altitude: number; // altitude in degrees (max 90)
}

export function calcSunAltitudeDay(year: number, month: number, day: number, pos: GPSCoords, tickSeconds: number): AltitudeData[] {
    const data: AltitudeData[] = [];
    const date = new Date(year, month, day);
    do {
        data.push({ time: getTimeInSeconds(date), altitude: calcSunAltitude(date, pos).altitude })
        date.setSeconds(date.getSeconds() + tickSeconds);
    } while (date.getDate() == day)
    return data;
}

export function calcSunAltitude(date: Date, pos: GPSCoords): ae.HorizontalCoordinates {
    const obs = new ae.Observer(pos.lat, pos.lon, 0);
    const eq = ae.Equator(ae.Body.Sun, date, obs, true, true);
    return ae.Horizon(date, obs, eq.ra, eq.dec, "normal");
}