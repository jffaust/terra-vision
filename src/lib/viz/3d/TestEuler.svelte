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

	const axisX: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(2, 0, 0)];
	const axisY: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(0, 2, 0)];
	const axisZ: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(0, 0, 2)];

	let play = false;
	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	let progressiveSpin = new THREE.Euler(0, 0, 0, 'XZY');

	let x = Math.random() * 2 - 1;
	let y = Math.random();
	let z = Math.random() * 2 - 1;
	let randomNorth = new THREE.Vector3(x, y, z).normalize();
	let randomNorthPoints: THREE.Vector3[] = [new THREE.Vector3(), randomNorth.clone()];

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

	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	onMount(async () => {
		scene.add(new THREE.AxesHelper(2));

		if (camera) {
			camera.position.x = 3;
			camera.position.y = 3;
			camera.position.z = 3;
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

<Group rotation={progressiveSpin}>
	<Line points={axisX} material={new THREE.LineBasicMaterial({ color: 0xff5555 })} />
	<Line points={axisY} material={new THREE.LineBasicMaterial({ color: 0x55ff55 })} />
	<Line points={axisZ} material={new THREE.LineBasicMaterial({ color: 0x5555ff })} />
</Group>

<style>
</style>
