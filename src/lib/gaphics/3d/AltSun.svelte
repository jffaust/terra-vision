<script lang="ts">
	import * as THREE from 'three';
	import {
		Group,
		Mesh,
		PointLight,
		AmbientLight,
		useFrame,
		type ThrelteContext,
		useThrelte
	} from '@threlte/core';
	import { EARTH_ORBIT_RADIUS, SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';
	import { sunFragmentShader } from './sunFragmentShader';
	import { get } from 'svelte/store';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { onMount } from 'svelte';

	export let width: number;
	export let height: number;
	export let position = new THREE.Vector3();

	let flarePos = new THREE.Vector3();
	let flareRot = new THREE.Quaternion();
	let planeMesh: Mesh;

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

	const geo = new THREE.PlaneGeometry(EARTH_ORBIT_RADIUS, EARTH_ORBIT_RADIUS, 10, 10);
	const mat = new THREE.ShaderMaterial({
		fragmentShader: sunFragmentShader,
		vertexShader,
		uniforms,
		transparent: true
	});

	const { scene } = useThrelte();
	onMount(() => {
		scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));
	});

	useFrame(updateFlare);

	function updateFlare({ camera }: ThrelteContext) {
		const cam = get(camera);
		const pcam = cam as THREE.PerspectiveCamera;
		if (pcam == null) return;

		const camToSun = cam.position.clone().sub(position);

		planeMesh.mesh.quaternion.copy(cam.quaternion);
		planeMesh.mesh.position.copy(camToSun.clone().multiplyScalar(0.1));

		const sunScreenPos = position.clone().project(cam);

		uniforms.sunPosition.value.copy(camToSun.multiplyScalar(-1));

		const visibleW = Math.tan((DEG2RAD * pcam.fov) / 2) * camToSun.length() * 2;
		const sunScaledSize = SUN_RADIUS * 1; //this.scale;
		const sunScreenRatio = sunScaledSize / visibleW;

		uniforms.sunSize.value = sunScreenRatio;
		uniforms.randAngle.value = uniforms.randAngle.value + 0.001;
		uniforms.camAngle.value = camToSun.angleTo(new THREE.Vector3(1, 1, 0));
		uniforms.sunScreenPos.value = sunScreenPos;
		console.log(uniforms);
	}
</script>

<Group {position}>
	<PointLight decay={2} intensity={SUN_INTENSITY} />
	<!-- <AmbientLight /> -->
</Group>
<Mesh bind:this={planeMesh} geometry={geo} material={mat} />
