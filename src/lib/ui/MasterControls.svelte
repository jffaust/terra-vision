<script lang="ts">
	import { simCurrentDate, simStartDate } from '$lib/sim/sim';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let previousTime: number;
	let intervalId: NodeJS.Timer;

	let timeFactor = 100000;
	let playSimulation = false;

	onMount(() => {
		setStartDate(new Date());
		// setStartDate(new Date(2022, 11, 21)); // zero-based ahhhh
		// setStartDate(new Date(2022, 5, 21)); // zero-based ahhhh
		if (playSimulation) {
			setupInterval();
		}
		//setTimeout(stopInterval, 1000); // temporary
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
		intervalId = setInterval(advance, 50);
	}

	function stopInterval() {
		if (window) {
			window.clearInterval(intervalId);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code == 'Space') {
			playSimulation = !playSimulation;

			if (playSimulation) {
				setupInterval();
			} else {
				stopInterval();
			}
		} else if (e.code == 'Backspace') {
			$simCurrentDate = $simStartDate;
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
		padding: 0 8px;
	}
</style>
