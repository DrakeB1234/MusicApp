<script>
	import ExercisesCard from '$lib/components/Cards/ExerciseCards.svelte';
	import ToolsCard from '$lib/components/Cards/ToolsCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
</script>

<Navbar />
<Wrapper>
	<main>
		<ExercisesCard summaryVersion />
		<ToolsCard />
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
