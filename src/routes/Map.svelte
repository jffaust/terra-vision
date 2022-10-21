<script lang="ts">
	import { onMount } from 'svelte';
	import OSM from 'ol/source/OSM';
	import TileLayer from 'ol/layer/Tile';
	import { fromLonLat } from 'ol/proj';
	import { Map, MapBrowserEvent, View } from 'ol';
	import { ScaleLine, Attribution } from 'ol/control';
	import { defaults as defaultInteractions } from 'ol/interaction';
	import ImageWMS from 'ol/source/ImageWMS';
	import ImageLayer from 'ol/layer/Image';
	import { initialView } from './stores';

	let map: Map;
	const center = fromLonLat([$initialView.centerLonLat[0], $initialView.centerLonLat[1]]);
	const view = new View({ center, zoom: $initialView.zoom, rotation: $initialView.rotation });

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
	});

	function handleMapClick(e: MapBrowserEvent<any>) {}
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
