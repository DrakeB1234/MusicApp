<script lang="ts">
	import type { ExerciseDataEntry } from '$lib/data/exercisesData';
	import type { Snippet } from 'svelte';
	import LeftBackIcon from '../Icons/LeftBackIcon.svelte';
	import CardIconWrapper from '../CardIconWrapper.svelte';
	import Wrapper from '../Wrapper.svelte';
	import Navbar from '../Navbar.svelte';

	const {
		exerciseEntry,
		handleStartPressed,
		inputs,
		actionButtons
	}: {
		exerciseEntry: ExerciseDataEntry;
		handleStartPressed: () => void;
		inputs: Snippet;
		actionButtons: Snippet;
	} = $props();
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		{@render infoCard()}
		{@render tutorialCard()}
	</main>
</Wrapper>

{#snippet infoCard()}
	<div class="infoCard card">
		<a class="button-text icon-container back-link" href="/exercises">
			<LeftBackIcon />
			All Exercises
		</a>
		<div class="exercise-data">
			<CardIconWrapper url={exerciseEntry.iconUrl} title={exerciseEntry.title} />
			<div class="exercise-text">
				<h1 class="body-regular">{exerciseEntry.title}</h1>
				<p class="body-small text-light">{exerciseEntry.description}</p>
			</div>
		</div>
		<div class="stats">
			<div class="stat-entry">
				<p class="body-small">Total Points</p>
				<p class="body-large bold">4301</p>
			</div>
			<div class="stat-entry">
				<p class="body-small">Attempts</p>
				<p class="body-large bold">8</p>
			</div>
		</div>
		<div class="inputs">
			{@render inputs()}
		</div>
		<div class="action-buttons">
			{@render actionButtons()}
			<button class="primary" onclick={handleStartPressed}>Start Exercise</button>
		</div>
	</div>
{/snippet}

{#snippet tutorialCard()}
	<div class="tutorialCard card">
		<h2 class="body-regular">Quick Tutorial</h2>
		<div class="tutorial-section-wrapper">
			{#each exerciseEntry.tutorial as entry, i (i)}
				<div class="tutorial-section">
					<h3 class="body-regular bold">{entry.header}</h3>
					{#each entry.text as text, i (i)}
						<p class="body-small text-light">{text}</p>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<style>
	main {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4);
		align-items: start;
	}

	.infoCard {
		flex: 1;
		width: 100%;
		padding: var(--space-4);
	}
	.back-link {
		width: fit-content;
		margin-bottom: var(--space-2);
	}
	.exercise-data {
		display: flex;
		gap: var(--space-4);
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block: var(--space-4);
	}
	.stat-entry {
		text-align: center;
		padding: var(--space-4);
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	.inputs {
		padding-bottom: var(--space-5);
	}
	.inputs :global(h2) {
		margin-bottom: var(--space-2);
	}
	.inputs :global(h2:not(:first-child)) {
		margin-top: var(--space-2);
	}
	.action-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.tutorialCard {
		flex: 1;
		width: 100%;
		max-width: 300px;
		padding: var(--space-4);
	}
	.tutorialCard > h2 {
		margin-bottom: var(--space-2);
	}
	.tutorial-section-wrapper {
		display: grid;
		gap: var(--space-4);
	}
	.tutorial-section > h3 {
		margin-bottom: var(--space-2);
	}
	.tutorial-section > p:not(:last-child) {
		margin-bottom: var(--space-2);
	}

	@media screen and (max-width: 900px) {
		main {
			flex-direction: column;
		}
		.tutorialCard {
			max-width: unset;
		}
	}
</style>
