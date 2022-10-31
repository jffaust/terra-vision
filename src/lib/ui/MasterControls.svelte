<script lang="ts">
	import { datetime } from '$lib/sim/simulation';
	import dateFormat from 'dateformat';
	import { onDestroy, onMount } from 'svelte';

	let intervalId: NodeJS.Timer;
	let previousTime: number;
	onMount(() => {
		$datetime = new Date();
		previousTime = performance.now();
		intervalId = setInterval(advance, 1000);
	});

	onDestroy(() => {
		if (window) {
			window.clearInterval(intervalId);
		}
	});

	$: displayDate = dateFormat($datetime, 'mmmm dS, yyyy, h:MM:ss TT');

	function advance() {
		console.log('advancing');

		const now = performance.now();
		const elapsedMs = now - previousTime;

		$datetime = new Date($datetime.getTime() + elapsedMs);

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
