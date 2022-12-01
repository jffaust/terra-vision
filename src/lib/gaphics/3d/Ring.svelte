<script lang="ts">
	import * as THREE from 'three';
	import { Line2, LineSegments, type Rotation, type Position } from '@threlte/core';

	export let radius: number = 1;
	export let dashed: boolean = false;
	export let position: Position = new THREE.Vector3();
	export let rotation: Rotation = new THREE.Euler(0, 0, 0, 'XYZ');
	export let color: THREE.ColorRepresentation = 0xffff00;

	const circleGeom = new THREE.CircleGeometry(radius, 200);
	const ringGeom = new THREE.EdgesGeometry(circleGeom);
	const lineMat = dashed
		? new THREE.LineDashedMaterial({ color, dashSize: 0.1, gapSize: 0.1, scale: 0.1 })
		: new THREE.LineBasicMaterial({ color });

	// let angleDiff = (2 * Math.PI) / segments;
	// let euler = new THREE.Euler(0, 0, angleDiff);
	// let nextVector = new THREE.Vector3(0, radius, 0);
	// let points: THREE.Vector3[] = [nextVector];
	// for (let i = 0; i < segments; i++) {
	// 	nextVector = nextVector.clone().applyEuler(euler);
	// 	points.push(nextVector);
	// }
	// const lineMat = new LineMaterial({
	// 	worldUnits: true,
	// 	linewidth: 50
	// });
</script>

<!-- <Line2 {position} {rotation} {points} material={lineMat} /> -->
<LineSegments {position} {rotation} geometry={ringGeom} material={lineMat} />
