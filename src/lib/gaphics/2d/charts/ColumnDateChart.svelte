<script context="module" lang="ts">
	export interface DataPoint {
		x: Date;
		y: number;
	}

	// TODO: support multiple series
	// export interface Series {
	// 	date: Date;
	// 	dateKey: string;
	// 	values: DataPoint[];
	// }
</script>

<script lang="ts">
	import { Html, LayerCake, Svg } from 'layercake';
	import AxisX from '$lib/gaphics/2d/AxisX.svelte';
	import AxisY from '$lib/gaphics/2d/AxisY.svelte';
	import { scaleTime } from 'd3-scale';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import Tooltip from '$lib/gaphics/2d/Tooltip.html.svelte';
	import Column from '$lib/gaphics/2d/Column.svelte';
	import dateFormat from 'dateformat';

	export let title: string;
	export let data: DataPoint[];

	let evt: any;
	let showTooltip = false;

	function formatTimeTick(date: Date): string {
		return dateFormat(date, 'mmm d');
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
			{data}
			x="x"
			y="y"
			yDomain={[0, 24]}
			xScale={scaleTime()}
			padding={{ top: 20, right: 20, bottom: 20, left: 20 }}
		>
			<!-- Components go here -->
			<Svg>
				<AxisX formatTick={formatTimeTick} textColor="white" gridlines={false} tickMarks={true} />
				<AxisY textColor="white" ticks={10} />
				<Column fill="yellow" />
			</Svg>
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
