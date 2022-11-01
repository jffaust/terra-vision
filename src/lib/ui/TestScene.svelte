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
		Line2
	} from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { DoubleSide } from 'three';
	import { pos } from '$lib/sim/simulation';
	import { writable } from 'svelte/store';
	import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

	const ctx = useThrelte();
	const { scene } = useThrelte();

	let totalSecondsElapsed = 0;
	//useFrame((ctx, delta) => {});

	let orbit = writable<THREE.Vector3[]>([]);
	const unsub = pos.subscribe((p) => {
		$orbit.push(p);
		$orbit = $orbit;
	});

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(20));
	});

	onDestroy(unsub);

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key == 'o') {
			$orbit = $orbit;
			console.log($orbit);
		}
	}
</script>

<svelte:window on:keyup={handleKeyUp} />

<PerspectiveCamera position={{ x: 20, y: 20, z: 20 }} fov={24}>
	<OrbitControls target={{ y: 0.5 }} />
</PerspectiveCamera>

<AmbientLight intensity={0.5} />

<Mesh
	geometry={new THREE.SphereGeometry(1, 50, 50)}
	material={new THREE.MeshStandardMaterial({ color: '#FFFF00' })}
/>

<Group>
	<Mesh
		position={{ x: $pos.x, y: $pos.y, z: $pos.z }}
		geometry={new THREE.SphereGeometry(0.1, 50, 50)}
		material={new THREE.MeshStandardMaterial({ color: '#87CEFA' })}
	/>
</Group>

<Line2
	points={$orbit}
	material={new LineMaterial({ color: 0x333333, worldUnits: true, linewidth: 0.01 })}
/>

<style>
</style>
