<script lang="ts">
	import InformationExerciseCard from '$lib/components/Cards/InformationExerciseCard.svelte';
	import TutorialExerciseCard from '$lib/components/Cards/TutorialExerciseCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<InformationExerciseCard exerciseEntry={data.exerciseEntry} />
		<TutorialExerciseCard
			tutorialEntries={data.exerciseEntry.tutorial}
			inputs={data.exerciseEntry.availableInputs}
		/>
	</main>
</Wrapper>

<style>
	main {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4);
	}

	@media screen and (max-width: 900px) {
		main {
			flex-direction: column;
		}
	}
</style>
