<script lang="ts">
	import Modal from './Modal.svelte';

	export let close: () => void;
</script>

<Modal {close}>
	<div>
		<p>Set GPS coordinates or use <span class="my-location">your location</span></p>
		<button>Clear</button><button>Ok</button>
	</div>
</Modal>

<style>
	div {
		padding: 10px;
	}
	.my-location {
		color: skyblue;
	}
</style>
