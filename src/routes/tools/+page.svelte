<script>
	import ToolsCard from '$lib/components/Cards/ToolsCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<ToolsCard />
	</main>
</Wrapper>

<style>
	main {
		padding: var(--space-4);
	}
</style>
