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

	const ctx = useThrelte();
	const { scene } = useThrelte();

	//useFrame((ctx, delta) => {});

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(200000000));
	});

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			console.log($orbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera position={{ x: 150000000, y: 150000000, z: 1500 }} far={900000000}>
	<OrbitControls target={{ y: 0 }} />
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
