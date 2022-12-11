<script lang="ts">
	import { views } from '$lib/stores';
	import type { Rect, View } from '$lib/types';

	export let id: number;

	let showDropdown = false;

	function splitView(right: boolean) {
		const current = $views.find((v) => v.id == id);

		if (!current) return;

		let region: Rect;
		if (right) {
			region = {
				left: current.region.left + current.region.width / 2,
				top: current.region.top,
				width: current.region.width / 2,
				height: current.region.height
			};
			current.region.width = current.region.width / 2;
		} else {
			region = {
				left: current.region.left,
				top: current.region.top + current.region.height / 2,
				width: current.region.width,
				height: current.region.height / 2
			};
			current.region.height = current.region.height / 2;
		}

		let newView: View = {
			id: Math.max(...$views.map((v) => v.id)) + 1,
			type: current.type,
			region
		};
		$views.push(newView);
		$views = $views;

		showDropdown = false;
	}

	function closeView() {
		if ($views.length > 1) {
			const currentIndex = $views.findIndex((v) => v.id == id);
			if (currentIndex >= 0) {
				$views.splice(currentIndex, 1);
				$views = $views;
			}
		}
	}
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li>Switch view</li>
			<li on:click={() => splitView(true)}>Split right</li>
			<li on:click={() => splitView(false)}>Split down</li>
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
