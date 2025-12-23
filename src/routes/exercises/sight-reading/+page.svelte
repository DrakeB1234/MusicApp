<script lang="ts">
	import ExerciseInfoLayout from '$lib/components/Exercises/ExerciseInfoLayout.svelte';
	import ToggleButtonGroup from '$lib/components/Inputs/ToggleButtonGroup.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { exercisesData } from '$lib/data/exercisesData';
	import type { ExerciseParams } from '$lib/exerciselogic/NoteRecognitionExercise.svelte';
	import SightReadingExercise from '$lib/components/Exercises/SightReadingExercise.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const exerciseEntry = exercisesData.find((e) => e.exerciseUrl === 'sight-reading');
	if (!exerciseEntry) throw new Error('No exercise found.');
	let isStart: boolean = $state(false);
	let exerciseParams: ExerciseParams = $state({
		difficulty: 'easy',
		clef: 'treble'
	});

	function handleStartExercise() {
		if (!exerciseParams.difficulty) return;
		isStart = true;
	}
	function handleExitExercise() {
		isStart = false;
	}
</script>

{#if !isStart}
	<ExerciseInfoLayout {exerciseEntry} handleStartPressed={handleStartExercise}>
		{#snippet inputs()}
			<h2 class="body-regular bold">Difficulty</h2>
			<ToggleButtonGroup
				buttons={[
					{ text: 'Easy', value: 'easy' },
					{ text: 'Medium', value: 'medium' },
					{ text: 'Hard', value: 'hard' }
				]}
				bind:value={exerciseParams.difficulty}
			/>
			<h2 class="body-regular bold">Clef</h2>
			<ToggleButtonGroup
				buttons={[
					{ text: 'Treble', value: 'treble' },
					{ text: 'Bass', value: 'bass' },
					{ text: 'Grand', value: 'grand' }
				]}
				bind:value={exerciseParams.clef}
			/>
		{/snippet}
		{#snippet actionButtons()}
			<button class="secondary icon-container">
				<Icon name="material-settings" />
				Personalize
			</button>
		{/snippet}
	</ExerciseInfoLayout>
{:else}
	<Wrapper>
		<SightReadingExercise handleExitPressed={handleExitExercise} params={exerciseParams} />
	</Wrapper>
{/if}
