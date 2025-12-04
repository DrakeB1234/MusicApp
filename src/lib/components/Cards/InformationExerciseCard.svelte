<script lang="ts">
	import type { ExerciseDataEntry } from '$lib/data/exercisesData';
	import CardIconWrapper from '../CardIconWrapper.svelte';
	import LeftBackIcon from '../Icons/LeftBackIcon.svelte';
	import SettingsIcon from '../Icons/SettingsIcon.svelte';
	import ToggleButtonGroup from '../ToggleButtonGroup.svelte';

	const {
		exerciseEntry,
		handleStartPressed
	}: { exerciseEntry: ExerciseDataEntry; handleStartPressed: (difficulty: string) => void } =
		$props();

	function handleInternalStartPressed() {
		handleStartPressed(difficulty);
	}

	let difficulty = $state('easy');
</script>

<div class="card">
	<a class="button-text icon-container back-link" href="/exercises">
		<LeftBackIcon />
		All Exercises
	</a>
	<div class="information">
		<CardIconWrapper url={exerciseEntry.iconUrl} title={exerciseEntry.title} />
		<div class="information-text">
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
	<div class="toggle-buttons">
		<h2 class="body-regular bold">Difficulty</h2>
		<ToggleButtonGroup
			buttons={[
				{ text: 'Easy', value: 'easy' },
				{ text: 'Medium', value: 'medium' },
				{ text: 'Hard', value: 'hard' }
			]}
			bind:value={difficulty}
		/>
	</div>
	<div class="action-buttons">
		<button class="secondary icon-container">
			<SettingsIcon />
			Personalize
		</button>
		<button class="primary" onclick={handleInternalStartPressed}>Start Exercise</button>
	</div>
</div>

<style>
	.card {
		flex: 2;
		width: 100%;
		padding: var(--space-4);
		padding-top: var(--space-2);
	}
	.back-link {
		width: fit-content;
		margin-bottom: var(--space-4);
	}
	.information {
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
	.toggle-buttons {
		padding-bottom: var(--space-4);
	}
	.toggle-buttons > h2 {
		margin-bottom: var(--space-1);
	}
	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		padding-block: var(--space-4);
	}
</style>
