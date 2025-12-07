<script lang="ts">
	import InformationExerciseCard from '$lib/components/Cards/InformationExerciseCard.svelte';
	import SightReadingExercise from '$lib/components/Cards/SightReadingExercise.svelte';
	import TutorialExerciseCard from '$lib/components/Cards/TutorialExerciseCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	let isStart: boolean = $state(false);
	let selectedDifficulty = $state('');

	function handleStartExercise(difficulty: string) {
		selectedDifficulty = difficulty;
		isStart = true;
	}
	function handleExitExercise() {
		isStart = false;
	}
</script>

{#if !isStart}
	<Navbar />
	<Wrapper maxWidth="var(--max-width-2)">
		<main>
			<InformationExerciseCard
				exerciseEntry={data.exerciseEntry}
				handleStartPressed={handleStartExercise}
			/>
			<TutorialExerciseCard tutorialEntries={data.exerciseEntry.tutorial} />
		</main>
	</Wrapper>
{:else}
	<Wrapper>
		<SightReadingExercise handleExitPressed={handleExitExercise} difficulty={selectedDifficulty} />
	</Wrapper>
{/if}

<style>
	main {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-2);
		align-items: start;
	}

	@media screen and (max-width: 900px) {
		main {
			flex-direction: column;
		}
	}
</style>
