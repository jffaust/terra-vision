<script lang="ts">
	import * as THREE from 'three';
	import { Line, Group } from '@threlte/core';

	export let length: number = 1;
	export let position = new THREE.Vector3();

	const axisX: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(length, 0, 0)];
	const axisY: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(0, length, 0)];
	const axisZ: THREE.Vector3[] = [new THREE.Vector3(), new THREE.Vector3(0, 0, length)];
</script>

<Group {position}>
	<Line points={axisX} material={new THREE.LineBasicMaterial({ color: 0xff5555 })} />
	<Line points={axisY} material={new THREE.LineBasicMaterial({ color: 0x55ff55 })} />
	<Line points={axisZ} material={new THREE.LineBasicMaterial({ color: 0x5555ff })} />
</Group>
