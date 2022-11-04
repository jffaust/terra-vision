<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, Line, LineSegments } from '@threlte/core';
	import { EARTH_RADIUS_KM } from '$lib/constants';
	import { getContext } from 'svelte';
	import { Textures, texturesContextKey, type GPS } from '$lib/types';
	import { gpsToCartesian } from '$lib/math';

	export let gps: GPS | null = null;
	export let position = new THREE.Vector3();
	export let rotation = new THREE.Euler(0, 0, 0, 'XZY');

	const textures = getContext<Map<Textures, THREE.Texture>>(texturesContextKey);

	const earthGeom = new THREE.SphereGeometry(EARTH_RADIUS_KM, 100, 100);
	const earthMat = new THREE.MeshPhongMaterial({
		map: textures.get(Textures.EarthColor)
		// normalMap: earthNormalTexture,
		// normalScale: 0.5,
		// bumpMap: earthBumpMap,
		// bumpScale: 0.1,
		// specularMap: earthSpecMap,
		// shininess: 0.5
	});
	const earthPolesPoints: THREE.Vector3Tuple[] = [
		[0, -EARTH_RADIUS_KM - 500, 0],
		[0, EARTH_RADIUS_KM + 500, 0]
	];

	const circleGeom = new THREE.CircleGeometry(EARTH_RADIUS_KM + 1, 100);
	const edgesCircleGeom = new THREE.EdgesGeometry(circleGeom);
	const redLine = new THREE.LineBasicMaterial({ color: 0xff0000 });

	let gpsPoint: THREE.Vector3;
	if (gps) {
		gpsPoint = gpsToCartesian(gps?.lon, gps?.lat, EARTH_RADIUS_KM);
	}
</script>

<Group {position} {rotation}>
	<!-- earth -->
	<Mesh geometry={earthGeom} material={earthMat} />

	<!-- geographic north and south poles -->
	<Line points={earthPolesPoints} material={redLine} />

	<!-- equator -->
	<LineSegments rotation={{ x: Math.PI / 2 }} geometry={edgesCircleGeom} material={redLine} />

	<!-- prime meridian -->
	<LineSegments geometry={edgesCircleGeom} material={redLine} />

	{#if gps}
		<!-- gps coords pin -->
		<Mesh position={gps} geometry={gpsSphereGeom} material={gpsSphereMat} />

		<!-- gps coords path -->
		<LineSegments
			position={{ y: gps.y }}
			rotation={{ x: Math.PI / 2 }}
			geometry={gpsRingGeom}
			material={gpsRingMat}
		/>
	{/if}
	<slot />
</Group>
