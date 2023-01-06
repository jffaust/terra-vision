<script lang="ts">
	import ColumnDateChart, { type DataPoint } from '$lib/gaphics/2d/charts/ColumnDateChart.svelte';
	import { formatGPSCoords } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';
	import { calcDaylightHoursDay } from '$lib/data/sun';

	export let pos: GPSCoords | null;

	let title = `Daylight hours for location ${formatGPSCoords(pos)}`;
	$: data = calcData(pos, new Date().getFullYear());

	function calcData(coords: GPSCoords | null, year: number): DataPoint[] {
		if (coords == null) return [];

		let initial: DataPoint[] = [];
		let tmpDate = new Date(year, 0, 1);
		while (tmpDate.getFullYear() == year) {
			initial.push({
				x: new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()),
				y: calcDaylightHoursDay(
					tmpDate.getFullYear(),
					tmpDate.getMonth(),
					tmpDate.getDate(),
					coords
				)
			});
			tmpDate.setDate(tmpDate.getDate() + 1);
		}
		console.log(initial);
		return initial;
	}
</script>

{#if !pos}
	<div class="msg">
		<p><i>GPS position required</i></p>
	</div>
{:else}
	<ColumnDateChart {title} {data} />
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
