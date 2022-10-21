<script lang="ts">
	import Map from './Map.svelte';
	import SidebarButton from './SidebarButton.svelte';
	import { appView, AppView, collapsed } from './stores';

	function collapseOrExpand() {
		$collapsed = !collapsed;
	}

	function changeView(v: AppView) {
		$appView = v;
		if ($collapsed) $collapsed = false;
	}
</script>

<div class="sidebar" class:collapsed>
	<menu>
		<li>
			<SidebarButton img="/icons/map.svg" alt="Map" on:click={() => changeView(AppView.Map)} />
		</li>
		<li>
			<SidebarButton
				img="/icons/sun.svg"
				alt="Sunlight"
				on:click={() => changeView(AppView.Sunlight)}
			/>
		</li>
		<li>
			<SidebarButton
				img="/icons/{collapsed ? 'chevrons-right' : 'chevrons-left'}.svg"
				alt="PlantBright"
				on:click={collapseOrExpand}
			/>
		</li>
	</menu>
</div>

<style>
	.sidebar {
		width: 48px;
		height: 100%;
		border-radius: 2px;
		background-color: rgb(230, 214, 146);
		display: flex;
		flex-direction: row;
	}

	menu {
		width: fit-content;
		height: 100%;
		padding: 5px;
		display: flex;
		flex-direction: column;
		background-color: rgb(230, 214, 146);
	}

	menu li {
		list-style: none;
	}

	menu li:last-of-type {
		margin-top: auto;
	}
</style>
