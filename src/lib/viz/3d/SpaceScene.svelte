<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { OrbitControls, PerspectiveCamera, useThrelte, Line } from '@threlte/core';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { EARTH_ORBIT_RADIUS, spaceSim } from '$lib/sim/threejs';
	import type { SimData } from '$lib/sim/threejs';
	import Earth from '$lib/graphics/3d/Earth.svelte';
	import Sun from '$lib/graphics/3d/Sun.svelte';
	import GpsMarker from '$lib/graphics/3d/GPSMarker.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { GPSCoords } from '$lib/types';
	import MilkyWay from '$lib/graphics/3d/MilkyWay.svelte';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { simGPS } from '$lib/sim/sim';

	export let showEquator: boolean;
	export let showRotationAxis: boolean;
	export let showPrimeMeridian: boolean;

	let showStats = false;

	const stats = Stats();
	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	const orbitMat = new THREE.LineBasicMaterial({
		color: 0x333333,
		transparent: true,
		opacity: 0.5
	});

	let prevEarthPos: THREE.Vector3;
	let unsub: Unsubscriber;

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		//scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));

		if (showStats) document.body.appendChild(stats.dom);

		unsub = spaceSim.subscribe(onSimUpdated);
	});

	onDestroy(() => {
		if (unsub) {
			unsub();
		}
	});

	function onSimUpdated(s: SimData) {
		stats.update();
		if (camera) {
			if (!prevEarthPos) {
				const initialCamPos = new THREE.Vector3().copy(s.earth.pos);
				const rotatedOffset = new THREE.Vector3().copy(s.earth.pos);
				rotatedOffset.multiplyScalar(-0.00015);
				rotatedOffset.applyEuler(new THREE.Euler(0, 60 * DEG2RAD, 0));

				initialCamPos.add(rotatedOffset);
				camera.position.x = initialCamPos.x;
				camera.position.y = initialCamPos.y;
				camera.position.z = initialCamPos.z;
			} else {
				camera.position.x += s.earth.pos.x - prevEarthPos.x;
				camera.position.y += s.earth.pos.y - prevEarthPos.y;
				camera.position.z += s.earth.pos.z - prevEarthPos.z;
			}
			prevEarthPos = s.earth.pos;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={EARTH_ORBIT_RADIUS * 10}>
	<OrbitControls target={$spaceSim.earth.pos} zoomSpeed={0.5} />
</PerspectiveCamera>

<MilkyWay />

<Sun />

<!-- <AmbientLight /> -->

<!-- earth's orbit -->
<!-- <Line points={$earthOrbit} material={orbitMat} /> -->

<Earth
	position={$spaceSim.earth.pos}
	rotation={$spaceSim.earth.rotation}
	{showEquator}
	{showPrimeMeridian}
	{showRotationAxis}
>
	{#if $simGPS}
		<GpsMarker lat={$simGPS.lat} lon={$simGPS.lon} />
	{/if}
</Earth>
