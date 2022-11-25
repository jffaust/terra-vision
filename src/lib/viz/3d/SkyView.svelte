<script lang="ts">
	import * as THREE from 'three';
	import {
		PerspectiveCamera,
		useThrelte,
		AmbientLight,
		Mesh,
		Group,
		useFrame
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { EARTH_ORBIT_RADIUS, sim } from '$lib/sim/threejs';
	import type { SimData } from '$lib/sim/threejs';
	import type { Unsubscriber } from 'svelte/store';
	import type { GPS } from '$lib/types';
	import { FPControls } from '$lib/FPControls';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	let fpControls: FPControls;

	const ctx = useThrelte();
	const { scene, renderer } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	let unsub: Unsubscriber;

	let gps: GPS = { lat: 45.5114752, lon: -73.4363648 };
	const groundGeom = new THREE.CircleGeometry(100, 100);
	const groundMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(20));

		unsub = sim.subscribe(onSimUpdated);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		fpControls = new FPControls(camera, renderer?.domElement);
	});

	onDestroy(() => {
		if (unsub) {
			unsub();
		}
		fpControls.dispose();
	});

	useFrame(() => {});

	function onSimUpdated(s: SimData) {}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log(camera.rotation);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<AmbientLight />

<Group>
	<PerspectiveCamera bind:camera far={EARTH_ORBIT_RADIUS * 2.5} position={{ x: 1, y: 1, z: 0 }} />
</Group>

<Mesh geometry={groundGeom} material={groundMat} rotation={{ x: 90 * DEG2RAD }} />

<!-- <Sun /> -->
<style>
</style>
