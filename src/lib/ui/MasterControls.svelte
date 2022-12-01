<script lang="ts">
	import { simCurrentDate, simStartDate } from '$lib/sim/sim';
	import { updateSearchParams } from '$lib/utils';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let previousTime: number;
	let intervalId: NodeJS.Timer;

	let timeFactorValue = 1;
	let playSimulation = true;
	let showClockSpeedInput = false;

	$: displayDate = dateFormat($simCurrentDate, 'mmmm dS, yyyy, HH:MM:ss');

	onMount(() => {
		initStartDate();
		if (playSimulation) {
			setupInterval();
		}
	});

	onDestroy(stopInterval);

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

	function setStartDate(d: Date, updateSearch: boolean, replaceState: boolean) {
		$simStartDate = d;
		$simCurrentDate = d;

		if (updateSearch) {
			updateSearchParams('date', d.toISOString(), replaceState);
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
			togglePlayPause();
		} else if (e.code == 'Backspace') {
			$simCurrentDate = $simStartDate;
		}
	}

	function togglePlayPause() {
		playSimulation = !playSimulation;

		if (playSimulation) {
			setupInterval();
		} else {
			stopInterval();
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<div class="controls">
	<span>{displayDate}</span>

	<button type="button" on:click={togglePlayPause}>
		<img src="/icons/{playSimulation ? 'pause' : 'play'}.svg" alt="Play/Pause" />
	</button>
	<div class="speed-control">
		<button type="button" on:click={() => (showClockSpeedInput = !showClockSpeedInput)}>
			<img src="icons/clock-speed.svg" alt="Clock speed" title="Clock speed" />
		</button>

		<input
			class="speed {showClockSpeedInput ? '' : 'hidden'}"
			type="range"
			min="1"
			max="100000"
			bind:value={timeFactorValue}
		/>
	</div>
</div>

<style>
	div.controls {
		position: fixed;
		bottom: 0px;
		left: 0px;
		color: white;
		padding: 0 8px;
		display: flex;
		align-items: center;
	}

	div.speed-control {
		display: inline-flex;
	}

	input.speed {
		display: inline;
		margin-left: 4px;
		width: 150px !important;
	}

	input.speed.hidden {
		visibility: hidden;
	}

	input.speed:focus {
		border-color: none !important;
		box-shadow: none !important;
	}

	span {
		margin-right: 5px;
		font-size: 20px;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 4px;
		cursor: pointer;
	}
	img {
		width: 22px;
		height: 22px;
	}
</style>
