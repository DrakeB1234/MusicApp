<script>
	import PlayIcon from '../Icons/PlayIcon.svelte';
	import { exercisesData } from '$lib/data/exercisesData';
	import CardIconWrapper from '../CardIconWrapper.svelte';

	const { summaryVersion = false } = $props();
</script>

<div class="card no-padding">
	<h2 class="body-regular">Exercises</h2>
	{#each exercisesData as data (data.id)}
		<a href="/exercises/{data.title}" class="reset link-card-item">
			<CardIconWrapper url={data.iconUrl} title={data.title} />
			<div class="card-text">
				<h3 class="body-regular">{data.title}</h3>
				<p class="body-small">{data.description}</p>
			</div>
			<div class="play-container">
				<PlayIcon />
			</div>
		</a>
	{/each}
	{#if summaryVersion}
		<a href="/exercises" class="button-secondary">All Exercises</a>
	{/if}
</div>

<style>
	.card {
		flex: 2;
		display: flex;
		flex-direction: column;
		padding-block: var(--space-4);
	}
	h2 {
		padding-inline: var(--space-4);
	}
	.link-card-item {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-surface);
		transition: var(--transition-color);
	}
	.link-card-item:hover {
		background-color: var(--color-surface-dark);
	}
	.card-text {
		flex: 1;
	}
	.play-container {
		margin-block: auto;
	}
	a.button-secondary {
		margin-left: auto;
		margin-right: var(--space-4);
		margin-top: var(--space-4);
	}
</style>
