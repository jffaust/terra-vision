<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import {
		Mesh,
		OrbitControls,
		PerspectiveCamera,
		useThrelte,
		AmbientLight,
		Line,
		Line2,
		LineSegments,
		Group
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { earthOrbit, sim } from '$lib/sim/threejs';
	import { EARTH_RADIUS_KM, SUN_RADIUS_KM } from '$lib/constants';
	import type { SimData } from '$lib/types';
	import { getSphericalHorizontalRingSize, sphericalToCartesian } from '$lib/math';
	import { mapsCameraView } from '$lib/stores';
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import Sun from '$lib/gaphics/3d/Sun.svelte';

	// When we load the texture of the Earth onto a sphere, by default the north
	// pole will be from the center of the sphere towards and follow the Y axis.
	// This component is used to test the logic of rotating the default north pole
	// so that it matches a given north pole axis. We can expect the normalized
	// vector returned by AE to always have a positive Y so it is a matter of
	// finding the right angles for X and Z in the euler transformation. Because
	// we'll want to make the Earth spin, the Y rotation should be last.

	let play = false;
	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	let progressiveSpin = new THREE.Euler(0, 0, 0, 'XZY');

	let x = Math.random() * 2 - 1;
	let y = Math.random();
	let z = Math.random() * 2 - 1;
	let randomNorth = new THREE.Vector3(x, y, z).normalize();

	let randomNorthPoints: THREE.Vector3[] = [
		new THREE.Vector3(),
		randomNorth.clone().multiplyScalar(EARTH_RADIUS_KM + 1000)
	];

	earthSpin.x = Math.atan(randomNorth.z / randomNorth.y);
	earthSpin.z = -Math.atan(randomNorth.x / randomNorth.y);
	//earthSpin.y = s.earth.axis.spin;
	const northMat = new THREE.LineBasicMaterial({ color: 0x9932cc });

	let stepXProgress = 0;
	let stepZProgress = 0;
	const stepX = earthSpin.x / 10;
	const stepZ = earthSpin.z / 10;
	let interval: NodeJS.Timer;

	const stats = Stats();
	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(20000));

		document.body.appendChild(stats.dom);

		if (camera) {
			camera.position.x = 10000;
			camera.position.y = 10000;
			camera.position.z = 10000;
		}

		interval = setInterval(progress, 500);
	});

	onDestroy(() => {
		if (window) {
			window.clearInterval(interval);
		}
	});

	function progress() {
		if (play) {
			if (stepXProgress < 10) {
				progressiveSpin.x += stepX;
				stepXProgress++;
			} else if (stepZProgress < 10) {
				progressiveSpin.z += stepZ;
				stepZProgress++;
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code == 'Space') {
			play = !play;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={31000}>
	<OrbitControls target={{ x: 0, y: 0, z: 0 }} />
</PerspectiveCamera>

<Sun />

<AmbientLight />

<Group>
	<Line points={randomNorthPoints} material={northMat} />
</Group>

<Earth rotation={progressiveSpin} />

<style>
</style>
