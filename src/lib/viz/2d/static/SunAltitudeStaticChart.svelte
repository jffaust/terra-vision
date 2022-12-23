<script lang="ts">
	import SunAltitudeChart, { type DataPoint, type Series } from '../charts/SunAltitudeChart.svelte';
	import { interpolateRgb } from 'd3-interpolate';
	import { onDestroy } from 'svelte';
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { astroSkySim } from '$lib/sim/astro';
	import dateFormat from 'dateformat';
	import { getTimeInSeconds } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';

	const maxDaysToKeep = 20;
	const lineTimeGranularity = 60 * 2; // 5 minutes

	$: trailData = calcTrailData($simCurrentDate, $astroSkySim.altitude, $simGPS);

	const unsub = simGPS.subscribe(resetTrailData);

	onDestroy(unsub);

	function resetTrailData() {
		trailData = [];
	}

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function findSeries(date: Date): Series | undefined {
		return trailData.find((s) => s.dateKey == formatDateKey(date));
	}

	function calcTrailData(date: Date, altitude: number, pos: GPSCoords | null): Series[] {
		if (pos == null) return [];

		const currentDateKey = formatDateKey(date);

		if (!trailData) {
			trailData = [];
		}

		if (trailData.length > 0) {
			const first = trailData[0];
			const diffMs = date.getTime() - first.date.getTime();
			if (diffMs / (1000 * 60 * 60 * 24) > maxDaysToKeep) {
				trailData.splice(0, 1);
			}
		}

		let series = findSeries(date);
		if (altitude >= 0) {
			let append = false;
			const currentTime = getTimeInSeconds(date);

			if (!series) {
				append = true;
				series = { date, dateKey: currentDateKey, values: [] };
				trailData.push(series);
			}

			if (series.values.length > 0) {
				const lastTime = series.values[series.values.length - 1].x;
				if (currentTime - lastTime > lineTimeGranularity) {
					append = true;
				}
			}

			if (append) {
				series.values.push({ x: currentTime, y: altitude, date: currentDateKey });
			}
		}

		return trailData;
	}

	function calcSeriesStrokeColor(series: Series, index: number): string {
		if (index == trailData.length - 1) {
			if (series.date.getDate() == $simCurrentDate.getDate()) return 'yellow';
			else return 'gray';
		} else {
			const distPenultimate = trailData.length - 2 - index;
			const percent = distPenultimate / maxDaysToKeep;
			return interpolateRgb('gray', '#1d1f21')(percent);
		}
	}
</script>

<SunAltitudeChart {trailData} {calcSeriesStrokeColor} />
