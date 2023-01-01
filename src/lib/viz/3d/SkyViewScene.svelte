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
	import { EARTH_ORBIT_RADIUS, METER, skySim } from '$lib/sim/threejs';
	import { FPControls } from '$lib/FPControls';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import AltSun from '$lib/gaphics/3d/AltSun.svelte';

	// export let width: number;
	// export let height: number;

	let fpControls: FPControls;

	const ctx = useThrelte();
	const { scene, renderer } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	const groundGeom = new THREE.CircleGeometry(10, 3600);
	const groundMat = new THREE.MeshPhysicalMaterial({ color: 0x136d15 });

	const geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);
	const material = new THREE.MeshPhysicalMaterial({ color: 0x136d15 });
	const plane = new THREE.Mesh(geometry, material);
	plane.rotateX(-90 * DEG2RAD);

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		//scene.add(new THREE.AxesHelper(10000));
		scene.add(plane);

		camera.lookAt(new THREE.Vector3(1, 1.75 * METER, 0));
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

<!-- TODO: Optionally change the color of the light based on the angle (orange/red for low altitude, whiter near 90 degrees) -->
<!-- similarly, change the color of the scene's background from black to blue -->
<AltSun position={$skySim} />
<Sun position={$skySim} />

<AmbientLight intensity={0.15} />

<PerspectiveCamera
	bind:camera
	near={0.00000001}
	far={EARTH_ORBIT_RADIUS * 1.5}
	position={{ x: 0, y: 1.75 * METER, z: 0 }}
/>

<!-- <Mesh geometry={groundGeom} material={groundMat} rotation={{ x: -90 * DEG2RAD }} /> -->

<!-- Can also potentially place the Eart below us -->

<!-- <Earth
	position={{ x: 0, y: -EARTH_RADIUS, z: 0 }}
	showEquator={false}
	showPrimeMeridian={false}
	showRotationAxis={false}
/> -->
