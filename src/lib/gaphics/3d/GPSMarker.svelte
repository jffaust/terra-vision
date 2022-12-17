<script lang="ts">
	import * as THREE from 'three';
	import { Mesh } from '@threlte/core';
	import { getGPSRingSize, gpsToCartesian } from '$lib/math';
	import type { GPSCoords } from '$lib/types';
	import Ring from './Ring.svelte';
	import { EARTH_RADIUS } from '$lib/sim/threejs';

	export let pos: GPSCoords; //export let showTrajectory = true;

	const gpsSphereGeom = new THREE.SphereGeometry(EARTH_RADIUS / 1000, 36, 36);
	const gpsSphereMat = new THREE.MeshBasicMaterial({ color: 'red' });

	let gpsPoint = gpsToCartesian(pos?.lon, pos?.lat, EARTH_RADIUS);
	let ringSize = getGPSRingSize(pos?.lat, EARTH_RADIUS * 1.001);
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
