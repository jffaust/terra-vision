<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
	import { simCurrentDate } from '$lib/sim/sim';
	import { getTimeInSeconds } from '$lib/utils';

	// @ts-nocheck

	import { getContext } from 'svelte';

	const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

	/** @type {Number} [r=5] – The circle's radius. */
	export let r = 5;

	/** @type {String} [fill='#0cf'] – The circle's fill color. */
	export let fill = '#0cf';

	/** @type {String} [stroke='#000'] – The circle's stroke color. */
	export let stroke = '#000';

	/** @type {Number} [strokeWidth=0] – The circle's stroke width. */
	export let strokeWidth = 0;

	export let xGranularity = 60;

	$: currentSunData = getCurrentSunData($data, $simCurrentDate);

	// @ts-ignore
	function getCurrentSunData(data, simDate) {
		console.log('testing');
		if (data.length > 0) {
			const lastSeries = data[data.length - 1];
			if (lastSeries.values.length > 0) {
				const lastDataPoint = lastSeries.values[lastSeries.values.length - 1];
				const lastTime = lastDataPoint.x;
				const simCurrentTime = getTimeInSeconds(simDate);

				if (simCurrentTime - lastTime > 2 * xGranularity) {
					return null;
				} else return lastDataPoint;
			}
		} else return null;
	}
</script>

<g class="scatter-group">
	{#if currentSunData}
		<circle
			cx={$xGet(currentSunData) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
			cy={$yGet(currentSunData) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
			{r}
			{fill}
			{stroke}
			stroke-width={strokeWidth}
		/>
	{/if}
</g>
