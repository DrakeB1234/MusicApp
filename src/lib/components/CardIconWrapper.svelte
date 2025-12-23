<script>
	import Icon from './Icon.svelte';

	const { iconId, backgroundColor = '', onBackgroundColor = '' } = $props();
</script>

<div class="icon-container" style="background-color: {backgroundColor};">
	<Icon name={iconId} color={onBackgroundColor} size={48} />
</div>

<style>
	.icon-container {
		border-radius: var(--radius-lg);
		padding: var(--space-2);
		height: fit-content;
		width: 100%;
		max-width: calc(48px + var(--space-4));
	}
</style>
