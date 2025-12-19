<script lang="ts">
	import ExerciseInfoLayout from '$lib/components/Exercises/ExerciseInfoLayout.svelte';
	import IntervalsDrillExercise from '$lib/components/Exercises/IntervalsDrillExercise.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { exercisesData } from '$lib/data/exercisesData';

	const exerciseEntry = exercisesData.find((e) => e.exerciseUrl === 'intervals-drill');
	let isStart: boolean = $state(false);

	function handleStartExercise() {
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
{:else}
	<Wrapper>
		<IntervalsDrillExercise handleExitPressed={handleExitExercise} />
	</Wrapper>
{/if}
