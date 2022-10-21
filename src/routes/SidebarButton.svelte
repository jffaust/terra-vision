<script lang="ts">
	export let img: string;
	export let alt: string;
	export let style: string = '';
</script>

<button type="button" on:click {style}>
	<img src={img} {alt} />
</button>

<style>
	button {
		background-color: rgb(230, 214, 146);
		border: none;
		padding: 4px;
		cursor: pointer;
	}

	img {
		width: 30px;
		height: 30px;
	}
</style>
