<script lang="ts">
	import { simCurrentDate, simStartDate } from '$lib/sim/simulation';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let previousTime: number;
	let intervalId: NodeJS.Timer;

	let timeFactor = 100000;

	onMount(() => {
		setStartDate(new Date());
		previousTime = performance.now();
		intervalId = setInterval(advance, 1000);
	});

	onDestroy(() => {
		if (window) {
			window.clearInterval(intervalId);
		}
	});

	$: displayDate = dateFormat($simCurrentDate, 'mmmm dS, yyyy, h:MM:ss TT');

	function setStartDate(d: Date) {
		$simStartDate = d;
		$simCurrentDate = d;
	}

	function advance() {
		const now = performance.now();
		const elapsedMs = now - previousTime;

		$simCurrentDate = new Date($simCurrentDate.getTime() + elapsedMs * timeFactor);

		previousTime = now;
	}
</script>

<div>
	<span>{displayDate}</span>
</div>

<style>
	div {
		position: fixed;
		bottom: 0px;
		left: 0px;
		color: white;
		padding: 5px;
	}
</style>
