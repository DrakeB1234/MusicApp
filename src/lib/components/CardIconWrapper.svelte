<script>
	const { url, title, backgroundColor = '', borderColor = '' } = $props();
</script>

<div
	class="icon-container"
	style="background-color: {backgroundColor}; {borderColor && `border:3px solid ${borderColor}`};"
>
	<img src="/{url}" alt={title} />
</div>

<style>
	.icon-container {
		display: flex;
		align-items: center;
		border-radius: var(--radius-lg);
		padding: var(--space-2);
		height: fit-content;
		max-width: 60px;
		max-height: 60px;
	}
</style>
