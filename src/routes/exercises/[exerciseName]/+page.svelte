<script lang="ts">
	import InformationExerciseCard from '$lib/components/Cards/InformationExerciseCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Navbar />
<Wrapper>
	<main>
		<InformationExerciseCard exerciseEntry={data.exerciseEntry} />
	</main>
</Wrapper>

<style>
	main {
		padding: var(--space-4);
	}
</style>
