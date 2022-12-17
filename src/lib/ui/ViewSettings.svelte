<script lang="ts">
	import { gridView } from '$lib/stores';
	import { VizTypes } from '$lib/types';
	import IconButton from './IconButton.svelte';
	import type { Direction } from './gridview';
	import Modal from './Modal.svelte';
	import ChangeViewModal from './ChangeViewModal.svelte';

	export let id: string;

	let showDropdown = false;
	let showChangeViewModal = false;

	function splitView(dir: Direction) {
		$gridView.split(id, dir);
		$gridView = $gridView;
		showDropdown = false;
	}

	// we close the current view
	function closeView() {
		$gridView.remove(id);
		$gridView = $gridView;
		showDropdown = false;
	}

	function changeView() {
		showDropdown = false;
		showChangeViewModal = true;
	}
</script>

<div class="settings">
	<IconButton src="/icons/menu.svg" alt="Settings" onClick={() => (showDropdown = !showDropdown)} />
	{#if showDropdown}
		<ul>
			<li on:click={changeView}>Change view</li>
			<li on:click={() => splitView('Horizontal')}>Split right</li>
			<li on:click={() => splitView('Vertical')}>Split down</li>
			<li on:click={closeView}>Close view</li>
		</ul>
	{/if}
</div>

{#if showChangeViewModal}
	<ChangeViewModal
		viewId={id}
		close={() => {
			showChangeViewModal = false;
		}}
	/>
{/if}

<style>
	.settings {
		position: absolute;
		top: 1em;
		right: 1em;
	}

	ul {
		right: 0;
		position: absolute;
		padding-inline-start: 0;
		background-color: var(--bg-dark);
		border-radius: 5px;
		padding: 5px;
		z-index: 10;
	}

	li {
		color: white;
		white-space: nowrap;
		list-style-type: none;
		padding: 6px 10px;
		text-align: left;
		width: 100%;
		border-radius: 5px;
	}

	li:hover {
		cursor: pointer;
		background-color: var(--bg5-dark);
	}
</style>
