<!--
  @component
  Similar to a Scatter plot component except it's just for one circle and the data
  comes from props instead of the LayerCake context.
 -->
<script lang="ts">
	import { getContext } from 'svelte';

	// @ts-ignore
	const { xScale, yScale } = getContext('LayerCake');

	/** @type {Number} [r=5] – The circle's radius. */
	export let r: number = 5;

	/** @type {String} [fill='#0cf'] – The circle's fill color. */
	export let fill: string = '#0cf';

	/** @type {String} [stroke='#000'] – The circle's stroke color. */
	export let stroke: string = '#000';

	/** @type {Number} [strokeWidth=0] – The circle's stroke width. */
	export let strokeWidth: number = 0;

	export let x: number | null = null;
	export let y: number | null = null;
</script>

<g class="circle">
	{#if x != null && y != null}
		<circle
			cx={$xScale(x) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
			cy={$yScale(y) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
			{r}
			{fill}
			{stroke}
			stroke-width={strokeWidth}
		/>
	{/if}
</g>
