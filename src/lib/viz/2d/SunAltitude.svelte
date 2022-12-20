<script lang="ts">
	import { simCurrentDate, simGPS } from '$lib/sim/sim';
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import Scatter from '$lib/gaphics/2d/Scatter.svelte';
	import { scaleTime } from 'd3-scale';
	import { astroSkySim } from '$lib/sim/astro';

	interface DataPoint {
		x: number;
		y: number;
	}

	// Define some data
	$: points = calcDataPoints($simCurrentDate, $astroSkySim.altitude);

	function calcDataPoints(date: Date, altitude: number): DataPoint[] {
		if (altitude < 0) return [];
		else return [{ x: getTimeInSeconds(date), y: altitude }];
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
				data={points}
				x="x"
				y="y"
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
					<Scatter fill={'yellow'} r={3} />
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
