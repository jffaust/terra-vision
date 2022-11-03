<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, PointLight } from '@threlte/core';
	import { SUN_RADIUS_KM } from '$lib/constants';
	import { getContext } from 'svelte';
	import { Textures, texturesContextKey } from '$lib/types';

	export let position = new THREE.Vector3();

	const textures = getContext<Map<Textures, THREE.Texture>>(texturesContextKey);

	const sunGeom = new THREE.SphereGeometry(SUN_RADIUS_KM, 100, 100);
	const sunMat = new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	});
</script>

<Group {position}>
	<Mesh geometry={sunGeom} material={sunMat} />
	<PointLight decay={2} intensity={1e17} />
</Group>
