<script lang="ts">
	import { simGPS } from '$lib/sim/sim';
	import { updateSearchParams } from '$lib/utils';
	import Modal from './Modal.svelte';

	export let close: () => void;

	$: lat = $simGPS?.lat;
	$: lon = $simGPS?.lon;

	function clear() {
		$simGPS = null;
		close();
	}

	function submit() {
		if (lat && lon && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
			$simGPS = {
				lat,
				lon
			};
			close();
		}
	}

	function useMyLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((pos) => {
				$simGPS = {
					lat: pos.coords.latitude,
					lon: pos.coords.longitude
				};

				updateSearchParams('lat', $simGPS.lat.toString(), true);
				updateSearchParams('lon', $simGPS.lon.toString(), true);
				close();
			});
		}
	}
</script>

<Modal {close} title="Set Coordinates">
	<div>
		<p>
			Set GPS coordinates or use <span class="my-location" on:click={useMyLocation}
				>your location</span
			>
		</p>
		<label>
			Latitude:
			<input type="number" bind:value={lat} min={-90} max={90} />
		</label>
		<label>
			Longitude:
			<input type="number" bind:value={lon} min={-180} max={180} />
		</label>
		<button on:click={clear}>Clear</button><button class="button primary" on:click={submit}
			>Submit</button
		>
	</div>
</Modal>

<style>
	div {
		padding: 10px;
		color: var(--font-color);
	}
	.my-location {
		color: #17c16f;
		cursor: pointer;
	}
</style>
