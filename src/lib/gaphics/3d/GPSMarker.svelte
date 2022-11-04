<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, Line, LineSegments } from '@threlte/core';
	import { EARTH_RADIUS_KM } from '$lib/constants';
	import { gpsToCartesian } from '$lib/math';
	import type { GPS } from '$lib/types';

	export let gps: GPS;
	export let showTrajectory = true;

	let gpsPoint = gpsToCartesian(gps?.lon, gps?.lat, EARTH_RADIUS_KM);

	const gpsSphereGeom = new THREE.SphereGeometry(20, 36, 36);
	const gpsSphereMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });

	// let gpsRingSize = getSphericalHorizontalRingSize($mapsCameraView.center[1], EARTH_RADIUS_KM);
	// let gpsRingGeom = new THREE.EdgesGeometry(new THREE.CircleGeometry(gpsRingSize + 1, 100));
	// const gpsRingMat = new THREE.LineBasicMaterial({ color: 0xff8c00 });
</script>

<!-- gps coords pin -->
<Mesh position={gpsPoint} geometry={gpsSphereGeom} material={gpsSphereMat} />

<!-- gps coords path -->
<!-- <LineSegments
			position={{ y: gps.y }}
			rotation={{ x: Math.PI / 2 }}
			geometry={gpsRingGeom}
			material={gpsRingMat}
		/> -->
