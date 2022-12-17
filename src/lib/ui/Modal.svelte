<script lang="ts">
	import { onMount } from 'svelte';

	let dialog: HTMLDialogElement;

	onMount(() => {
		dialog && dialog.showModal();
	});

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
		background-color: var(--bg3-dark);
		transform: translate(-50%, -50%);
		left: 50%;
		top: 50%;
		padding: 0;
		border-radius: 5px;
		border: none;
	}
</style>
