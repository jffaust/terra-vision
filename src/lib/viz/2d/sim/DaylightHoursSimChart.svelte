<script lang="ts">
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import { scaleBand, scaleTime } from 'd3-scale';
	import { astroSkySim } from '$lib/sim/astro';
	import dateFormat from 'dateformat';
	import MultiLine from '$lib/gaphics/2d/MultiLine.svelte';
	import CustomCircle from '$lib/gaphics/2d/CustomCircle.svelte';
	import { formatGPSCoords, getTimeInSeconds } from '$lib/utils';
	import { interpolateRgb } from 'd3-interpolate';
	import { onDestroy } from 'svelte';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import Column from '$lib/gaphics/2d/Column.svelte';
	import ColumnDateChart from '$lib/gaphics/2d/charts/ColumnDateChart.svelte';

	interface DataPoint {
		x: Date; // Date object used on the X axis
		y: number; // number of hours of daylight
	}

	let title = `Daylight hours for location ${formatGPSCoords($simGPS)}`;
	let currentYear = $simCurrentDate.getFullYear();
	$: data = calcData($simCurrentDate, $astroSkySim.altitude);

	const unsub = simGPS.subscribe(resetData);

	onDestroy(unsub);

	function resetData() {
		data = initData(currentYear);
	}

	function calcData(date: Date, altitude: number): DataPoint[] {
		if (!data || date.getFullYear() != currentYear) {
			currentYear = date.getFullYear();
			data = initData(currentYear);
		}

		const currentDateKey = formatDateKey(date);
		let dayData = data.find((d) => formatDateKey(d.x) == currentDateKey);

		if (!dayData) {
			dayData = { x: date, y: 0 };
			data.push(dayData);
		}

		dayData.y = date.getHours() + date.getMinutes() / 60;

		return data;
	}

	function initData(year: number): DataPoint[] {
		let initial: DataPoint[] = [];
		let tmpDate = new Date(year, 0, 1);
		while (tmpDate.getFullYear() == year) {
			initial.push({
				x: new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()),
				y: 0
			});
			tmpDate.setDate(tmpDate.getDate() + 1);
		}
		return initial;
	}

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}
</script>

{#if !$simGPS}
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
