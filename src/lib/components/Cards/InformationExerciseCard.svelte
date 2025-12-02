<script lang="ts">
	import type { ExerciseDataEntry } from '$lib/data/exercisesData';
	import CardIconWrapper from '../CardIconWrapper.svelte';
	import LeftBackIcon from '../Icons/LeftBackIcon.svelte';

	const { exerciseEntry }: { exerciseEntry: ExerciseDataEntry } = $props();
</script>

<div class="card">
	<a class="icon back-link" href="/exercises">
		<LeftBackIcon />
		All Exercises
	</a>
	<div class="information">
		<CardIconWrapper url={exerciseEntry.iconUrl} title={exerciseEntry.title} />
		<div class="information-text">
			<p class="body-regular">{exerciseEntry.title}</p>
			<p class="body-small">{exerciseEntry.description}</p>
		</div>
	</div>
	<p>{exerciseEntry.id}</p>
</div>

<style>
	.card {
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
</style>
