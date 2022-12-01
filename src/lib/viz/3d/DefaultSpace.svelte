<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { OrbitControls, PerspectiveCamera, useThrelte, Line } from '@threlte/core';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { EARTH_ORBIT_RADIUS, spaceSim } from '$lib/sim/threejs';
	import type { SimData } from '$lib/sim/threejs';
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';
	import GpsMarker from '$lib/gaphics/3d/GPSMarker.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { GPS } from '$lib/types';
	import MilkyWay from '$lib/gaphics/3d/MilkyWay.svelte';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { simGPS } from '$lib/sim/sim';
	import { updateSearchParams } from '$lib/utils';

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

	let showGPS = false;

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		//scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));

		if (showStats) document.body.appendChild(stats.dom);

		unsub = spaceSim.subscribe(onSimUpdated);

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
				$simGPS = {
					lat: parseFloat(latStr),
					lon: parseFloat(lonStr)
				};
				showGPS = true;
			} catch (e) {
				console.log();
			}
		} else if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((pos) => {
				$simGPS = {
					lat: pos.coords.latitude,
					lon: pos.coords.longitude
				};
				showGPS = true;

				updateSearchParams('lat', $simGPS.lat.toString(), true);
				updateSearchParams('lon', $simGPS.lon.toString(), true);
			});
		}
	}

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
	showEquator={false}
	showPrimeMeridian={false}
	showRotationAxis={false}
>
	{#if showGPS}
		<GpsMarker gps={$simGPS} />
	{/if}
</Earth>

<style>
</style>
