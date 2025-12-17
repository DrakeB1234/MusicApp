<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PianoRoll from '$lib/components/Inputs/PianoRoll.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		pianoAudioService.init();
	});
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<div class="card">
			<div>
				<PianoRoll />
			</div>
		</div>
	</main>
</Wrapper>

<style>
	main {
		padding-block: var(--space-4);
	}
	.card {
		padding-block: var(--space-4);
	}
</style>
