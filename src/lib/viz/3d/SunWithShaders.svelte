<script lang="ts">
	import MilkyWay from '$lib/graphics/3d/MilkyWay.svelte';
	import AltSun from '$lib/graphics/3d/AltSun.svelte';
	import { Canvas, OrbitControls, PerspectiveCamera } from '@threlte/core';
	import * as THREE from 'three';
	import { onDestroy, onMount } from 'svelte';
	import Earth from '$lib/graphics/3d/Earth.svelte';
	import { EARTH_RADIUS, SUN_RADIUS } from '$lib/sim/threejs';

	// https://mgvez.github.io/jsorrery/
	// https://github.com/mgvez/jsorrery/blob/master/src/graphics3d/Sun.js
	// https://github.com/mgvez/jsorrery/blob/master/src/loaders/ResourceLoader.js
	// https://github.com/mgvez/jsorrery/blob/master/assets/shaders/sun.fsh
	// https://github.com/mgvez/jsorrery/blob/master/assets/shaders/sun.vsh

	export let width: number;
	export let height: number;

	let position = new THREE.Vector3(0, 0, 0);

	let interval: NodeJS.Timer;

	onMount(() => {
		// interval = setInterval(() => {
		// 	position.x -= 10;
		// }, 100);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<!-- SpaceScene uses useThrelte so the canvas component must be inside a parent component -->
<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}>
	<PerspectiveCamera position={{ x: SUN_RADIUS * 4, y: 0, z: 0 }} far={100000}>
		<OrbitControls target={{ x: 0, y: 0, z: 0 }} zoomSpeed={0.5} />
	</PerspectiveCamera>

	<MilkyWay />

	<!-- <Sun /> -->
	<AltSun {position} />
</Canvas>
