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

<Modal {close} title="GPS Coordinates">
	<div>
		<p>
			Enter coordinates or use <span class="my-location" on:click={useMyLocation}
				>your location</span
			>
		</p>
		<div class="input-row">
			<label for="lat">Lat :</label>
			<input type="number" id="lat" bind:value={lat} />
			<label for="lon">Lon :</label>
			<input type="number" id="lon" bind:value={lon} />
		</div>

		<footer class="is-right">
			<button class="button" on:click={clear}>Clear</button><button
				class="button primary"
				on:click={submit}>Submit</button
			>
		</footer>
	</div>
</Modal>

<style>
	div {
		color: var(--font-color);
	}

	.my-location {
		color: #17c16f;
		cursor: pointer;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 10px 0;
	}

	label {
		font-weight: bold;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		padding: 2px 4px 0 4px;
		width: 90px !important;
	}

	footer {
		margin-top: 8px;
	}
</style>
