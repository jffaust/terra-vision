<script lang="ts">
	import { Textures, texturesContextKey, VizTypes, type Rect, type View } from '$lib/types';
	import ViewContainer from '$lib/ui/VizContainer.svelte';
	import { onMount, setContext } from 'svelte';
	import * as THREE from 'three';
	import MasterControls from '$lib/ui/MasterControls.svelte';
	import { Canvas } from '@threlte/core';
	import DefaultSpace from '$lib/viz/3d/DefaultSpace.svelte';
	import TestEarthSpin from '$lib/viz/3d/TestEarthSpin.svelte';
	import TestObserver from '$lib/viz/3d/TestObserver.svelte';

	let texturesLoaded = false;
	const tLoader = new THREE.TextureLoader();
	const textures = new Map<Textures, THREE.Texture>();

	setContext(texturesContextKey, textures);

	let views: View[] = [
		{
			id: 1,
			type: VizTypes.DefaultSpace,
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
			//const earthMap = await tLoader.loadAsync('/space/earth_blue_marble_may_large.jpg');
			const earthMap = await tLoader.loadAsync('/space/earth_blue_marble_may_small.jpg');
			textures.set(Textures.EarthColor, earthMap);
			const earthSpecMap = await tLoader.loadAsync('/space/8k_earth_specular_map.jpg');
			textures.set(Textures.EarthSpecular, earthSpecMap);
			// https://www.shadedrelief.com/natural3/pages/extra.html
			// earthBumpMap = await tLoader.loadAsync('/space/earth_bump_16k.jpg');
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
					{#if view.type == VizTypes.DefaultSpace}
						<DefaultSpace />
					{:else if view.type == VizTypes.TestEarthSpin}
						<TestEarthSpin />
					{:else if view.type == VizTypes.TestObserver}
						<TestObserver />
					{/if}
				</Canvas>VizTypes
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
