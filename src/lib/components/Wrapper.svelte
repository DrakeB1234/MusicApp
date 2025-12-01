<script lang="ts">
	let { maxWidth = 'var(--max-width-1)', children } = $props();
</script>

<div class="wrapper" style="max-width: {maxWidth};">
	{@render children()}
</div>

<style>
	div {
		margin-inline: auto;
	}
</style>
