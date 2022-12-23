<script lang="ts">
	import IconButton from '$lib/ui/IconButton.svelte';
	import { Canvas } from '@threlte/core';
	import SpaceScene from './SpaceScene.svelte';

	export let width: number;
	export let height: number;

	let showConfig = false;
	let showEquator = false;
	let showRotationAxis = false;
	let showPrimeMeridian = false;
</script>

<!-- SpaceScene uses useThrelte so the canvas component must be inside a parent component -->
<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}>
	<SpaceScene {showEquator} {showPrimeMeridian} {showRotationAxis} />
</Canvas>

<div class="settings">
	<IconButton
		src="/icons/gear.svg"
		alt="Tools"
		onClick={() => {
			showConfig = !showConfig;
		}}
	/>
	{#if showConfig}
		<div class="config">
			<div class="checkbox-row">
				<label for="equator">Equator</label>
				<input type="checkbox" id="equator" bind:checked={showEquator} />
			</div>
			<div class="checkbox-row">
				<label for="rot-axis">Rotation Axis</label>
				<input type="checkbox" id="rot-axis" bind:checked={showRotationAxis} />
			</div>
			<div class="checkbox-row">
				<label for="meridian">Prime Meridian</label>
				<input type="checkbox" id="meridian" bind:checked={showPrimeMeridian} />
			</div>
		</div>
	{/if}
</div>

<style>
	.settings {
		position: absolute;
		top: calc(2em + 22px);
		right: 1em;
	}

	.config {
		right: 0;
		position: absolute;
		padding-inline-start: 0;
		background-color: var(--bg-color);
		border-radius: 5px;
		padding: 5px;
		z-index: 10;
		color: var(--font-color);
		white-space: nowrap;
	}

	.checkbox-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
	}

	label {
		flex-grow: 1;
		text-align: start;
	}
</style>
