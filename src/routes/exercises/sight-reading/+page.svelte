<script lang="ts">
	import ExerciseInfoLayout from '$lib/components/Exercises/ExerciseInfoLayout.svelte';
	import SightReadingExercise from '../../../lib/components/Exercises/SightReadingExercise.svelte';
	import SettingsIcon from '$lib/components/Icons/SettingsIcon.svelte';
	import ToggleButtonGroup from '$lib/components/ToggleButtonGroup.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { exercisesData } from '$lib/data/exercisesData';
	import type { ExerciseParams } from '$lib/exerciselogic/SightReadingExercise.svelte';

	const exerciseEntry = exercisesData.find((e) => e.exerciseUrl === 'sight-reading');
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
	<ExerciseInfoLayout exerciseEntry={exerciseEntry!} handleStartPressed={handleStartExercise}>
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
				<SettingsIcon />
				Personalize
			</button>
		{/snippet}
	</ExerciseInfoLayout>
{:else}
	<Wrapper>
		<SightReadingExercise handleExitPressed={handleExitExercise} params={exerciseParams} />
	</Wrapper>
{/if}
