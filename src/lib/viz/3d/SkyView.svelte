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
	import { EARTH_ORBIT_RADIUS, skySim } from '$lib/sim/threejs';
	import { FPControls } from '$lib/FPControls';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import Sun from '$lib/gaphics/3d/Sun.svelte';

	let fpControls: FPControls;

	const ctx = useThrelte();
	const { scene, renderer } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	const groundGeom = new THREE.CircleGeometry(10, 36);
	const groundMat = new THREE.MeshBasicMaterial({ color: 0x136d15 });

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(10));

		camera.lookAt(new THREE.Vector3(1, 1, 0));
		fpControls = new FPControls(camera, renderer?.domElement);
	});

	onDestroy(() => {
		fpControls.dispose();
	});

	useFrame(() => {});

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log(camera.rotation);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<Sun position={$skySim} />

<!-- <AmbientLight /> -->

<PerspectiveCamera bind:camera far={EARTH_ORBIT_RADIUS * 1.5} position={{ x: 0, y: 1, z: 0 }} />

<Mesh geometry={groundGeom} material={groundMat} rotation={{ x: -90 * DEG2RAD }} />

<!-- <Sun /> -->
<style>
</style>
