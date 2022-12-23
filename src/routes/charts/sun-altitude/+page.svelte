<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { simGPS } from '$lib/sim/sim';
	import SunAltitudeStaticChart from '$lib/viz/2d/static/SunAltitudeStaticChart.svelte';
	import type { GPSCoords } from '$lib/types';
	import { formatGPSCoords } from '$lib/utils';

	let pos: GPSCoords | null = null;

	onMount(async () => {
		initGPSPosition();
	});

	function initGPSPosition(): GPSCoords | null {
		const urlParams = new URLSearchParams(window.location.search);

		const latStr = urlParams.get('lat');
		const lonStr = urlParams.get('lon');

		if (latStr && lonStr) {
			try {
				const parsed = {
					lat: parseFloat(latStr),
					lon: parseFloat(lonStr)
				};
				return parsed;
			} catch (e) {}
		}
		return null;
	}
</script>

<div class="app">
	<SunAltitudeStaticChart {pos} />
</div>

<style>
	.app {
		width: 100vw;
		height: 100vh;
	}
</style>
