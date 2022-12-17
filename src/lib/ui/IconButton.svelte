<script lang="ts">
	export let src: string;
	export let alt: string;
	export let title = '';
	export let onClick = () => {};
</script>

<button type="button" on:click={onClick}>
	<img {src} {alt} {title} />
</button>

<style>
	button {
		background-color: transparent;
		border: none;
		padding: 4px;
		cursor: pointer;
		outline: none !important;
	}
	img {
		width: 20px;
		height: 20px;
	}
</style>
