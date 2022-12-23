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
	import DaylightHours from '$lib/viz/2d/charts/DaylightHours.svelte';
	import SunAltitudeSimChart from '$lib/viz/2d/sim/SunAltitudeSimChart.svelte';

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
</script>

<div class="app" />

<style>
	.app {
		width: 100vw;
		height: 100vh;
		background-color: #1d1f21;
	}
</style>
