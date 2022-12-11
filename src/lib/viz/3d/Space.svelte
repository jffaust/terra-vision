<script lang="ts">
	import ViewSettings from '$lib/ui/ViewSettings.svelte';
	import { Canvas } from '@threlte/core';
	import SpaceScene from './SpaceScene.svelte';

	export let width: number;
	export let height: number;
</script>

<ViewSettings />

<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}>
	<SpaceScene />
</Canvas>
