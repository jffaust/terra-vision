<script lang="ts">
	import dateFormat from 'dateformat';

	let date = new Date();
	let displayDate = dateFormat(date, 'mmmm dS, yyyy, h:MM:ss TT');
</script>

<div>
	<span>{displayDate}</span>
</div>

<style>
	div {
		position: fixed;
		bottom: 0px;
		left: 0px;
		color: white;
		padding: 5px;
	}
</style>
