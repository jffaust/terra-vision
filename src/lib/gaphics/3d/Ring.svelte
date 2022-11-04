<script lang="ts">
	import * as THREE from 'three';
	import { Line2, LineSegments, type Rotation, type Position } from '@threlte/core';
	import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

	export let radius: number = 1;
	export let position: Position = new THREE.Vector3();
	export let rotation: Rotation = new THREE.Euler(0, 0, 0, 'XYZ');
	export let color: THREE.ColorRepresentation = 0xff0000;

	const circleGeom = new THREE.CircleGeometry(radius, 100);
	const ringGeom = new THREE.EdgesGeometry(circleGeom);
	const lineMat = new THREE.LineBasicMaterial({ color });
	//     const lineMat = new LineMaterial({
	//     worldUnits: true,
	//     linewidth: 0.2
	//   })
	//   const linePoints = ringGeom.
</script>

<!-- try with line2 with line width -->
<!-- maybe https://stackoverflow.com/questions/26605108/can-i-increase-vector-precision-in-three-js -->
<!-- <Line2 {position} {rotation} geometry={ringGeom} material={lineMat} /> -->
<LineSegments {position} {rotation} geometry={ringGeom} material={lineMat} />
