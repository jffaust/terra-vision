<script lang="ts">
	import * as THREE from 'three';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import {
		Group,
		Mesh,
		useFrame,
		OrbitControls,
		PerspectiveCamera,
		useThrelte,
		DirectionalLight,
		AmbientLight,
		Line,
		Line2,
		PointLight,
		LineSegments
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { earthOrbit, sim } from '$lib/sim/threejs';
	import { EARTH_RADIUS_KM, SUN_RADIUS_KM } from '$lib/constants';
	import { Textures, type SimData } from '$lib/types';
	import { DEG2RAD, degToRad } from 'three/src/math/MathUtils';
	import { getSphericalHorizontalRingSize, sphericalToCartesian } from '$lib/math';
	import { mapsCameraView } from '$lib/stores';

	export let textures: Map<Textures, THREE.Texture>;

	const sunGeom = new THREE.SphereGeometry(SUN_RADIUS_KM, 100, 100);
	const sunMat = new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	});
	const orbitMat = new THREE.LineBasicMaterial({
		color: 0x333333,
		transparent: true,
		opacity: 0.5
	});

	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY');
	const earthGeom = new THREE.SphereGeometry(EARTH_RADIUS_KM, 100, 100);
	const earthMat = new THREE.MeshPhongMaterial({
		map: textures.get(Textures.EarthColor)
		// normalMap: earthNormalTexture,
		// normalScale: 0.5,
		// bumpMap: earthBumpMap,
		// bumpScale: 0.1,
		// specularMap: earthSpecMap,
		// shininess: 0.5
	});
	const earthPolesPoints: THREE.Vector3Tuple[] = [
		[0, -EARTH_RADIUS_KM - 500, 0],
		[0, EARTH_RADIUS_KM + 500, 0]
	];
	const equatorGeom = new THREE.EdgesGeometry(new THREE.CircleGeometry(EARTH_RADIUS_KM + 1, 100));
	const equatorMat = new THREE.LineBasicMaterial({ color: 0xff0000 });

	const gpsSphereGeom = new THREE.SphereGeometry(20, 36, 36);
	const gpsSphereMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
	let gps = sphericalToCartesian(
		$mapsCameraView.center[0],
		$mapsCameraView.center[1],
		EARTH_RADIUS_KM
	);
	let gpsRingSize = getSphericalHorizontalRingSize($mapsCameraView.center[1], EARTH_RADIUS_KM);
	let gpsRingGeom = new THREE.EdgesGeometry(new THREE.CircleGeometry(gpsRingSize + 1, 100));
	const gpsRingMat = new THREE.LineBasicMaterial({ color: 0xff8c00 });

	const stats = Stats();
	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	let prevEarthPos: THREE.Vector3;
	const unsub = sim.subscribe(onSimUpdated);

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000000));

		document.body.appendChild(stats.dom);
	});

	onDestroy(unsub);

	function onSimUpdated(s: SimData) {
		stats.update();
		if (camera) {
			if (!prevEarthPos) {
				const initialCamPos = new THREE.Vector3();
				initialCamPos.copy(s.earth.pos);
				initialCamPos.multiplyScalar(0.99987);
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

		const north = s.earth.axis.north;
		earthSpin.x = Math.atan(north.z / north.y);
		earthSpin.z = -Math.atan(north.x / north.y);
		earthSpin.y = s.earth.axis.spin;
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($earthOrbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={310000000}>
	<OrbitControls target={$sim.earth.pos} />
</PerspectiveCamera>

<!-- sun -->
<Mesh geometry={sunGeom} material={sunMat} />
<PointLight decay={2} intensity={1e17} />
<!-- <AmbientLight /> -->

<!-- earth's orbit -->
<Line points={$earthOrbit} material={orbitMat} />

<Group position={$sim.earth.pos} rotation={earthSpin}>
	<!-- earth -->
	<Mesh geometry={earthGeom} material={earthMat} />

	<!-- geographic north and south poles -->
	<Line points={earthPolesPoints} material={equatorMat} />
	<!-- equator -->
	<LineSegments rotation={{ x: Math.PI / 2 }} geometry={equatorGeom} material={equatorMat} />

	<!-- gps coords pin -->
	<Mesh position={gps} geometry={gpsSphereGeom} material={gpsSphereMat} />

	<!-- gps coords path -->
	<LineSegments
		position={{ y: gps.y }}
		rotation={{ x: Math.PI / 2 }}
		geometry={gpsRingGeom}
		material={gpsRingMat}
	/>
</Group>

<style>
</style>
