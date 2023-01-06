<script context="module" lang="ts">
	export interface DataPoint {
		x: number; // number of seconds since midnight
		y: number;
		date: string;
	}

	export interface Series {
		date: Date;
		dateKey: string;
		values: DataPoint[];
	}
</script>

<script lang="ts">
	import { Html, LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import { scaleTime } from 'd3-scale';
	import MultiLine from '$lib/gaphics/2d/MultiLine.svelte';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import Tooltip from '$lib/gaphics/2d/Tooltip.html.svelte';

	export let title: string;
	export let seriesData: Series[];
	export let calcSeriesStrokeColor: (series: any, index: number) => string;

	let evt: any;
	let showTooltip = false;

	function formatTimeTick(d: number): string {
		return `${Math.floor(d / 60 / 60)}:00`;
	}

	function onHover(e: PointerEvent, series: Series) {
		if (!series) {
			showTooltip = false;
			return;
		}

		showTooltip = true;
		evt = {
			detail: {
				e,
				dateKey: series.dateKey
			}
		};
	}
</script>

<div class="main">
	<header>
		<div style={parent_style}>
			<p use:fit>
				<i>{title}</i>
			</p>
		</div>
	</header>
	<div class="chart-container">
		<LayerCake
			data={seriesData}
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
				<MultiLine calcStroke={calcSeriesStrokeColor} {onHover} />

				<slot />
			</Svg>

			<Html pointerEvents={false}>
				{#if showTooltip === true}
					<Tooltip {evt}>
						<p>{evt.detail.dateKey}</p>
					</Tooltip>
				{/if}
			</Html>
		</LayerCake>
	</div>
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
