<script lang="ts">
	import * as THREE from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { Canvas, PointLight, Group, Mesh, OrbitControls, PerspectiveCamera } from '@threlte/core';

	const tLoader = new THREE.TextureLoader();
</script>

<div id="scene">
	<Canvas>
		<PerspectiveCamera position={{ x: 200, y: 200, z: 200 }} fov={24}>
			<OrbitControls />
		</PerspectiveCamera>

		<PointLight position={{ x: 0, y: 0, z: 0 }} />

		<Mesh
			geometry={new THREE.SphereGeometry(109, 400, 200)}
			material={new THREE.MeshStandardMaterial({
				emissive: 0xffd700,
				emissiveIntensity: 1,
				emissiveMap: tLoader.load('/space/sun.jpg')
			})}
		/>
	</Canvas>
</div>

<style>
	#scene {
		width: 100%;
		height: 100vh;
	}
</style>
