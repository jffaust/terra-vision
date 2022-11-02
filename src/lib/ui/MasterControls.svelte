<script lang="ts">
	import { simCurrentDate, simStartDate } from '$lib/sim/simulation';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let previousTime: number;
	let intervalId: NodeJS.Timer;

	let timeFactor = 10000;
	let playSimulation = true;

	onMount(() => {
		setStartDate(new Date());
		setupInterval();
	});

	onDestroy(stopInterval);

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

	function setupInterval() {
		previousTime = performance.now();
		intervalId = setInterval(advance, 100);
	}

	function stopInterval() {
		if (window) {
			window.clearInterval(intervalId);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		//TODO doesnt belong here
		if (e.code == 'Space') {
			playSimulation = !playSimulation;

			if (playSimulation) {
				setupInterval();
			} else {
				stopInterval();
			}
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

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
