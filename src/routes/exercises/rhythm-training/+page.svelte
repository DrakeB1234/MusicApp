<script lang="ts">
	import ExerciseInfoLayout from '$lib/components/Exercises/ExerciseInfoLayout.svelte';
	import RhythmExercise from '$lib/components/Exercises/RhythmExercise.svelte';
	import ToggleButtonGroup from '$lib/components/ToggleButtonGroup.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { exercisesData } from '$lib/data/exercisesData';

	const exerciseEntry = exercisesData.find((e) => e.exerciseUrl === 'rhythm-training');
	let isStart: boolean = $state(false);
	let selectedDifficulty = $state('easy');

	function handleStartExercise() {
		if (!selectedDifficulty) return;
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
				bind:value={selectedDifficulty}
			/>
		{/snippet}
		{#snippet actionButtons()}{/snippet}
	</ExerciseInfoLayout>
{:else}
	<Wrapper>
		<RhythmExercise handleExitPressed={handleExitExercise} params={selectedDifficulty} />
	</Wrapper>
{/if}
