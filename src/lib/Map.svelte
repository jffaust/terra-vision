<script lang="ts">
	import { onMount } from 'svelte';
	import OSM from 'ol/source/OSM';
	import TileLayer from 'ol/layer/Tile';
	import { fromLonLat, toLonLat } from 'ol/proj';
	import { Map, MapBrowserEvent, View } from 'ol';
	import { ScaleLine, Attribution } from 'ol/control';
	import { defaults as defaultInteractions } from 'ol/interaction';
	import ImageWMS from 'ol/source/ImageWMS';
	import ImageLayer from 'ol/layer/Image';
	import { mapsCamera } from './stores';
	import type { ObjectEvent } from 'ol/Object';

	let map: Map;
	const center = fromLonLat([$mapsCamera.center.lon, $mapsCamera.center.lat]);
	const view = new View({ center, zoom: $mapsCamera.zoom, rotation: $mapsCamera.rotation });

	onMount(() => {
		map = new Map({
			view: view,
			target: 'ol-map',
			layers: [
				new TileLayer({
					source: new OSM()
				}),
				new ImageLayer({
					source: new ImageWMS({
						url: 'https://servicescarto.mern.gouv.qc.ca/pes/services/Territoire/HYPSOMETRIE_REGIONALE_WMS/MapServer/WMSServer',
						params: { layers: 'Courbes de niveau,Points cotés' },
						crossOrigin: 'Anonymous'
					})
				})
			],
			controls: [
				new ScaleLine({
					units: 'metric'
				}),
				new Attribution()
			],
			interactions: defaultInteractions({ shiftDragZoom: false })
		});

		map.on('click', handleMapClick);
		view.on('change:center', onCenterChanged);
	});

	function handleMapClick(e: MapBrowserEvent<any>) {}

	function onCenterChanged(e: ObjectEvent) {
		const projectedCenter = view.getCenter();
		if (projectedCenter) {
			const center = toLonLat(projectedCenter);
			$mapsCamera = {
				...$mapsCamera,
				center: {
					lon: center[0],
					lat: center[1]
				}
			};
		}
	}
</script>

<!-- <svelte:window on:keyup={handleMapKeyUp} /> -->

<div id="ol-map" />

<style lang="scss" global>
	@import 'ol/ol.css';

	#ol-map {
		width: 100%;
		height: 100vh;
	}

	.ol-scale-line {
		left: unset !important;
		right: 8px !important;
		bottom: 25px !important;
	}

	// .ol-dragbox {
	// 	background-color: cornflowerblue;
	// 	opacity: 0.5;
	// }
</style>
