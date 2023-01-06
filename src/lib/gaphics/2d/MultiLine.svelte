<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script lang="ts">
	import { getContext } from 'svelte';

	export let onHover: (e: PointerEvent, series: any) => void = () => {};
	export let calcStroke: (series: any, index: number) => string;

	// @ts-ignore
	const { data, xGet, yGet, zGet } = getContext('LayerCake');

	$: path = (values: any) => {
		return (
			'M' +
			values
				.map((d: any) => {
					return $xGet(d) + ',' + $yGet(d);
				})
				.join('L')
		);
	};
</script>

<g class="line-group">
	{#each $data as group, i}
		{#if group.values.length > 0}
			<path
				class="path-line"
				d={path(group.values)}
				stroke={calcStroke(group, i)}
				on:pointermove={(e) => onHover(e, group)}
				on:pointerleave={(e) => onHover(e, null)}
			/>
		{/if}
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
	}

	.path-line:hover {
		stroke: aquamarine !important;
	}
</style>
