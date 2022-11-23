<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import {
		OrbitControls,
		PerspectiveCamera,
		useThrelte,
		Line,
		Group,
		AmbientLight,
		useFrame
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { earthOrbit, EARTH_ORBIT_RADIUS, sim, SUN_RADIUS } from '$lib/sim/threejs';
	import type { SimData } from '$lib/sim/threejs';
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import GpsMarker from '$lib/gaphics/3d/GPSMarker.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { GPS } from '$lib/types';
	import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
	import { gpsToCartesian } from '$lib/math';
	import { Clock } from 'three';

	// SHOULD NOT USE CURRENT SIM AS THE ROTATING EARTH WOULD COMPLICATE
	// CAMERA MOVEMENTS?

	let showStats = false;

	const stats = Stats();
	const ctx = useThrelte();
	const { scene, renderer } = useThrelte();
	let camera: THREE.PerspectiveCamera;
	let fpsControls: FirstPersonControls;
	const clock = new THREE.Clock();

	let prevEarthPos: THREE.Vector3;
	let unsub: Unsubscriber;

	let gps: GPS = { lat: 45.5114752, lon: -73.4363648 };

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));

		if (showStats) document.body.appendChild(stats.dom);

		unsub = sim.subscribe(onSimUpdated);

		fpsControls = new FirstPersonControls(camera, renderer?.domElement);
		fpsControls.movementSpeed = 0;
		fpsControls.enabled = false;
		fpsControls.lookSpeed = 0.1;
	});

	onDestroy(() => {
		if (unsub) {
			unsub();
		}
	});

	useFrame(() => {
		fpsControls.update(clock.getDelta());
	});

	function onSimUpdated(s: SimData) {
		stats.update();
		// if (camera) {
		// 	if (!prevEarthPos) {
		// 		const initialCamPos = new THREE.Vector3();
		// 		initialCamPos.copy(s.earth.pos);
		// 		initialCamPos.multiplyScalar(0.99987);
		// 		camera.position.x = initialCamPos.x;
		// 		camera.position.y = initialCamPos.y;
		// 		camera.position.z = initialCamPos.z;
		// 	} else {
		// 		camera.position.x += s.earth.pos.x - prevEarthPos.x;
		// 		camera.position.y += s.earth.pos.y - prevEarthPos.y;
		// 		camera.position.z += s.earth.pos.z - prevEarthPos.z;
		// 	}
		// 	prevEarthPos = s.earth.pos;
		// }
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log(camera.position);
		}
	}

	function onPointerDown() {
		fpsControls.enabled = true;
	}

	function onPointerUp() {
		fpsControls.enabled = false;
	}
</script>

<svelte:window on:keyup={handleKeyUp} on:pointerdown={onPointerDown} on:pointerup={onPointerUp} />

<PerspectiveCamera
	bind:camera
	far={EARTH_ORBIT_RADIUS * 2.5}
	position={{ x: SUN_RADIUS * 10, y: 0, z: 0 }}
	lookAt={{ x: 0, y: 0, z: 0 }}
/>

<Sun />

<Earth position={$sim.earth.pos} rotation={$sim.earth.rotation}>
	<GpsMarker {gps} />
</Earth>

<style>
</style>
