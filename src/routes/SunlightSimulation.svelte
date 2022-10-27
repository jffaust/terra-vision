<script lang="ts">
	import * as THREE from 'three';
	import { DEG2RAD, degToRad } from 'three/src/math/MathUtils';
	import {
		PointLight,
		AmbientLight,
		Group,
		Mesh,
		useFrame,
		OrbitControls,
		PerspectiveCamera,
		type ThrelteContext,
		LineSegments,
		type Position,
		useThrelte,
		Line
	} from '@threlte/core';
	import { onMount } from 'svelte';
	import { mapsCameraView } from './stores';

	// const ctx = useThrelte();

	let playSimulation = true;

	//woah : https://gravitysimulator.org/solar-system/the-inner-solar-system
	//code: https://discourse.threejs.org/t/updating-ellipsecurve/8218/8

	// using a scale of 1 : 1000 kilometers
	const sunRadius = 695.7; // 695,700 km
	const earthRadius = 6.371; // 6,371 km
	const earthTilt = 0.4014257; //23 degres or 0.401 radians
	const earthPos = { x: 0, y: 0, z: 0 }; // start at June solstice
	let earthGroup: THREE.Group;
	let earthDayRotation = new THREE.Euler(0, 0, earthTilt, 'XZY'); // radians
	//https://www.cs.mcgill.ca/~rwest/wikispeedia/wpcd/wp/e/Earth.htm
	const earthSunOrbit = new THREE.EllipseCurve(
		0,
		0,
		149597.887,
		149576.999,
		0,
		2 * Math.PI,
		false,
		0
	);
	const dayDurationInSec = 60;
	const yearDurationInSec = 365 * dayDurationInSec;
	const earthDayRotationRate = (2 * Math.PI) / dayDurationInSec;

	// the ellipse curve is only using X and Y coords so we switch Y to Z to have it flat
	const eartSunOrbitPoints = earthSunOrbit
		.getSpacedPoints(3600)
		.map((p) => new THREE.Vector3(p.x, 0, p.y));

	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;
	const tLoader = new THREE.TextureLoader();
	const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });

	let texturesLoaded = false;
	let sunTexture: THREE.Texture;
	let earthTexture: THREE.Texture;

	let totalSecondsElapsed = 0;
	useFrame((ctx, delta) => {
		if (!playSimulation) return;
		totalSecondsElapsed += delta;
		earthDayRotation.y += delta * earthDayRotationRate;

		const currentAngle = (totalSecondsElapsed % yearDurationInSec) / yearDurationInSec;
		const xyPoint = earthSunOrbit.getPoint(currentAngle);

		const diffX = xyPoint.x - earthPos.x;
		const diffZ = xyPoint.y - earthPos.z;
		earthPos.x = xyPoint.x;
		earthPos.z = xyPoint.y;
		if (earthGroup) {
			earthGroup.position.set(earthPos.x, earthPos.y, earthPos.z);
		}

		if (camera) {
			if (camera.position.x == 0) {
				const nextXYPoint = earthSunOrbit.getPoint(currentAngle + 0.00002);
				camera.position.x = nextXYPoint.x;
				camera.position.z = nextXYPoint.y;
			} else {
				camera.position.x += diffX;
				camera.position.z += diffZ;
			}
		}
	});

	let gps = getGPS3DPosition($mapsCameraView.center[0], $mapsCameraView.center[1], earthRadius);

	onMount(async () => {
		scene.add(new THREE.AxesHelper(200000));

		sunTexture = await tLoader.loadAsync('/space/sun.jpg');
		// https://www.solarsystemscope.com/textures/ CC attribution international license
		earthTexture = await tLoader.loadAsync('/space/8k_earth_daymap.jpg');
		earthTexture.wrapS = THREE.RepeatWrapping;
		earthTexture.offset.x = 0.25; // not sure why :)
		texturesLoaded = true;
	});

	function getGPS3DPosition(lon: number, lat: number, radius: number): Position {
		console.log(`coords are: ${lon}, ${lat}`);
		let result = {
			x: Math.sin(degToRad(lon)) * Math.cos(degToRad(lat)) * radius,
			y: Math.sin(degToRad(lat)) * radius,
			z: Math.cos(degToRad(lon)) * Math.cos(degToRad(lat)) * radius
		};
		console.log(result);
		return result;
	}

	function handleKeyUp(e: KeyboardEvent) {
		console.log(e);
		if (e.code == 'Space') {
			playSimulation = !playSimulation;
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={1000000}>
	<OrbitControls zoomSpeed={2} rotateSpeed={0.5} target={earthPos} />
</PerspectiveCamera>

<!-- <AmbientLight color={0xe5dee3} intensity={0.3} /> -->

<PointLight position={{ x: 0, y: 0, z: 0 }} />

{#if texturesLoaded}
	<Mesh
		geometry={new THREE.SphereGeometry(sunRadius, 400, 200)}
		material={new THREE.MeshStandardMaterial({
			emissive: 0xffd700,
			emissiveIntensity: 1,
			emissiveMap: sunTexture
		})}
	/>

	<Line
		geometry={new THREE.BufferGeometry().setFromPoints(eartSunOrbitPoints)}
		material={new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 })}
	/>

	<Group bind:group={earthGroup} rotation={earthDayRotation}>
		<Mesh
			geometry={new THREE.SphereGeometry(earthRadius, 200, 200)}
			material={new THREE.MeshPhongMaterial({
				map: earthTexture
			})}
		/>
		<!-- <LineSegments
			geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(earthRadius + 0.01, 100, 100))}
			material={lineMat}
		/> -->

		<Mesh
			position={gps}
			geometry={new THREE.SphereGeometry(0.02, 36, 36)}
			material={new THREE.MeshBasicMaterial({ color: 0xff0000 })}
		/>
	</Group>
{/if}

<style>
</style>
