<script lang="ts">
	import { gridView } from '$lib/stores';
	import { VizTypes, type Rect, type View } from '$lib/types';
	import type { Direction } from './gridview';

	export let id: string;

	let showDropdown = false;
	let changeViewModal: HTMLDialogElement;

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
		changeViewModal.show();
	}

	function changeViewTo(type: VizTypes) {
		$gridView.changeView(id, type);
		$gridView = $gridView;
		changeViewModal.close();
	}
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li on:click={changeView}>Change view</li>
			<li on:click={() => splitView('Horizontal')}>Split right</li>
			<li on:click={() => splitView('Vertical')}>Split down</li>
			<li on:click={closeView}>Close view</li>
		</ul>
	{/if}
</div>

<dialog bind:this={changeViewModal}>
	<menu class="view-picker">
		<li on:click={() => changeViewTo(VizTypes.DefaultSpace)}>
			<h4>Space</h4>
			<p>View the Earth in space</p>
		</li>
		<li on:click={() => changeViewTo(VizTypes.SkyView)}>
			<h4>Sky</h4>
			<p>View the sky from a specific coordinate on Earth</p>
		</li>
	</menu>
</dialog>

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

	/* same as MasterControls buttons */
	button {
		background-color: transparent;
		border: none;
		padding: 4px;
		cursor: pointer;
	}
	img {
		width: 22px;
		height: 22px;
	}

	.hide {
		display: none;
	}

	dialog {
		position: fixed;
		transform: translate(-50%, -50%);
		left: 50%;
		top: 50%;
		padding: 0;
		border: none;
		background: none;
	}

	.view-picker {
		border-radius: 5px;
		border: 5px solid var(--bg-dark);
		background-color: var(--bg-dark);
		padding-inline-start: 0px;
		list-style: none;
	}
	.view-picker > li {
		padding: 10px;
		cursor: pointer;
	}
	.view-picker > li:hover {
		background-color: var(--bg5-dark);
	}
</style>
