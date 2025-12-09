<script>
	import { toolsData } from '$lib/data/toolsData';
	import CardIconWrapper from '../CardIconWrapper.svelte';

	const { summaryVersion = false } = $props();
</script>

<div class="card">
	<h2 class="body-regular">Tools</h2>
	{#each toolsData as data (data.id)}
		<a href="/tools/{data.url}" class="reset link-card-item">
			<CardIconWrapper url={data.iconUrl} title={data.title} />
			<div class="card-text">
				<h3 class="body-regular">{data.title}</h3>
			</div>
		</a>
	{/each}
	{#if summaryVersion}
		<a href="/tools" class="button-secondary">All Tools</a>
	{/if}
</div>

<style>
	.card {
		flex: 1;
		display: flex;
		flex-direction: column;
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
	a.button-secondary {
		margin-left: auto;
		margin-right: var(--space-4);
		margin-top: var(--space-4);
	}
</style>
