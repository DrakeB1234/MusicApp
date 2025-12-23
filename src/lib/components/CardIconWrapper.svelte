<script>
	const { url, title, backgroundColor = '', borderColor = '' } = $props();
</script>

<div
	class="icon-container"
	style="background-color: {backgroundColor}; {borderColor && `border:3px solid ${borderColor}`};"
>
	<img src="/{url}" alt={title} />
	<span class=""></span>
</div>

<style>
	.icon-container {
		border-radius: var(--radius-lg);
		padding: var(--space-2);
		height: fit-content;
		max-height: 60px;
		max-width: 60px;
		width: 100%;
		height: auto;
	}
	img {
		margin-inline: auto;
	}
</style>
