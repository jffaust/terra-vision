<script lang="ts">
	import SunAltitudeChart, { type Series } from '$lib/gaphics/2d/charts/MultiLineTimeChart.svelte';
	import { interpolateRgb } from 'd3-interpolate';
	import dateFormat from 'dateformat';
	import { formatGPSCoords } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';
	import { calcSunAltitudeDay } from '$lib/data/sun';

	export let pos: GPSCoords | null;

	let title = `Altitude of the sun over time for location ${formatGPSCoords(pos)} `;
	let seriesData = calcSeriesData(new Date().getFullYear());

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function calcSeriesData(year: number): Series[] {
		console.log('refreshing');
		if (pos == null) return [];

		let data: Series[] = [];
		let date = new Date(year, 0, 1);

		while (date.getFullYear() == year) {
			const dateKey = formatDateKey(date);
			const dayData = calcSunAltitudeDay(
				year,
				date.getMonth(),
				date.getDay(),
				pos,
				86400 / (60 * 5)
			);
			const seriesDayData: Series = {
				date,
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

		console.log(data);
		return data;
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
