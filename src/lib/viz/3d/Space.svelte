<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SpaceScene from './SpaceScene.svelte';

	export let width: number;
	export let height: number;
</script>

<!-- SpaceScene uses useThrelte so the canvas component must be inside a parent component -->
<Canvas rendererParameters={{ antialias: true }} size={{ width, height }}>
	<SpaceScene />
</Canvas>
