<script>
	import ExercisesCard from '$lib/components/Cards/ExerciseCards.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<ExercisesCard />
	</main>
</Wrapper>

<style>
	main {
		padding: var(--space-4);
	}
</style>
