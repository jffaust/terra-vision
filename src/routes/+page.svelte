<script lang="ts">
	import Map from './Map.svelte';
	import Sidebar from './Sidebar.svelte';
	import { AppView, appView } from './stores';
	import Sunlight from './Sunlight.svelte';
</script>

<div class="app">
	<Sidebar />

	<div class="view">
		{#if $appView == AppView.Map}
			<Map />
		{:else if $appView == AppView.Sunlight}
			<Sunlight />
		{/if}
	</div>
</div>

<style>
	.app {
		width: 100vw;
		height: 100vh;
		display: flex;
	}

	.view {
		flex-grow: 1;
	}
</style>
