<script lang="ts">
	import MultiLineTimeChart, {
		type Series
	} from '$lib/gaphics/2d/charts/MultiLineTimeChart.svelte';
	import { interpolateRgb, interpolateRgbBasis } from 'd3-interpolate';
	import dateFormat from 'dateformat';
	import { formatGPSCoords } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';
	import { calcSunAltitudeDay } from '$lib/data/sun';

	export let pos: GPSCoords | null;

	let title = `Altitude of the sun over time for location ${formatGPSCoords(pos)} `;
	$: seriesData = calcSeriesData(pos, new Date().getFullYear());

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function calcSeriesData(coords: GPSCoords | null, year: number): Series[] {
		console.log('refreshing');
		if (coords == null) return [];

		let data: Series[] = [];
		let date = new Date(year, 0, 1);

		while (date.getFullYear() == year) {
			const dateKey = formatDateKey(date);
			const dayData = calcSunAltitudeDay(
				year,
				date.getMonth(),
				date.getDate(),
				coords,
				86400 / (60 * 5)
			);
			const seriesDayData: Series = {
				date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
				dateKey,
				values: dayData
					.filter((d) => d.altitude >= 0)
					.map((d) => ({
						x: d.time,
						y: d.altitude,
						date: dateKey
					}))
			};

			data.push(seriesDayData);
			date.setDate(date.getDate() + 1);
		}

		// const testData = data.slice(0, 5);
		// console.log(testData);
		// return testData;
		return data;
	}

	function calcSeriesStrokeColor(series: Series, index: number): string {
		const percent = index > 364 ? 1 : index / 364;
		return interpolateRgbBasis(['red', 'yellow', 'red'])(percent);
	}
</script>

{#if !pos}
	<div class="msg">
		<p><i>GPS position required</i></p>
	</div>
{:else}
	<MultiLineTimeChart {title} {seriesData} {calcSeriesStrokeColor} />
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
