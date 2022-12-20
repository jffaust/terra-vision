<script lang="ts">
	import * as THREE from 'three';
	import { Mesh } from '@threlte/core';
	import { getGPSRingSize, gpsToCartesian } from '$lib/math';
	import Ring from './Ring.svelte';
	import { EARTH_RADIUS } from '$lib/sim/threejs';

	export let lat: number;
	export let lon: number;

	const gpsSphereGeom = new THREE.SphereGeometry(EARTH_RADIUS / 1000, 36, 36);
	const gpsSphereMat = new THREE.MeshBasicMaterial({ color: 'red' });

	$: gpsPoint = gpsToCartesian(lon, lat, EARTH_RADIUS);
	$: ringSize = getGPSRingSize(lat, EARTH_RADIUS * 1.001);
</script>

<!-- gps coords pin -->
<Mesh position={gpsPoint} geometry={gpsSphereGeom} material={gpsSphereMat} />

<!-- trajectory path -->
<Ring
	dashed={false}
	radius={ringSize}
	position={{ y: gpsPoint.y }}
	rotation={{ x: Math.PI / 2 }}
	color={'orange'}
/>
