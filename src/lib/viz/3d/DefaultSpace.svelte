<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { OrbitControls, PerspectiveCamera, useThrelte, Line } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { earthOrbit, sim } from '$lib/sim/threejs';
	import type { SimData } from '$lib/types';
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import { mapsCamera } from '$lib/stores';
	import GpsMarker from '$lib/gaphics/3d/GPSMarker.svelte';

	const stats = Stats();
	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	const orbitMat = new THREE.LineBasicMaterial({
		color: 0x333333,
		transparent: true,
		opacity: 0.5
	});

	let prevEarthPos: THREE.Vector3;
	const unsub = sim.subscribe(onSimUpdated);

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000000));

		document.body.appendChild(stats.dom);
	});

	onDestroy(unsub);

	function onSimUpdated(s: SimData) {
		stats.update();
		if (camera) {
			if (!prevEarthPos) {
				const initialCamPos = new THREE.Vector3();
				initialCamPos.copy(s.earth.pos);
				initialCamPos.multiplyScalar(0.99987);
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

		const north = s.earth.axis.north;

		earthSpin.x = Math.atan(north.z / north.y);
		// Apply the inverse rotation so we can get the right Y-value to use
		// in the second rotation
		const invRotatedNorth = north.clone();
		invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
		earthSpin.z = -Math.atan(north.x / invRotatedNorth.y); // x value doesn't change
		earthSpin.y = s.earth.axis.spin;
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($earthOrbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={310000000}>
	<OrbitControls target={$sim.earth.pos} />
</PerspectiveCamera>

<Sun />

<!-- <AmbientLight /> -->

<!-- earth's orbit -->
<Line points={$earthOrbit} material={orbitMat} />

<Earth position={$sim.earth.pos} rotation={earthSpin}>
	<GpsMarker gps={{ lon: $mapsCamera.center.lon, lat: $mapsCamera.center.lat }} />
</Earth>

<style>
</style>
