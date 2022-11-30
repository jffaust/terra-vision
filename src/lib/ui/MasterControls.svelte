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
		if (playSimulation) {
			setupInterval();
		}
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
				setStartDate(new Date(dateString), false, false);
			} catch (e) {
				setStartDate(new Date(), false, false);
			}
		} else {
			setStartDate(new Date(), false, false);
		}
	}

	function setStartDate(d: Date, updateSearchParams: boolean, replaceState: boolean) {
		$simStartDate = d;
		$simCurrentDate = d;

		if (updateSearchParams) {
			var searchParams = new URLSearchParams(window.location.search);
			searchParams.set('date', d.toISOString());

			let newLocation = new URL(window.location.href);
			newLocation.search = searchParams.toString();

			if (replaceState) {
				window.history.replaceState(null, document.title, newLocation.href);
			} else {
				window.history.pushState(null, document.title, newLocation.href);
			}
		}
	}

	function advance() {
		const now = performance.now();
		const elapsedMs = now - previousTime;
		previousTime = now;

		$simCurrentDate = new Date($simCurrentDate.getTime() + elapsedMs * timeFactorValue);
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
