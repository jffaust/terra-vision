<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script lang="ts">
	import { getContext } from 'svelte';

	export let calcStroke: (series: any) => string;

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
	{#each $data as group}
		<path class="path-line" d={path(group.values)} stroke={calcStroke(group)} />
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
	}
</style>
