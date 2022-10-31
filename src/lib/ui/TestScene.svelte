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
		AmbientLight
	} from '@threlte/core';
	import { onMount } from 'svelte';
	import { DoubleSide } from 'three';

	const ctx = useThrelte();
	const { scene } = useThrelte();

	let totalSecondsElapsed = 0;
	useFrame((ctx, delta) => {});

	onMount(async () => {
		console.log('SpaceSimScene Mounted');
		if (ctx && ctx.renderer) {
			ctx.renderer.physicallyCorrectLights = true;
		}

		scene.add(new THREE.AxesHelper(20));
	});
</script>

<PerspectiveCamera position={{ x: 10, y: 10, z: 10 }} fov={24}>
	<OrbitControls
		maxPolarAngle={DEG2RAD * 80}
		autoRotate={false}
		enableZoom={false}
		target={{ y: 0.5 }}
	/>
</PerspectiveCamera>

<DirectionalLight position={{ x: -3, y: 10, z: -10 }} intensity={0.2} />
<AmbientLight intensity={0.2} />

<!-- Cube -->
<Group>
	<Mesh
		position={{ y: 0.5 }}
		castShadow
		geometry={new THREE.BoxGeometry(1, 1, 1)}
		material={new THREE.MeshStandardMaterial({ color: '#333333' })}
	/>
</Group>

<!-- Floor -->
<Mesh
	receiveShadow
	rotation={{ x: -90 * (Math.PI / 180) }}
	geometry={new THREE.CircleGeometry(3, 72)}
	material={new THREE.MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
/>

<style>
</style>
