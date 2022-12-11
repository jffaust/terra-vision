<script lang="ts">
	let showDropdown = false;
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li>Split view</li>
			<li>Change view</li>
			<li>Close View</li>
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
		padding-inline-start: 0;
		position: absolute;
		right: 0;
		background-color: darkslategrey;
	}

	li {
		color: white;
		white-space: nowrap;
		list-style-type: none;
		padding: 6px 15px;
		float: left;
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
