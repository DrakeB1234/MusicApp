<script lang="ts">
	import type { ExerciseDataEntry } from '$lib/data/exercisesData';
	import CardIconWrapper from '../CardIconWrapper.svelte';
	import LeftBackIcon from '../Icons/LeftBackIcon.svelte';
	import SettingsIcon from '../Icons/SettingsIcon.svelte';
	import ToggleButtonGroup from '../ToggleButtonGroup.svelte';

	const { exerciseEntry }: { exerciseEntry: ExerciseDataEntry } = $props();
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
			<p class="body-small">{exerciseEntry.description}</p>
		</div>
	</div>
	<div class="stats">
		<p class="body-regular">Total Points: <span class="bold">4356</span></p>
		<p class="body-regular">Times Played: <span class="bold">8</span></p>
	</div>
	<div class="toggle-buttons">
		<h2 class="body-regular bold">Difficulty</h2>
		<ToggleButtonGroup
			buttons={[
				{ text: 'Easy', value: 'easy' },
				{ text: 'Medium', value: 'medium' },
				{ text: 'Hard', value: 'hard' }
			]}
			onChange={(e) => console.log(e)}
		/>
	</div>
	<div class="toggle-buttons">
		<h2 class="body-regular bold">Input</h2>
		<ToggleButtonGroup
			buttons={exerciseEntry.availableInputs.map((input) => ({
				text: input,
				value: input
			}))}
			onChange={(e) => console.log(e)}
		/>
	</div>
	<div class="action-buttons">
		<button class="secondary icon-container">
			<SettingsIcon />
			Personalize
		</button>
		<button class="primary">Start Exercise</button>
	</div>
</div>

<style>
	.card {
		flex: 2;
		padding: var(--space-4);
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
		gap: var(--space-4);
		padding-block: var(--space-4);
	}
	.toggle-buttons {
		padding-bottom: var(--space-4);
	}
	.toggle-buttons > h2 {
		margin-bottom: var(--space-1);
	}
	.action-buttons {
		display: flex;
		gap: var(--space-3);
		padding-block: var(--space-4);
	}
</style>
