<script lang="ts">
	import ViewSettings from '$lib/ui/ViewSettings.svelte';

	export let id: number;
	export let left: number;
	export let top: number;
	export let width: number;
	export let height: number;
</script>

<div style="left:{left}px; top:{top}px; width:{width}px; height:{height}px;">
	<ViewSettings {id} />
	<slot />
</div>

<style>
	div {
		position: absolute;
	}
</style>
