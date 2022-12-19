<script lang="ts">
	import Modal from './Modal.svelte';
	import { gridView } from '$lib/stores';
	import { VizTypes } from '$lib/types';

	export let viewId: string;
	export let close: () => void;

	function changeViewTo(type: VizTypes) {
		$gridView.changeView(viewId, type);
		$gridView = $gridView;

		close();
	}
</script>

<Modal {close} title="View Picker">
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
</Modal>

<style>
	.view-picker {
		border-radius: 5px;
		padding: 5px !important;
		background-color: var(--bg2-dark);
		padding-inline-start: 0px;
		list-style: none;
	}

	h4 {
		margin-bottom: 7px;
	}

	.view-picker > li {
		padding: 10px;
		cursor: pointer;
	}
	.view-picker > li:hover {
		background-color: var(--bg5-dark);
	}

	li {
		color: var(--font-color);
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
