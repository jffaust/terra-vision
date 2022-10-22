<script lang="ts">
	import * as THREE from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import {
		Canvas,
		PointLight,
		Group,
		Mesh,
		OrbitControls,
		PerspectiveCamera,
		type ThrelteContext
	} from '@threlte/core';
	import { onMount } from 'svelte';

	// using a scale of 1 : 1000 kilometers
	const sunRadius = 695.7; // 695,700 km
	const earthRadius = 6.371; // 6,371 km
	const earthTilt = 0.4014257; //23 degres or 0.401 radians
	const earthInitialPos = { x: 15000, y: 0, z: 0 };

	let ctx: ThrelteContext;
	let camera: THREE.PerspectiveCamera;
	const tLoader = new THREE.TextureLoader();

	let texturesLoaded = false;
	let sunTexture: THREE.Texture;
	let earthTexture: THREE.Texture;

	onMount(async () => {
		ctx.scene.add(new THREE.AxesHelper(1000000));
		//camera.translateY(100);

		sunTexture = await tLoader.loadAsync('/space/sun.jpg');
		earthTexture = await tLoader.loadAsync('/space/earth.jpg');
		texturesLoaded = true;
	});
</script>

<div id="scene">
	<Canvas bind:ctx>
		<PerspectiveCamera
			bind:camera
			position={{ x: earthInitialPos.x + 10, y: 0, z: 10 }}
			far={10000000}
		>
			<OrbitControls target={earthInitialPos} />
		</PerspectiveCamera>

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

			<Group position={earthInitialPos}>
				<Mesh
					rotation={{ z: earthTilt }}
					geometry={new THREE.SphereGeometry(earthRadius, 50, 50)}
					material={new THREE.MeshPhongMaterial({
						map: earthTexture
					})}
				/>
			</Group>
		{/if}
	</Canvas>
</div>

<style>
	#scene {
		width: 100%;
		height: 100vh;
	}
</style>
