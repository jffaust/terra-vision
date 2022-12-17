<script lang="ts">
	import { Textures, CTX_TEXTURES, VizTypes, type Rect, type View } from '$lib/types';
	import ViewContainer from '$lib/ui/ViewContainer.svelte';
	import { onMount, setContext } from 'svelte';
	import * as THREE from 'three';
	import MainControls from '$lib/ui/MainControls.svelte';
	import Space from '$lib/viz/3d/Space.svelte';
	import { gridView } from '$lib/stores';
	import SkyView from '$lib/viz/3d/SkyView.svelte';
	import Loading from '$lib/ui/loading.svelte';
	import { simGPS } from '$lib/sim/sim';
	import { updateSearchParams } from '$lib/utils';

	let texturesLoaded = false;
	const tLoader = new THREE.TextureLoader();
	const textures = new Map<Textures, THREE.Texture>();

	setContext(CTX_TEXTURES, textures);

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

			initGPSPosition();
		} catch (e) {
			console.log(e);
			//todo error
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
		$gridView = $gridView;
	}

	function initGPSPosition() {
		const urlParams = new URLSearchParams(window.location.search);

		const latStr = urlParams.get('lat');
		const lonStr = urlParams.get('lon');

		if (latStr && lonStr) {
			try {
				$simGPS = {
					lat: parseFloat(latStr),
					lon: parseFloat(lonStr)
				};
			} catch (e) {
				$simGPS = null;
				// remove params from URL?
			}
		}
	}
</script>

<svelte:window on:resize={onResize} />

<div class="app">
	{#if texturesLoaded}
		{#each $gridView.getViews() as view (view.id)}
			{@const rect = getViewPixelRegion(view)}
			<ViewContainer {...rect} id={view.id}>
				{#if view.type == VizTypes.DefaultSpace}
					<Space width={rect.width} height={rect.height} />
				{:else if view.type == VizTypes.SkyView}
					<SkyView width={rect.width} height={rect.height} />
				{/if}
			</ViewContainer>
		{/each}

		<MainControls />
	{:else}
		<div class="loading">
			<Loading />
		</div>
	{/if}
</div>

<style>
	.app {
		width: 100vw;
		height: 100vh;
		text-align: center;
		background-color: #1d1f21;
	}

	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
