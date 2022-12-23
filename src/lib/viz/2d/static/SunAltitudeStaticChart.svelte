<script lang="ts">
	import SunAltitudeChart, {
		type DataPoint,
		type Series
	} from '../../../gaphics/2d/charts/MultiLineTimeChart.svelte';
	import { interpolateRgb } from 'd3-interpolate';
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { astroSkySim } from '$lib/sim/astro';
	import dateFormat from 'dateformat';
	import { formatGPSCoords, getTimeInSeconds } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';

	export let pos: GPSCoords | null;

	const maxDaysToKeep = 20;
	const lineTimeGranularity = 60 * 2; // 5 minutes

	$: title = `Altitude of the sun over time for location ${formatGPSCoords(pos)} `;
	$: seriesData = calcTrailData($simCurrentDate, $astroSkySim.altitude, pos);

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function findSeries(date: Date): Series | undefined {
		return seriesData.find((s) => s.dateKey == formatDateKey(date));
	}

	function calcTrailData(date: Date, altitude: number, position: GPSCoords | null): Series[] {
		if (position == null) return [];

		const currentDateKey = formatDateKey(date);

		if (!seriesData) {
			seriesData = [];
		}

		return seriesData;
	}

	function calcSeriesStrokeColor(series: Series, index: number): string {
		const percent = index > 364 ? 1 : index / 364;
		return interpolateRgb('gray', 'white')(percent);
	}
</script>

{#if !pos}
	<div class="msg">
		<p><i>GPS position required</i></p>
	</div>
{:else}
	<SunAltitudeChart {title} {seriesData} {calcSeriesStrokeColor} />
{/if}
