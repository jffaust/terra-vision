<script lang="ts">
	import { gridView } from '$lib/stores';
	import type { Rect, View } from '$lib/types';
	import type { Direction } from './gridview';

	export let id: string;

	let showDropdown = false;

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
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li>Change view</li>
			<li on:click={() => splitView('Horizontal')}>Split right</li>
			<li on:click={() => splitView('Vertical')}>Split down</li>
			<li on:click={closeView}>Close view</li>
		</ul>
	{/if}
</div>

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
</style>
