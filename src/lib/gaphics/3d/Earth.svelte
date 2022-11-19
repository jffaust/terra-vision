<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, Line, LineSegments } from '@threlte/core';
	import { getContext } from 'svelte';
	import { Textures, texturesContextKey } from '$lib/types';
	import Ring from './Ring.svelte';
	import { EARTH_RADIUS } from '$lib/sim/threejs';

	export let position = new THREE.Vector3();
	export let rotation = new THREE.Euler(0, 0, 0, 'XZY');

	const textures = getContext<Map<Textures, THREE.Texture>>(texturesContextKey);

	const earthGeom = new THREE.SphereGeometry(EARTH_RADIUS, 100, 100);
	const earthMat = new THREE.MeshPhongMaterial({
		map: textures.get(Textures.EarthColor),
		// normalMap: earthNormalTexture,
		// normalScale: 0.5,
		// bumpMap: earthBumpMap,
		// bumpScale: 0.1,
		specularMap: textures.get(Textures.EarthSpecular),
		shininess: 0.5
	});
	const earthPolesPoints: THREE.Vector3Tuple[] = [
		[0, -EARTH_RADIUS * 1.2, 0],
		[0, EARTH_RADIUS * 1.2, 0]
	];

	const redLine = new THREE.LineBasicMaterial({ color: 0xff0000 });
</script>

<Group {position} {rotation}>
	<!-- earth -->
	<Mesh geometry={earthGeom} material={earthMat} />

	<!-- geographic north and south poles -->
	<Line points={earthPolesPoints} material={redLine} />

	<!-- equator -->
	<!-- <LineSegments rotation={{ x: Math.PI / 2 }} geometry={edgesCircleGeom} material={redLine} /> -->
	<!-- <Ring radius={EARTH_RADIUS * 1.001} rotation={{ x: Math.PI / 2 }} /> -->

	<!-- prime meridian -->
	<!-- <LineSegments geometry={edgesCircleGeom} material={redLine} /> -->
	<Ring radius={EARTH_RADIUS * 1.001} />

	<slot />
</Group>
