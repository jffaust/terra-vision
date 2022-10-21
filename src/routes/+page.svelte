<script lang="ts">
	import Map from './Map.svelte';
	import Sidebar from './Sidebar.svelte';

	enum Views {
		Map,
		Sunlight
	}

	let view = Views.Map;
</script>

<div class="app">
	<Sidebar />

	<div class="view">
		{#if view == Views.Map}
			<Map />
		{:else if view == Views.Sunlight}{/if}
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
