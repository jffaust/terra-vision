<!-- idea taken from https://codepen.io/vkjgr/pen/gbPaVx -->

<p>Loading</p>

<style>
	p {
		color: snow;
		font-style: italic;
		font-size: x-large;
	}
	p:after {
		content: ' .';
		font-weight: bold;
		font-style: italic;
		animation: dots 1s steps(5, end) infinite;
	}

	@keyframes dots {
		0%,
		20% {
			color: rgba(0, 0, 0, 0);
			text-shadow: 0.4em 0 0 rgba(0, 0, 0, 0), 0.8em 0 0 rgba(0, 0, 0, 0);
		}
		40% {
			color: var(--font-color);
			text-shadow: 0.4em 0 0 rgba(0, 0, 0, 0), 0.8em 0 0 rgba(0, 0, 0, 0);
		}
		60% {
			text-shadow: 0.4em 0 0 white, 0.8em 0 0 rgba(0, 0, 0, 0);
		}
		80%,
		100% {
			text-shadow: 0.4em 0 0 white, 0.8em 0 0 white;
		}
	}
</style>
