<script>
	import { Canvas } from '@threlte/core';
	import SunlightSimulation from './SunlightSimulation.svelte';
</script>

<div id="view">
	<Canvas rendererParameters={{ antialias: true }}><SunlightSimulation /></Canvas>
</div>

<style>
	#view {
		width: 100%;
		height: 100vh;
	}
</style>
