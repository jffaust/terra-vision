<script lang="ts">
	import * as THREE from 'three';
	import {
		Group,
		Mesh,
		PointLight,
		useFrame,
		useThrelte,
		type ThrelteContext
	} from '@threlte/core';
	import { getContext } from 'svelte';
	import { Textures, CTX_TEXTURES } from '$lib/types';
	import { EARTH_ORBIT_RADIUS, EARTH_RADIUS, SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';
	import { onMount } from 'svelte';
	import sunshineFrag from '$lib/graphics/3d/shaders/sunshineFragment.glsl';
	import sunshineVertex from '$lib/graphics/3d/shaders/sunshineVertex.glsl';

	export let position = new THREE.Vector3();

	const textures = getContext<Map<Textures, THREE.Texture>>(CTX_TEXTURES);

	const sunGeom = new THREE.SphereGeometry(SUN_RADIUS, 50, 50);
	const sunMat = new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	});

	const sunshineGeom = new THREE.SphereGeometry(SUN_RADIUS * 1.4, 50, 50);
	const sunshineMat = new THREE.ShaderMaterial({
		fragmentShader: sunshineFrag,
		vertexShader: sunshineVertex,
		uniforms: {
			uSunCenter: {
				//@ts-ignore
				type: 'vec3',
				value: position
			}
		},
		side: THREE.BackSide
		// transparent: true,
	});

	// const { scene, camera, renderer } = useThrelte();

	onMount(() => {
		// scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));
	});
</script>

<Group {position}>
	<Mesh geometry={sunGeom} material={sunMat} />
	<Mesh geometry={sunshineGeom} material={sunshineMat} />
	<PointLight decay={2} intensity={SUN_INTENSITY} />
</Group>
