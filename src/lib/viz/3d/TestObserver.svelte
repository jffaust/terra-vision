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
	import { astroVectorToThreeJS, EARTH_RADIUS, sim } from '$lib/sim/threejs';
	import * as ae from 'astronomy-engine';

	let play = false;
	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	let progressiveSpin = new THREE.Euler(0, 0, 0, 'XZY');

	const now = new Date();
	let eqdLat0lon0Vec = ae.ObserverVector(now, new ae.Observer(0, 0, 0), true);
	let eqdLat90lon0Vec = ae.ObserverVector(now, new ae.Observer(90, 0, 0), true);
	let eqdLat0lon90Vec = ae.ObserverVector(now, new ae.Observer(0, 90, 0), true);

	console.table([eqdLat0lon0Vec, eqdLat90lon0Vec, eqdLat0lon90Vec]);

	let eqd2ecl = ae.Rotation_EQD_ECL(now);
	let eclLat0Lon0Vec = ae.RotateVector(eqd2ecl, eqdLat0lon0Vec);
	let eclLat90Lon0Vec = ae.RotateVector(eqd2ecl, eqdLat90lon0Vec);
	let eclLat0Lon90Vec = ae.RotateVector(eqd2ecl, eqdLat0lon90Vec);

	console.table([eclLat0Lon0Vec, eclLat90Lon0Vec, eclLat0Lon90Vec]);

	let lat0Lon0Vec = astroVectorToThreeJS(eclLat0Lon0Vec);
	let lat90Lon0Vec = astroVectorToThreeJS(eclLat90Lon0Vec);
	let lat0Lon90Vec = astroVectorToThreeJS(eclLat0Lon90Vec);

	let lat0Lon0Points = [new THREE.Vector3(), lat0Lon0Vec.multiplyScalar(1.3)];
	let lat90Lon0Points = [new THREE.Vector3(), lat90Lon0Vec.multiplyScalar(1.3)];
	let lat0Lon90Points = [new THREE.Vector3(), lat0Lon90Vec.multiplyScalar(1.3)];

	// earthSpin.x = Math.atan(testNorth.z / testNorth.y);
	// // Apply the inverse rotation so we can get the right Y-value to use
	// // in the second rotation
	// const invRotatedNorth = testNorth.clone();
	// invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
	// earthSpin.z = -Math.atan(testNorth.x / invRotatedNorth.y); // x value doesn't change
	const lineMat = new THREE.LineBasicMaterial({ color: 0xf00000 });

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
	<Line points={lat0Lon0Points} material={lineMat} />
	<Line points={lat90Lon0Points} material={lineMat} />
	<Line points={lat0Lon90Points} material={lineMat} />
</Group>

<Earth rotation={progressiveSpin} />

<style>
</style>
