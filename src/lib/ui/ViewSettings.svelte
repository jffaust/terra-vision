<script lang="ts">
	let showDropdown = false;
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li>Switch view</li>
			<li>Split right</li>
			<li>Split down</li>
			<li>Close</li>
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
		background-color: #2f383e;
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
		background-color: #525c62;
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
