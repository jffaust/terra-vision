<script lang="ts">
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import Scatter from '$lib/gaphics/2d/Scatter.svelte';
	import { scaleTime } from 'd3-scale';
	import { astroSkySim } from '$lib/sim/astro';
	import CurvedLine from '$lib/gaphics/2d/CurvedLine.svelte';
	import dateFormat from 'dateformat';
	import MultiLine from '$lib/gaphics/2d/MultiLine.svelte';

	interface DataPoint {
		x: number; // number of seconds since midnight
		y: number; // positive altitude of the sun
		date: string;
	}

	interface Series {
		date: string;
		values: DataPoint[];
	}

	const lineTimeGranularity = 60 * 5; // 5 minutes

	// Define some data
	// $: points = calcDataPoints($simCurrentDate, $astroSkySim.altitude);
	$: data = calcDataPoints2($simCurrentDate, $astroSkySim.altitude);

	// function calcDataPoints(date: Date, altitude: number): DataPoint[] {
	// 	if (altitude < 0) return [];
	// 	else return [{ x: getTimeInSeconds(date), y: altitude }];
	// }

	function calcDataPoints2(date: Date, altitude: number): Series[] {
		const currentDateKey = formatDateKey(date);

		if (!data) {
			data = [];
		}

		let series = findSeries(date);
		if (!series) {
			series = { date: currentDateKey, values: [] };
			data.push(series);
		}

		if (altitude >= 0) {
			let append = false;
			const currentTime = getTimeInSeconds(date);

			if (series.values.length == 0) {
				append = true;
			} else {
				const lastTime = series.values[data.length - 1].x;
				if (currentTime - lastTime > lineTimeGranularity) {
					append = true;
				}
			}

			if (append) {
				series.values.push({ x: currentTime, y: altitude, date: currentDateKey });
			}
		}

		return data;
	}

	function findSeries(date: Date): Series | undefined {
		return data.find((s) => s.date === formatDateKey(date));
	}

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function getTimeInSeconds(d: Date): number {
		return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
	}

	function formatTimeTick(d: number): string {
		return `${Math.floor(d / 60 / 60)}:00`;
	}
</script>

<div class="main">
	{#if !$simGPS}
		<p><i>GPS position required</i></p>
	{:else}
		<div class="chart-container">
			<LayerCake
				{data}
				x="x"
				y="y"
				z="date"
				xDomain={[0, 24 * 60 * 60]}
				yDomain={[0, 100]}
				xScale={scaleTime()}
			>
				<!-- Components go here -->
				<Svg>
					<AxisX
						ticks={[0, 4, 8, 12, 16, 20, 24].map((d) => d * 60 * 60)}
						formatTick={formatTimeTick}
					/>
					<AxisY />
					<MultiLine />
					<!-- <Scatter fill={'yellow'} r={3} /> -->
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
		align-items: center;
		justify-content: center;
	}
	.chart-container {
		width: 80%;
		height: 80%;
	}
</style>
