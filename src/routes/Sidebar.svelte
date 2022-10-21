<script lang="ts">
	import SidebarButton from './SidebarButton.svelte';
	import { collapsed } from './stores';

	function collapseOrExpand() {
		$collapsed = !collapsed;
	}

	function changeTool() {
		if ($collapsed) $collapsed = false;
	}
</script>

<div class="sidebar" class:collapsed>
	<menu>
		<li>
			<SidebarButton img="/icons/home.svg" alt="Acceuil" on:click={() => changeTool()} />
		</li>
		<li>
			<SidebarButton img="/icons/map.svg" alt="Carte" on:click={() => changeTool()} />
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
