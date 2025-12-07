<script lang="ts">
	import ExerciseInfoLayout from '$lib/components/Exercises/ExerciseInfoLayout.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { exercisesData } from '$lib/data/exercisesData';

	const exerciseEntry = exercisesData.find((e) => e.exerciseUrl === 'rhythm-training');
	let isStart: boolean = $state(false);
	let selectedDifficulty = $state('easy');

	function handleStartExercise() {
		if (!selectedDifficulty) return;
		console.log(selectedDifficulty);
		isStart = true;
	}
	function handleExitExercise() {
		isStart = false;
	}
</script>

{#if !isStart}
	<ExerciseInfoLayout exerciseEntry={exerciseEntry!} handleStartPressed={handleStartExercise}>
		{#snippet inputs()}{/snippet}
		{#snippet actionButtons()}{/snippet}
	</ExerciseInfoLayout>
{/if}
