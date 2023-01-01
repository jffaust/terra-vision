<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, PointLight } from '@threlte/core';
	import { getContext } from 'svelte';
	import { Textures, CTX_TEXTURES } from '$lib/types';
	import { SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';

	export let position = new THREE.Vector3();

	const textures = getContext<Map<Textures, THREE.Texture>>(CTX_TEXTURES);

	const sunGeom = new THREE.SphereGeometry(SUN_RADIUS, 100, 100);
	const sunMat = new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	});
</script>

<Group {position}>
	<Mesh geometry={sunGeom} material={sunMat} />
	<PointLight decay={2} intensity={SUN_INTENSITY} />
</Group>
