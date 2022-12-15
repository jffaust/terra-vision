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
			region,
			siblingSplitRegion: copyRegion(current.region)
		};
		current.siblingSplitRegion = copyRegion(region);

		$views.push(newView);
		$views = $views;

		showDropdown = false;
	}

	function distribute(splitted: Rect, horizontal: boolean) {
		if (horizontal) {
			// find contiguous views along the splitted direction
			// views must fit in the height / lane

			let found = false;
			do {
				if (current.region.top == siblingRegion.top + siblingRegion.height) {
					// sibling
					// current
				} else if (current.region.top + current.region.height == siblingRegion.top) {
					// current
					// sibling
				} else if (current.region.left == siblingRegion.left + siblingRegion.width) {
					// sibling current
				} else if (current.region.left + current.region.width == siblingRegion.left) {
					// current sibling
				}
			} while (found);
		}
	}

	// we close the current view
	function closeView() {
		if ($views.length > 1) {
			const currentIndex = $views.findIndex((v) => v.id == id);
			if (currentIndex >= 0) {
				const current = $views[currentIndex];
				$views.splice(currentIndex, 1);

				if (current.siblingSplitRegion) {
					const siblingRegion = current.siblingSplitRegion;
					// find all views that fit in the sibling split region so we can expand them
					const viewsToExpand = findViewsInRegion(siblingRegion);

					if (current.region.top == siblingRegion.top + siblingRegion.height) {
						// sibling
						// current

						viewsToExpand.forEach((v) => {
							v.region.height *= 2;

							if (v.siblingSplitRegion) {
								v.siblingSplitRegion.height *= 2;
							}
						});
					} else if (current.region.top + current.region.height == siblingRegion.top) {
						// current
						// sibling

						viewsToExpand.forEach((v) => {
							v.region.height *= 2;
							v.region.top -= current.region.height;

							if (v.siblingSplitRegion) {
								v.siblingSplitRegion.height *= 2;
								v.siblingSplitRegion.top -= current.region.height;
							}
						});
					} else if (current.region.left == siblingRegion.left + siblingRegion.width) {
						// sibling current

						viewsToExpand.forEach((v) => {
							v.region.width *= 2;

							if (v.siblingSplitRegion) {
								v.siblingSplitRegion.width *= 2;
							}
						});
					} else if (current.region.left + current.region.width == siblingRegion.left) {
						// current sibling

						viewsToExpand.forEach((v) => {
							v.region.width *= 2;
							v.region.left -= current.region.width;

							if (v.siblingSplitRegion) {
								v.siblingSplitRegion.width *= 2;
								v.siblingSplitRegion.left -= current.region.width;
							}
						});
					}
				}

				$views = $views;
			}
		}
	}

	function findViewsInRegion(r: Rect): View[] {
		const results: View[] = [];

		$views.forEach((v) => {
			if (
				v.region.left >= r.left &&
				v.region.top >= r.top &&
				v.region.left <= r.left + r.width &&
				v.region.top <= r.top + r.height &&
				v.region.width <= r.width &&
				v.region.height <= r.height
			) {
				results.push(v);
			}
		});

		return results;
	}
</script>

<div class="settings">
	<button type="button" on:click={() => (showDropdown = !showDropdown)}>
		<img src="/icons/gear.svg" alt="Settings" />
	</button>
	{#if showDropdown}
		<ul>
			<li>Change view</li>
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
