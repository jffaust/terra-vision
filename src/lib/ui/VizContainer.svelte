<script lang="ts">
	import { beforeUpdate } from 'svelte';

	export let left: number;
	export let top: number;
	export let width: number;
	export let height: number;

	//let style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;`;

	beforeUpdate(() => {
		console.log('ViewContainer beforeUpdate');
	});
</script>

<div style="left:{left}px; top:{top}px; width:{width}px; height:{height}px;">
	<slot />
</div>

<style>
	div {
		position: absolute;
	}
</style>
