<script lang="ts">
	import * as THREE from 'three';
	import {
		OrbitControls,
		PerspectiveCamera,
		useThrelte,
		AmbientLight,
		Line,
		Group
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { EARTH_RADIUS_KM } from '$lib/constants';
	import Earth from '$lib/gaphics/3d/Earth.svelte';

	// When we load the texture of the Earth onto a sphere, by default the north
	// pole will start at the center of the sphere and follow the Y axis.
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
	// Apply the inverse rotation so we can get the right Y-value to use
	// in the second rotation
	const invRotatedNorth = randomNorth.clone();
	invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
	earthSpin.z = -Math.atan(randomNorth.x / invRotatedNorth.y); // x value doesn't change
	const northMat = new THREE.LineBasicMaterial({ color: 0x9932cc });

	let stepXProgress = 0;
	let stepZProgress = 0;
	const stepX = earthSpin.x / 10;
	const stepZ = earthSpin.z / 10;
	let interval: NodeJS.Timer;

	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(20000));

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

<AmbientLight />

<Group>
	<Line points={randomNorthPoints} material={northMat} />
</Group>

<Earth rotation={progressiveSpin} />

<style>
</style>
