<script lang="ts">
	import PlayIcon from '../Icons/PlayIcon.svelte';
	import { exercisesData } from '$lib/data/exercisesData';
	import CardIconWrapper from '../CardIconWrapper.svelte';

	const { summaryVersion = false } = $props();

	const fixedExerciseData = summaryVersion ? exercisesData.slice(0, 3) : exercisesData;
</script>

<div class="card">
	<h2 class="body-regular">Exercises</h2>
	{#each fixedExerciseData as data (data.id)}
		<a href="/exercises/{data.exerciseUrl}" class="reset link-card-item">
			<CardIconWrapper url={data.iconUrl} title={data.title} backgroundColor={data.color} />
			<div class="card-text">
				<h3 class="body-regular">{data.title}</h3>
				<p class="body-small text-light">{data.description}</p>
			</div>
			<div class="play-container">
				<PlayIcon />
			</div>
		</a>
	{/each}
	{#if summaryVersion}
		<div class="button-container">
			<a href="/exercises" class="button-secondary">All Exercises</a>
		</div>
	{/if}
</div>

<style>
	.card {
		flex: 2;
		padding-block: var(--space-4);
		height: fit-content;
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
	.button-container {
		display: flex;
		justify-content: end;
		padding: var(--space-4);
		padding-bottom: 0;
	}
</style>
