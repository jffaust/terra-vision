<script lang="ts">
	import * as THREE from 'three';
	import {
		Group,
		Mesh,
		PointLight,
		AmbientLight,
		useFrame,
		type ThrelteContext
	} from '@threlte/core';
	import { SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';
	import { sunFragmentShader } from './sunFragmentShader';
	import { get } from 'svelte/store';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	export let width: number;
	export let height: number;
	export let position = new THREE.Vector3();

	let flarePos = new THREE.Vector3();
	let flareRot = new THREE.Quaternion();

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

	useFrame(updateFlare);

	function updateFlare({ camera }: ThrelteContext) {
		const cam = get(camera);
		const pcam = cam as THREE.PerspectiveCamera;
		if (pcam == null) return;
		console.log('testing flare: ' + cam.position.x);

		const camToSun = cam.position.clone().sub(position);

		flareRot.copy(cam.quaternion);

		flarePos.copy(camToSun.clone().multiplyScalar(0.1)); /**/
		// const scaleRatio = (camToSun.length() / this.stageSize) * 0.8;

		const sunScreenPos = position.clone().project(cam);

		// this.sky.mesh.scale.set(scaleRatio, scaleRatio, scaleRatio);/**/
		uniforms.sunPosition.value.copy(camToSun.multiplyScalar(-1));

		const visibleW = Math.tan((DEG2RAD * pcam.fov) / 2) * camToSun.length() * 2;
		const sunScaledSize = SUN_RADIUS * 2 * 1; //this.scale;
		const sunScreenRatio = sunScaledSize / visibleW;
		// console.log(visibleW, CameraManager.getCamera().fov, camToSun.length(), sunScaledSize);
		uniforms.sunSize.value = sunScreenRatio;
		uniforms.randAngle.value = uniforms.randAngle.value + 0.001;
		uniforms.camAngle.value = camToSun.angleTo(new THREE.Vector3(1, 1, 0));
		uniforms.sunScreenPos.value = sunScreenPos;
	}
</script>

<Group {position}>
	<!-- <PointLight decay={2} intensity={SUN_INTENSITY} /> -->
	<AmbientLight />
</Group>
<Mesh rotation={flareRot} position={flarePos} geometry={geo} material={mat} />
