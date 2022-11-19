<script lang="ts">
	import { simCurrentDate, simStartDate } from '$lib/sim/sim';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let previousTime: number;
	let intervalId: NodeJS.Timer;

	let playSimulation = true;

	let timeFactorIdx = 0;
	let timeFactors = [
		{ text: '1 X', value: 1 },
		{ text: '10 X', value: 10 },
		{ text: '1K X', value: 1000 },
		{ text: '1M X', value: 1000000 }
	];

	$: timeFactorValue = timeFactors[timeFactorIdx].value;
	$: timeFactorText = timeFactors[timeFactorIdx].text;
	onMount(() => {
		initStartDate();
		// setStartDate(new Date(2022, 11, 21)); // zero-based ahhhh
		// setStartDate(new Date(2022, 5, 21)); // zero-based ahhhh
		if (playSimulation) {
			setupInterval();
		}
		//setTimeout(stopInterval, 1000); // temporary
	});

	onDestroy(stopInterval);

	$: displayDate = dateFormat($simCurrentDate, 'mmmm dS, yyyy, h:MM:ss TT');

	function initStartDate() {
		const urlParams = new URLSearchParams(window.location.search);

		// 	2022-11-05T16:14:25Z
		// https://tc39.es/ecma262/#sec-date-time-string-format
		const dateString = urlParams.get('date');
		if (dateString) {
			try {
				setStartDate(new Date(dateString));
			} catch (e) {
				setStartDate(new Date());
			}
		} else {
			setStartDate(new Date());
		}
	}

	function setStartDate(d: Date) {
		$simStartDate = d;
		$simCurrentDate = d;
	}

	function advance() {
		const now = performance.now();
		const elapsedMs = now - previousTime;

		$simCurrentDate = new Date($simCurrentDate.getTime() + elapsedMs * timeFactorValue);

		previousTime = now;
	}

	function setupInterval() {
		previousTime = performance.now();
		intervalId = setInterval(advance, 33.33);
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

	function cycleTimeFactors() {
		if (timeFactorIdx < timeFactors.length - 1) {
			timeFactorIdx++;
		} else {
			timeFactorIdx = 0;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<div>
	<span>{displayDate}</span>

	<span class="time-factor" on:click={cycleTimeFactors}>{timeFactorText} </span>
</div>

<style>
	div {
		position: fixed;
		bottom: 0px;
		left: 0px;
		color: white;
		padding: 0 8px;
	}

	.time-factor {
		margin-left: 10px;
		cursor: pointer;
		border: 1px solid white;
		padding: 2px;
		padding-right: 4px;
	}
</style>
