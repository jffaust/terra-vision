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
		x: number; // number of seconds since midnight
		y: number; // positive altitude of the sun
		date: string;
	}

	interface Series {
		date: Date;
		dateKey: string;
		values: DataPoint[];
	}

	const maxDaysToKeep = 20;
	const lineTimeGranularity = 60 * 2; // 5 minutes

	$: currentData = calcCurrentData($simCurrentDate, $astroSkySim.altitude);
	$: trailData = calcTrailData($simCurrentDate, $astroSkySim.altitude);

	const unsub = simGPS.subscribe(resetTrailData);

	onDestroy(unsub);

	function resetTrailData() {
		trailData = [];
	}

	function calcCurrentData(date: Date, altitude: number): DataPoint | null {
		if (altitude < 0) return null;
		else return { x: getTimeInSeconds(date), y: altitude, date: '' };
	}

	function calcTrailData(date: Date, altitude: number): Series[] {
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

	function findSeries(date: Date): Series | undefined {
		return trailData.find((s) => s.dateKey == formatDateKey(date));
	}

	function formatDateKey(date: Date): string {
		return dateFormat(date, 'yyyy-m-d');
	}

	function formatTimeTick(d: number): string {
		return `${Math.floor(d / 60 / 60)}:00`;
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

<div class="main">
	{#if !$simGPS}
		<p><i>GPS position required</i></p>
	{:else}
		<header>
			<div style={parent_style}>
				<p use:fit>
					<i>Altitude of the sun over time for location {formatGPSCoords($simGPS)} </i>
				</p>
			</div>
		</header>
		<div class="chart-container">
			<LayerCake
				data={trailData}
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
						textColor="white"
					/>
					<AxisY textColor="white" />
					<MultiLine calcStroke={calcSeriesStrokeColor} />

					{#if currentData}
						<CustomCircle fill={'yellow'} r={5} x={currentData.x} y={currentData.y} />
					{/if}
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
