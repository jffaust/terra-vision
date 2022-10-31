<script lang="ts">
	import type * as THREE from 'three';
	import type { Textures } from '$lib/constants';
	import { Canvas } from '@threlte/core';
	import SpaceSimScene from './SpaceSimScene.svelte';

	export let textures: Map<Textures, THREE.Texture>;
</script>

<div id="view">
	<Canvas rendererParameters={{ antialias: true }}><SpaceSimScene {textures} /></Canvas>
</div>

<style>
	#view {
		width: 100%;
		height: 100vh;
	}
</style>
