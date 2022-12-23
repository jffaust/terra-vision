<script lang="ts">
	import SunAltitudeChart, {
		type DataPoint,
		type Series
	} from '$lib/gaphics/2d/charts/MultiLineTimeChart.svelte';
	import { interpolateRgb } from 'd3-interpolate';
	import { onDestroy } from 'svelte';
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { astroSkySim } from '$lib/sim/astro';
	import CustomCircle from '$lib/gaphics/2d/CustomCircle.svelte';
	import dateFormat from 'dateformat';
	import { formatGPSCoords, getTimeInSeconds } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';

	const maxDaysToKeep = 20;
	const lineTimeGranularity = 60 * 2; // 5 minutes

	$: title = `Altitude of the sun over time for location ${formatGPSCoords($simGPS)} `;
	$: currentData = calcCurrentData($simCurrentDate, $astroSkySim.altitude);
	$: seriesData = calcSeriesData($simCurrentDate, $astroSkySim.altitude, $simGPS);

	const unsub = simGPS.subscribe(resetTrailData);

	onDestroy(unsub);

	function resetTrailData() {
		seriesData = [];
	}

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function findSeries(date: Date): Series | undefined {
		return seriesData.find((s) => s.dateKey == formatDateKey(date));
	}

	function calcCurrentData(date: Date, altitude: number): DataPoint | null {
		if (altitude < 0) return null;
		else return { x: getTimeInSeconds(date), y: altitude, date: '' };
	}
	function calcSeriesData(date: Date, altitude: number, position: GPSCoords | null): Series[] {
		if (position == null) return [];

		const currentDateKey = formatDateKey(date);

		if (!seriesData) {
			seriesData = [];
		}

		if (seriesData.length > 0) {
			const first = seriesData[0];
			const diffMs = date.getTime() - first.date.getTime();
			if (diffMs / (1000 * 60 * 60 * 24) > maxDaysToKeep) {
				seriesData.splice(0, 1);
			}
		}

		let series = findSeries(date);
		if (altitude >= 0) {
			let append = false;
			const currentTime = getTimeInSeconds(date);

			if (!series) {
				append = true;
				series = { date, dateKey: currentDateKey, values: [] };
				seriesData.push(series);
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

		return seriesData;
	}

	function calcSeriesStrokeColor(series: Series, index: number): string {
		if (index == seriesData.length - 1) {
			if (series.date.getDate() == $simCurrentDate.getDate()) return 'yellow';
			else return 'gray';
		} else {
			const distPenultimate = seriesData.length - 2 - index;
			const percent = distPenultimate / maxDaysToKeep;
			return interpolateRgb('gray', '#1d1f21')(percent);
		}
	}
</script>

{#if !$simGPS}
	<div class="msg">
		<p><i>GPS position required</i></p>
	</div>
{:else}
	<SunAltitudeChart {title} {seriesData} {calcSeriesStrokeColor}>
		{#if currentData}
			<CustomCircle fill={'yellow'} r={5} x={currentData.x} y={currentData.y} />
		{/if}
	</SunAltitudeChart>
{/if}

<style>
	.msg {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
