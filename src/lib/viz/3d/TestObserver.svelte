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
	import { astroVectorToThreeJS, EARTH_RADIUS, spaceSim } from '$lib/sim/threejs';
	import * as ae from 'astronomy-engine';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	let play = false;
	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	let progressiveSpin = new THREE.Euler(0, 0, 0, 'XZY');

	let now = new Date();
	now.setHours(now.getHours() + 12);
	let eqdLat0lon0Vec = ae.ObserverVector(now, new ae.Observer(0, 0, 0), true);
	let eqdLat90lon0Vec = ae.ObserverVector(now, new ae.Observer(90, 0, 0), true);

	console.table([eqdLat0lon0Vec, eqdLat90lon0Vec]);

	let eqd2ecl = ae.Rotation_EQD_ECL(now);
	let eclLat0Lon0Vec = ae.RotateVector(eqd2ecl, eqdLat0lon0Vec);
	let eclLat90Lon0Vec = ae.RotateVector(eqd2ecl, eqdLat90lon0Vec);

	console.table([eclLat0Lon0Vec, eclLat90Lon0Vec]);

	let lat0Lon0Vec = astroVectorToThreeJS(eclLat0Lon0Vec);
	let lat90Lon0Vec = astroVectorToThreeJS(eclLat90Lon0Vec);

	let lat0Lon0Points = [new THREE.Vector3(), lat0Lon0Vec.multiplyScalar(1.3)];
	let lat90Lon0Points = [new THREE.Vector3(), lat90Lon0Vec.multiplyScalar(1.3)];

	earthSpin.x = Math.atan(lat90Lon0Vec.z / lat90Lon0Vec.y);
	// Apply the inverse rotation so we can get the right Y-value to use
	// in the second rotation
	const invRotatedNorth = lat90Lon0Vec.clone();
	invRotatedNorth.applyEuler(new THREE.Euler(-earthSpin.x));
	earthSpin.z = -Math.atan(lat90Lon0Vec.x / invRotatedNorth.y); // x value doesn't change

	// Initially, the gps at lat=0 & lon=0 aligns with the X axis in ThreeJS
	// We calculate the angle between this vector and the corresponding Observer vector
	let angle = Math.atan(eqdLat0lon0Vec.y / eqdLat0lon0Vec.x);
	if (eqdLat0lon0Vec.x < 0) {
		angle -= 180 * DEG2RAD;
	}
	earthSpin.y = angle;

	const lineMat = new THREE.LineBasicMaterial({ color: 0xf03000 });

	let maxSteps = 5;
	let stepXProgress = 0;
	let stepZProgress = 0;
	let stepYProgress = 0;
	const stepX = earthSpin.x / maxSteps;
	const stepZ = earthSpin.z / maxSteps;
	const stepY = earthSpin.y / maxSteps;
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
			if (stepXProgress < maxSteps) {
				progressiveSpin.x += stepX;
				stepXProgress++;
			} else if (stepZProgress < maxSteps) {
				progressiveSpin.z += stepZ;
				stepZProgress++;
			} else if (stepYProgress < maxSteps) {
				progressiveSpin.y += stepY;
				stepYProgress++;
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
</Group>

<Earth rotation={progressiveSpin} />

<style>
</style>
