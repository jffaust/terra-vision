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
	import * as ae from 'astronomy-engine';

	export let textures: Map<Textures, THREE.Texture>;

	let earthGroup: THREE.Group;
	let earthSpin = new THREE.Euler(0, 0, 0, 'XZY'); // 23.4 degrees
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

	const equatorGeom = new THREE.EdgesGeometry(new THREE.CircleGeometry(EARTH_RADIUS_KM + 1, 100));
	const equatorMat = new THREE.LineBasicMaterial({ color: 0xff0000 });

	const stats = Stats();
	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	let prevEarthPos: THREE.Vector3;
	const unsub = sim.subscribe(onSimUpdated);

	let ai = ae.RotationAxis(ae.Body.Earth, new Date());
	let north = new THREE.Vector3(ai.north.x, ai.north.z, ai.north.y);
	const earthPolesPoints: THREE.Vector3[] = [
		north.multiplyScalar(EARTH_RADIUS_KM + 5000),
		north.clone().multiplyScalar(-1)
	];

	useFrame((ctx, delta) => {
		if (earthGroup) {
			//earthGroup.setRotationFromAxisAngle($sim.earth.axis.north, $sim.earth.axis.spin);
		}
	});

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000000));
		scene.add(new THREE.GridHelper(100000, 100));
		document.body.appendChild(stats.dom);
	});

	onDestroy(unsub);

	function onSimUpdated(s: SimData) {
		stats.update();
		if (camera) {
			if (!prevEarthPos) {
				camera.position.x = 10000;
				camera.position.y = 10000;
				camera.position.z = 10000;
			} else {
			}
			prevEarthPos = s.earth.pos;
		}
		//temporarily
		//earthSpin.y += 0.001;
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($earthOrbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={310000000}>
	<OrbitControls />
</PerspectiveCamera>

<AmbientLight />

<Group bind:group={earthGroup}>
	<!-- earth -->
	<Mesh geometry={earthGeom} material={earthMat} />

	<!-- geographic north and south poles -->
	<Line points={earthPolesPoints} material={equatorMat} />
	<!-- equator -->
	<LineSegments rotation={{ x: Math.PI / 2 }} geometry={equatorGeom} material={equatorMat} />

	/>
</Group>

<style>
</style>
