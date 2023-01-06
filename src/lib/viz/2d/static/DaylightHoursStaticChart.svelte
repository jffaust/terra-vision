<script lang="ts">
	import ColumnDateChart, { type DataPoint } from '$lib/gaphics/2d/charts/ColumnDateChart.svelte';
	import { formatGPSCoords } from '$lib/utils';
	import type { GPSCoords } from '$lib/types';

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
				y: Math.random() * 24
			});
			tmpDate.setDate(tmpDate.getDate() + 1);
		}
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
