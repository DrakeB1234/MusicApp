<script>
	import { toolsData } from '$lib/data/toolsData';
	import CardIconWrapper from '../CardIconWrapper.svelte';

	const { summaryVersion = false } = $props();

	const fixedToolsData = summaryVersion ? toolsData.slice(0, 3) : toolsData;
</script>

<div class="card">
	<h2 class="body-regular">Tools</h2>
	{#each fixedToolsData as data (data.id)}
		<a href="/tools/{data.url}" class="reset link-card-item">
			<CardIconWrapper iconId={data.iconId} />
			<div class="card-text">
				<h3 class="body-regular">{data.title}</h3>
			</div>
		</a>
	{/each}
	{#if summaryVersion}
		<div class="button-container">
			<a href="/tools" class="button-secondary">All Tools</a>
		</div>
	{/if}
</div>

<style>
	.card {
		flex: 1;
		padding-block: var(--space-4);
		height: fit-content;
	}
	h2 {
		padding-inline: var(--space-4);
	}
	.link-card-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-surface);
		transition: var(--transition-color);
	}
	.link-card-item:hover {
		background-color: var(--color-surface-dark);
	}
	.button-container {
		display: flex;
		justify-content: end;
		padding: var(--space-4);
		padding-bottom: 0;
	}
</style>
