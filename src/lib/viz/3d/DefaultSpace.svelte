<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { OrbitControls, PerspectiveCamera, useThrelte, Line } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { earthOrbit, EARTH_ORBIT_RADIUS, sim } from '$lib/sim/threejs';
	import type { SimData } from '$lib/sim/threejs';
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import { mapsCamera } from '$lib/stores';
	import GpsMarker from '$lib/gaphics/3d/GPSMarker.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { GPS } from '$lib/types';
	import { astroSim } from '$lib/sim/astro';

	let showStats = false;

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
	let unsub: Unsubscriber;

	let showGPS = false;
	let gps: GPS = { lat: 0, lon: 0 };

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));

		if (showStats) document.body.appendChild(stats.dom);

		unsub = sim.subscribe(onSimUpdated);

		initGPSMarker();
	});

	onDestroy(() => {
		if (unsub) {
			unsub();
		}
	});

	function initGPSMarker() {
		const urlParams = new URLSearchParams(window.location.search);

		const latStr = urlParams.get('lat');
		const lonStr = urlParams.get('lon');

		if (latStr && lonStr) {
			try {
				gps = {
					lat: parseFloat(latStr),
					lon: parseFloat(lonStr)
				};
				showGPS = true;
			} catch (e) {
				console.log();
			}
		}
	}

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
		const invRotatedNorth = north.clone();
		// Apply the inverse rotation to calculate the angle for z
		invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
		earthSpin.z = -Math.atan(north.x / invRotatedNorth.y); // x value doesn't change
		//earthSpin.y = s.earth.axis.spin;
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($astroSim.earth.axis.spin % 360);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={EARTH_ORBIT_RADIUS * 2.5}>
	<OrbitControls target={$sim.earth.pos} zoomSpeed={0.5} />
</PerspectiveCamera>

<Sun />

<!-- <AmbientLight /> -->

<!-- earth's orbit -->
<!-- <Line points={$earthOrbit} material={orbitMat} /> -->

<Earth position={$sim.earth.pos} rotation={earthSpin}>
	{#if showGPS}
		<GpsMarker {gps} />
	{/if}
</Earth>

<style>
</style>
