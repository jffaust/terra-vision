<script lang="ts">
	import MilkyWay from '$lib/gaphics/3d/MilkyWay.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import { Canvas, OrbitControls, PerspectiveCamera } from '@threlte/core';

	// https://mgvez.github.io/jsorrery/
	// https://github.com/mgvez/jsorrery/blob/master/src/graphics3d/Sun.js
	// https://github.com/mgvez/jsorrery/blob/master/src/loaders/ResourceLoader.js
	// https://github.com/mgvez/jsorrery/blob/master/assets/shaders/sun.fsh
	// https://github.com/mgvez/jsorrery/blob/master/assets/shaders/sun.vsh

	export let width: number;
	export let height: number;
</script>

<!-- SpaceScene uses useThrelte so the canvas component must be inside a parent component -->
<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}>
	<PerspectiveCamera position={{ x: 1000, y: 0, z: 0 }} far={10000}>
		<OrbitControls target={{ x: 0, y: 0, z: 0 }} zoomSpeed={0.5} />
	</PerspectiveCamera>

	<MilkyWay />

	<Sun />
</Canvas>

<style>
</style>
