<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let close: () => void;

	let dialog: HTMLDialogElement;

	onMount(() => {
		if (dialog) {
			dialog.showModal();
			dialog.addEventListener('close', invokeClose);
		}
	});

	onDestroy(() => {
		dialog && dialog.removeEventListener('close', invokeClose);
	});

	function invokeClose() {
		close();
	}

	export function clickedOutside(e: MouseEvent) {
		if (dialog && e.button == 0) {
			const r = dialog.getBoundingClientRect();
			if (e.clientX > r.right || e.clientX < r.left || e.clientY < r.top || e.clientY > r.bottom) {
				return true;
			}
		}
		return false;
	}
</script>

<dialog bind:this={dialog}>
	<slot />
</dialog>

<style>
	dialog {
		position: fixed;
		background-color: var(--bg2-dark);
		transform: translate(-50%, -50%);
		left: 50%;
		top: 50%;
		padding: 0;
		border-radius: 5px;
		border: none;
	}
</style>
