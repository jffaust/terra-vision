<script lang="ts">
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import { scaleTime } from 'd3-scale';
	import { astroSkySim } from '$lib/sim/astro';
	import dateFormat from 'dateformat';
	import MultiLine from '$lib/gaphics/2d/MultiLine.svelte';
	import CustomCircle from '$lib/gaphics/2d/CustomCircle.svelte';
	import { formatGPSCoords, getTimeInSeconds } from '$lib/utils';
	import { interpolateRgb } from 'd3-interpolate';
	import { onDestroy } from 'svelte';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';

	interface DataPoint {
		x: Date; // Date object used on the X axis
		y: number; // number of hours of daylight
	}

	$: jan1st = new Date($simCurrentDate.getFullYear());
	$: dec31st = new Date($simCurrentDate.getFullYear(), 11, 31);
	$: data = calcData($simCurrentDate, $astroSkySim.altitude);

	const unsub = simGPS.subscribe(resetData);

	onDestroy(unsub);

	function resetData() {
		data = [];
	}

	function calcData(date: Date, altitude: number): DataPoint[] {
		if (!data) {
			data = [];
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

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function formatTimeTick(date: Date): string {
		return dateFormat(date, 'mmm d');
	}
</script>

<div class="main">
	{#if !$simGPS}
		<p><i>GPS position required</i></p>
	{:else}
		<header>
			<div style={parent_style}>
				<p use:fit>
					<i>Daylight hours for location {formatGPSCoords($simGPS)} </i>
				</p>
			</div>
		</header>
		<div class="chart-container">
			<LayerCake
				{data}
				x="x"
				y="y"
				xDomain={[jan1st, dec31st]}
				yDomain={[0, 24]}
				xScale={scaleTime()}
			>
				<!-- Components go here -->
				<Svg>
					<AxisX formatTick={formatTimeTick} textColor="white" />
					<AxisY textColor="white" />
				</Svg>
			</LayerCake>
		</div>
	{/if}
</div>

<style>
	.main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	header {
		height: 10%;
		width: 75%;
		text-align: center;
	}

	.chart-container {
		width: 90%;
		height: 80%;
	}
</style>
