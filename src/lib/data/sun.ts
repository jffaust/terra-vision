import type { GPSCoords } from "$lib/types";
import { getTimeInHours, getTimeInSeconds } from "$lib/utils";
import * as ae from 'astronomy-engine';

export function calcDaylightHoursDay(year: number, month: number, day: number, pos: GPSCoords): number {

    const date = new Date(year, month, day);
    const obs = new ae.Observer(pos.lat, pos.lon, 0);
    const nextSunrise = ae.SearchRiseSet(ae.Body.Sun, obs, 1, date, 365);
    const nextSunset = ae.SearchRiseSet(ae.Body.Sun, obs, -1, date, 365);

    let result = 0;
    if (nextSunrise && nextSunset) {
        if (nextSunrise.date.getDate() == day && nextSunset.date.getDate() == day) {
            const msDiff = nextSunset.date.getTime() - nextSunrise.date.getTime();
            result = msDiff / (1000 * 60 * 60);
        } else if (nextSunrise.date.getDate() == day && nextSunset.date.getDate() != day) {
            result = 24 - getTimeInHours(nextSunrise.date);
        } else if (nextSunrise.date.getDate() != day && nextSunset.date.getDate() == day) {
            result = getTimeInHours(nextSunset.date);
        } else {
            // it will not rise or set today

            if (nextSunrise.date.getTime() < nextSunset.date.getTime()) {
                // the sun will rise next, so it is currently hidden
                result = 0;
            } else {
                // the sun will set next, so it is currently visible
                result = 24;
            }
        }
    }

    if (result < 0) {
        console.log("fdskljfklsdjf;lsjf;sdkfj")
    }

    return result;
}

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