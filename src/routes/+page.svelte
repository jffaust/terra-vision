<script lang="ts">
	import { Textures, ViewTypes, type Rect, type View } from '$lib/types';
	import ViewContainer from '$lib/ui/ViewContainer.svelte';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import MasterControls from '$lib/ui/MasterControls.svelte';
	import { Canvas } from '@threlte/core';
	import SpaceSimScene from '$lib/ui/SpaceSimScene.svelte';
	import TestScene from '$lib/ui/TestScene.svelte';
	import TestSpin from '$lib/ui/TestSpin.svelte';

	let texturesLoaded = false;
	const tLoader = new THREE.TextureLoader();
	const textures = new Map<Textures, THREE.Texture>();

	let views: View[] = [
		{
			id: 1,
			type: ViewTypes.Test,
			region: {
				left: 0,
				top: 0,
				width: 1,
				height: 1
			}
		}
		// {
		// 	id: 2,
		// 	type: ViewTypes.Test,
		// 	region: {
		// 		left: 0.5,
		// 		top: 0,
		// 		width: 0.5,
		// 		height: 1
		// 	}
		// }
	];

	onMount(async () => {
		try {
			console.log('Page mounted');
			//https://www.eso.org/public/images/eso0932a/
			textures.set(Textures.MilkyWay, await tLoader.loadAsync('/space/milky-way-large.jpg'));
			// https://www.solarsystemscope.com/textures/ CC attribution international license
			textures.set(Textures.Sun, await tLoader.loadAsync('/space/sun.jpg'));
			// https://visibleearth.nasa.gov/images/73701/may-blue-marble-next-generation-w-topography-and-bathymetry/73710l
			const earthMap = await tLoader.loadAsync('/space/earth_blue_marble_may_small.jpg');
			earthMap.wrapS = THREE.RepeatWrapping;
			earthMap.offset.x = 0.25; // not sure why :)
			textures.set(Textures.EarthColor, earthMap);
			// earthSpecMap = await tLoader.loadAsync('/space/8k_earth_specular_map.jpg');
			// earthSpecMap.wrapS = THREE.RepeatWrapping;
			// earthSpecMap.offset.x = 0.25; // not sure why :)
			// https://www.shadedrelief.com/natural3/pages/extra.html
			// earthBumpMap = await tLoader.loadAsync('/space/earth_bump_16k.jpg');
			// earthBumpMap.wrapS = THREE.RepeatWrapping;
			// earthBumpMap.offset.x = 0.25;
			texturesLoaded = true;
			console.log('Textures loaded');
		} catch (e) {
			console.log(e);
			//todo erro
		}
	});

	function getViewPixelRegion(view: View): Rect {
		return {
			left: view.region.left * window.innerWidth,
			top: view.region.top * window.innerHeight,
			width: view.region.width * window.innerWidth,
			height: view.region.height * window.innerHeight
		};
	}

	function onResize() {
		views = views;
	}
</script>

<svelte:window on:resize={onResize} />

<div class="app">
	{#if texturesLoaded}
		{#each views as view (view.id)}
			{@const rect = getViewPixelRegion(view)}
			<ViewContainer {...rect}>
				<Canvas
					rendererParameters={{ antialias: true }}
					size={{ width: rect.width, height: rect.height }}
				>
					{#if view.type == ViewTypes.SpaceSim}
						<SpaceSimScene {textures} />
					{:else if view.type == ViewTypes.Test}
						<TestScene {textures} />
					{/if}
				</Canvas>
			</ViewContainer>
		{/each}

		<MasterControls />
	{:else}
		<p>Loading textures...</p>
	{/if}
</div>

<style>
	.app {
		width: 100vw;
		height: 100vh;
		text-align: center;
		background-color: #1d1f21;
	}

	p {
		color: snow;
		top: 50%;
		left: 50%;
		font-style: italic;
		font-size: x-large;
		position: absolute;
		transform: translate(-50%, -50%);
	}
</style>
