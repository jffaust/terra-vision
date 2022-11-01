<script lang="ts">
	import * as THREE from 'three';
	import { DEG2RAD, degToRad } from 'three/src/math/MathUtils';
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
	import { orbit, sim } from '$lib/sim/simulation';
	import { EARTH_RADIUS_KM, SUN_RADIUS_KM } from '$lib/constants';
	import type { SimProps } from '$lib/types';

	const ctx = useThrelte();
	const { scene } = useThrelte();
	let camera: THREE.PerspectiveCamera;

	let prevEarthPos: THREE.Vector3;
	const unsub = sim.subscribe(onSimUpdated);

	//useFrame((ctx, delta) => {});

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000000));
	});

	onDestroy(unsub);

	function onSimUpdated(s: SimProps) {
		if (camera) {
			if (!prevEarthPos) {
				const initialCamPos = new THREE.Vector3();
				initialCamPos.copy(s.earth.pos);
				initialCamPos.multiplyScalar(1.005);
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
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($orbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera bind:camera far={900000000}>
	<OrbitControls target={$sim.earth.pos} />
</PerspectiveCamera>

<!-- sun -->
<Mesh
	geometry={new THREE.SphereGeometry(SUN_RADIUS_KM, 50, 50)}
	material={new THREE.MeshStandardMaterial({ color: '#FFFF00' })}
/>

<PointLight position={{ x: 0, y: 0, z: 0 }} decay={2} intensity={10000000000000} />

<Group>
	<!-- earth -->
	<Mesh
		position={{ x: $sim.earth.pos.x, y: $sim.earth.pos.y, z: $sim.earth.pos.z }}
		geometry={new THREE.SphereGeometry(EARTH_RADIUS_KM, 50, 50)}
		material={new THREE.MeshStandardMaterial({ color: '#87CEFA' })}
	/>
</Group>

<Line points={$orbit} material={new THREE.LineBasicMaterial({ color: 0xff0000 })} />

<style>
</style>
