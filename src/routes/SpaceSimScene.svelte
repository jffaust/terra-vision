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
	import { DoubleSide } from 'three';
	import { Textures } from '$lib/constants';

	export let textures: Map<Textures, THREE.Texture>;

	const ctx = useThrelte();

	let playSimulation = true;

	//woah : https://gravitysimulator.org/solar-system/the-inner-solar-system
	//code: https://discourse.threejs.org/t/updating-ellipsecurve/8218/8

	// using a scale of 1 : 1000 kilometers
	const sunRadius = 695.7; // 695,700 km
	const earthRadius = 6.371; // 6,371 km
	const earthTilt = 0.4014257; //23 degres or 0.401 radians
	const earthPos = { x: 0, y: 0, z: 0 }; // start at June solstice
	let earthGroup: THREE.Group;
	let axesGroup: THREE.Group;
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
	const equatorMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
	const axesMat = new THREE.LineBasicMaterial({ color: 0x00ff07 });
	const gpsColor = 0xff00ff;

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

		if (axesGroup) {
			axesGroup.position.set(earthPos.x, earthPos.y, earthPos.z);
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
	let gpsRingSize = Math.cos(degToRad($mapsCameraView.center[1])) * earthRadius;

	onMount(async () => {
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000));

		console.log('Sim mounted');
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

<PerspectiveCamera bind:camera far={10000000}>
	<OrbitControls zoomSpeed={2} rotateSpeed={0.5} target={earthPos} />
</PerspectiveCamera>

<!-- <AmbientLight color={0xe5dee3} intensity={0.3} /> -->

<PointLight position={{ x: 0, y: 0, z: 0 }} decay={2} intensity={100000000000} />

<!-- milky wayy -->
<Mesh
	geometry={new THREE.SphereGeometry(500000, 100, 100)}
	material={new THREE.MeshStandardMaterial({
		side: THREE.BackSide,
		emissive: 0x000000,
		emissiveIntensity: 1,
		map: textures.get(Textures.MilkyWay)
	})}
/>

<!-- sun -->
<Mesh
	geometry={new THREE.SphereGeometry(sunRadius, 50, 50)}
	material={new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	})}
/>

<!-- earth sun orbit -->
<Line
	geometry={new THREE.BufferGeometry().setFromPoints(eartSunOrbitPoints)}
	material={new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 })}
/>

<Group bind:group={earthGroup} rotation={earthDayRotation}>
	<!-- earth -->
	<Mesh
		geometry={new THREE.SphereGeometry(earthRadius, 100, 100)}
		material={new THREE.MeshPhongMaterial({
			map: textures.get(Textures.EarthColor)
			// normalMap: earthNormalTexture,
			// normalScale: 0.5,
			// bumpMap: earthBumpMap,
			// bumpScale: 0.1,
			// specularMap: earthSpecMap,
			// shininess: 0.5
		})}
	/>

	<!-- <LineSegments
			geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(earthRadius + 0.01, 100, 100))}
			material={lineMat}
		/> -->

	<!-- gps coords pin -->
	<Mesh
		position={gps}
		geometry={new THREE.SphereGeometry(0.02, 36, 36)}
		material={new THREE.MeshBasicMaterial({ color: gpsColor })}
	/>

	<!-- gps coords path -->
	<LineSegments
		position={{ y: gps.y }}
		rotation={{ x: Math.PI / 2 }}
		geometry={new THREE.EdgesGeometry(new THREE.CircleGeometry(gpsRingSize + 0.01, 100))}
		material={new THREE.LineBasicMaterial({ color: 0xff8c00 })}
	/>

	<!-- north and south poles -->
	<Line
		points={[
			[0, -earthRadius - 0.5, 0],
			[0, earthRadius + 0.5, 0]
		]}
		material={equatorMat}
	/>

	<!-- equator -->
	<LineSegments
		rotation={{ x: Math.PI / 2 }}
		geometry={new THREE.EdgesGeometry(new THREE.CircleGeometry(earthRadius + 0.01, 100))}
		material={equatorMat}
	/>
</Group>

<Group bind:group={axesGroup}>
	<!-- this one might not be necessary -->
	<LineSegments
		rotation={{ x: Math.PI / 2, y: Math.PI / 2 }}
		geometry={new THREE.EdgesGeometry(new THREE.CircleGeometry(earthRadius + 0.01, 100))}
		material={axesMat}
	/>

	<LineSegments
		rotation={{ x: Math.PI / 2 }}
		geometry={new THREE.EdgesGeometry(new THREE.CircleGeometry(earthRadius + 0.01, 100))}
		material={axesMat}
	/>
</Group>

<style>
</style>
