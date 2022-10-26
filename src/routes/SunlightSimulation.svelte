<script lang="ts">
	import * as THREE from 'three';
	import { DEG2RAD, degToRad } from 'three/src/math/MathUtils';
	import {
		Canvas,
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
	import { BufferGeometry } from 'three';

	//woah : https://gravitysimulator.org/solar-system/the-inner-solar-system
	//code: https://discourse.threejs.org/t/updating-ellipsecurve/8218/8

	// using a scale of 1 : 1000 kilometers
	const sunRadius = 695.7; // 695,700 km
	const earthRadius = 6.371; // 6,371 km
	const earthTilt = 0.4014257; //23 degres or 0.401 radians
	const earthInitialPos = { x: 150000, y: 0, z: 0 }; // start at June solstice
	let earthGroup: Group;
	let earthDayRotation = 0; // radians
	//https://www.cs.mcgill.ca/~rwest/wikispeedia/wpcd/wp/e/Earth.htm
	let earthSunOrbit = new THREE.EllipseCurve(
		0,
		0,
		149597.887,
		149576.999,
		0,
		2 * Math.PI,
		false,
		0
	);
	earthSunOrbit;

	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;
	const tLoader = new THREE.TextureLoader();
	const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });

	let texturesLoaded = false;
	let sunTexture: THREE.Texture;
	let earthTexture: THREE.Texture;

	useFrame(() => {
		earthDayRotation += 0.005;
	});

	let gps = getGPS3DPosition($mapsCameraView.center[0], $mapsCameraView.center[1], earthRadius);

	onMount(async () => {
		scene.add(new THREE.AxesHelper(1000000));

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
</script>

<PerspectiveCamera bind:camera position={{ x: earthInitialPos.x - 10, y: 0, z: 10 }} far={1000000}>
	<OrbitControls target={earthInitialPos} />
</PerspectiveCamera>

<AmbientLight color={0xe5dee3} intensity={0.3} />

<!-- <PointLight position={{ x: 0, y: 0, z: 0 }} /> -->

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
		geometry={new THREE.BufferGeometry().setFromPoints(earthSunOrbit.getSpacedPoints(360))}
		material={new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 })}
	/>

	<Group bind:this={earthGroup} position={earthInitialPos} rotation={{ z: earthTilt, y: 0 }}>
		<Mesh
			geometry={new THREE.SphereGeometry(earthRadius, 100, 100)}
			material={new THREE.MeshPhongMaterial({
				map: earthTexture
			})}
		/>
		<LineSegments
			geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(earthRadius, 100, 100))}
			material={lineMat}
		/>

		<Mesh
			position={gps}
			geometry={new THREE.SphereGeometry(0.01, 36, 36)}
			material={new THREE.MeshBasicMaterial({ color: 0x38ea27 })}
		/>
	</Group>
{/if}

<style>
</style>
