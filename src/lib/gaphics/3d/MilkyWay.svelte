<script lang="ts">
	import * as THREE from 'three';
	import { Mesh } from '@threlte/core';
	import { getContext } from 'svelte';
	import { Textures, CTX_TEXTURES } from '$lib/types';
	import { EARTH_ORBIT_RADIUS } from '$lib/sim/threejs';

	const textures = getContext<Map<Textures, THREE.Texture>>(CTX_TEXTURES);

	const geometry = new THREE.SphereGeometry(EARTH_ORBIT_RADIUS * 4, 100, 100);
	const material = new THREE.MeshStandardMaterial({
		map: textures.get(Textures.MilkyWay),
		side: THREE.DoubleSide
	});
</script>

<Mesh {geometry} {material} />
