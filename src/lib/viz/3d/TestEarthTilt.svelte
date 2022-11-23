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
	import Earth from '$lib/gaphics/3d/Earth.svelte';
	import { EARTH_RADIUS, sim } from '$lib/sim/threejs';

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

	// let x = Math.random() * 2 - 1;
	// let y = Math.random();
	// let z = Math.random() * 2 - 1;
	// let testNorth = new THREE.Vector3(x, y, z).normalize();

	// can also test with the current north
	const testNorth = $sim.earth.north;

	let randomNorthPoints: THREE.Vector3[] = [
		new THREE.Vector3(),
		testNorth.clone().multiplyScalar(EARTH_RADIUS * 1.3)
	];

	earthSpin.x = Math.atan(testNorth.z / testNorth.y);
	// Apply the inverse rotation so we can get the right Y-value to use
	// in the second rotation
	const invRotatedNorth = testNorth.clone();
	invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
	earthSpin.z = -Math.atan(testNorth.x / invRotatedNorth.y); // x value doesn't change
	const northMat = new THREE.LineBasicMaterial({ color: 0x9932cc });

	let stepXProgress = 0;
	let stepZProgress = 0;
	const stepX = earthSpin.x / 10;
	const stepZ = earthSpin.z / 10;
	let interval: NodeJS.Timer;

	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	onMount(async () => {
		scene.add(new THREE.AxesHelper(100));

		if (camera) {
			camera.position.x = EARTH_RADIUS * 2;
			camera.position.y = EARTH_RADIUS * 2;
			camera.position.z = EARTH_RADIUS * 2;
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
			} else {
				progressiveSpin.y += 0.05;
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code == 'Enter') {
			play = !play;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={100}>
	<OrbitControls target={{ x: 0, y: 0, z: 0 }} />
</PerspectiveCamera>

<AmbientLight />

<Group>
	<Line points={randomNorthPoints} material={northMat} />
</Group>

<Earth rotation={progressiveSpin} />

<style>
</style>
