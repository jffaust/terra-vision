<script lang="ts">
	import { simGPS } from '$lib/sim/sim';
	import { updateSearchParams, validateCoordinates } from '$lib/utils';
	import Modal from './Modal.svelte';

	export let close: () => void;

	let lat = $simGPS?.lat;
	let lon = $simGPS?.lon;
	let inputLat: HTMLInputElement;
	let inputLon: HTMLInputElement;

	function clear() {
		lat = undefined;
		lon = undefined;
	}

	function submit() {
		console.log(lat, lon);
		if (lat == undefined && lon == undefined) {
			updateSearchParams('lat', null, true);
			updateSearchParams('lon', null, true);
			$simGPS = null;
			close();
		} else if (lat != undefined && lon == undefined) {
			shakeInputEl(inputLon);
		} else if (lon != undefined && lat == undefined) {
			shakeInputEl(inputLat);
		}

		if (lat != undefined && (lat < -90 || lat > 90)) {
			shakeInputEl(inputLat);
		}
		if (lon != undefined && (lon < -180 || lon > 180)) {
			shakeInputEl(inputLon);
		}
		if (lat != undefined && lon != undefined) {
			if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
				$simGPS = {
					lat,
					lon
				};
				updateSearchParams('lat', lat.toString(), true);
				updateSearchParams('lon', lon.toString(), true);

				close();
			}
		}
	}

	function shakeInputEl(el: HTMLInputElement) {
		el.classList.add('shake');
		setTimeout(() => {
			el.classList.remove('shake');
		}, 500);
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

<Modal {close} title="Coordinates">
	<div>
		<p>
			Enter coordinates or use <span class="my-location" on:click={useMyLocation}
				>your location</span
			>
		</p>
		<div class="input-row">
			<label for="lat">Lat :</label>
			<input
				bind:this={inputLat}
				type="number"
				id="lat"
				bind:value={lat}
				step="0.000000000000001"
				min={-90}
				max={90}
			/>
			<label for="lon">Lon :</label>
			<input
				bind:this={inputLon}
				type="number"
				id="lon"
				bind:value={lon}
				step="0.000000000000001"
				min={-180}
				max={180}
			/>
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
		padding: 2px 4px 0 4px !important;
		width: 150px !important;
		border-width: 2px !important;
	}

	input[type='number']:focus,
	input[type='number']:hover {
		border-color: var(--color-lightGrey) !important;
	}

	input[type='number']:invalid {
		border: 2px solid crimson !important;
	}

	:is(.shake) {
		animation: shake 300ms !important;
	}

	@keyframes shake {
		25% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	footer {
		margin-top: 8px;
	}
</style>
