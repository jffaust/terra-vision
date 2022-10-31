<script lang="ts">
	import type * as THREE from 'three';
	import type { Textures } from '$lib/types';
	import { Canvas } from '@threlte/core';
	import SpaceSimScene from './SpaceSimScene.svelte';
	import { beforeUpdate, onMount } from 'svelte';

	export let width: number;
	export let height: number;
	export let textures: Map<Textures, THREE.Texture>;

	onMount(() => {
		console.log('SpaceSimCanvas Mounted');
	});

	beforeUpdate(() => {
		console.log('SpaceSimCanvas beforeUpdate');
	});
</script>

<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}
	><SpaceSimScene {textures} /></Canvas
>

<style>
</style>
