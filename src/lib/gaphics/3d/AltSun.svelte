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
	import { EARTH_ORBIT_RADIUS, SUN_INTENSITY, SUN_RADIUS } from '$lib/sim/threejs';
	import { onMount } from 'svelte';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
	import { get } from 'svelte/store';

	export let width: number;
	export let height: number;
	export let position = new THREE.Vector3();

	const textures = getContext<Map<Textures, THREE.Texture>>(CTX_TEXTURES);

	const sunGeom = new THREE.SphereGeometry(1, 50, 50);
	const sunMat = new THREE.MeshStandardMaterial({
		emissive: 0xffd700,
		emissiveIntensity: 1,
		emissiveMap: textures.get(Textures.Sun)
	});

	const { scene, camera, renderer } = useThrelte();

	// taken from https://github.com/ankit-alpha-q/glowing-sun
	// bloom params: https://threejs.org/examples/#webgl_postprocessing_unreal_bloom
	const renderScene = new RenderPass(scene, get(camera));
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0, 2, 0.5);
	bloomPass.threshold = 0;
	bloomPass.strength = 2; //intensity of glow
	bloomPass.radius = 0.5;
	let bloomComposer: EffectComposer;

	onMount(() => {
		scene.add(new THREE.AxesHelper(EARTH_ORBIT_RADIUS));

		if (renderer) {
			renderer.autoClear = false;
			bloomComposer = new EffectComposer(renderer);
			// TODO: update bloom size on window resize
			bloomComposer.setSize(width, height);
			bloomComposer.renderToScreen = true;
			bloomComposer.addPass(renderScene);
			bloomComposer.addPass(bloomPass);
		}
	});

	useFrame(updateFlare);

	function updateFlare({ camera }: ThrelteContext) {
		if (bloomComposer) bloomComposer.render();
	}
</script>

<Group {position}>
	<Mesh geometry={sunGeom} material={sunMat} />
	<PointLight decay={2} intensity={SUN_INTENSITY} />
</Group>
