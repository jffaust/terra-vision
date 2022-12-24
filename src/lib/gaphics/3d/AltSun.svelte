<script lang="ts">
	import * as THREE from 'three';
	import { Group, Mesh, PointLight } from '@threlte/core';
	import { SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';
	import { sunFragmentShader } from './sunFragmentShader';

	export let width: number;
	export let height: number;
	export let position = new THREE.Vector3();

	const uniforms = {
		aspectRatio: { type: 'f', value: width / height },
		sunPosition: { type: 'v3', value: new THREE.Vector3() },
		sunScreenPos: { type: 'v3', value: new THREE.Vector3() },
		sunSize: { type: 'f', value: 0.0 },
		randAngle: { type: 'f', value: 0.0 },
		camAngle: { type: 'f', value: 0.0 }
	};

	const vertexShader = /*glsl*/ `
varying vec2 vPxScreenPosition;

void main() {
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	vPxScreenPosition = vec2(gl_Position.x / gl_Position.z, gl_Position.y / gl_Position.z);
}
    `;

	const geo = new THREE.PlaneGeometry(SUN_RADIUS, SUN_RADIUS, 10, 10);
	const mat = new THREE.ShaderMaterial({
		fragmentShader: sunFragmentShader,
		vertexShader,
		uniforms,
		transparent: true
	});
</script>

<Group {position}>
	<Mesh geometry={geo} material={mat} />
	<PointLight decay={2} intensity={SUN_INTENSITY} />
</Group>
