<script>
	const { url, title } = $props();
</script>

<div class="icon-container">
	<img src="/{url}" alt={title} />
</div>

<style>
	.icon-container {
		display: flex;
		align-items: center;
		border-radius: var(--radius-lg);
		padding: var(--space-2);
		background-color: var(--color-primary-light);
		height: fit-content;
		max-width: 60px;
		max-height: 60px;
	}
</style>
