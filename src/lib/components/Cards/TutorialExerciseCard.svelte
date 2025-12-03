<script lang="ts">
	import type { InputTypes, TutorialSection } from '$lib/data/exercisesData';

	const { tutorialEntries, inputs }: { tutorialEntries: TutorialSection[]; inputs: InputTypes[] } =
		$props();
</script>

<div class="card">
	<h2 class="body-regular">Quick Tutorial</h2>
	<div class="tutorial-section-wrapper">
		{#each tutorialEntries as entry, i (i)}
			<div class="tutorial-section">
				<h3 class="body-regular bold">{entry.header}</h3>
				{#each entry.text as text, i (i)}
					<p class="body-regular light-text">{text}</p>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.card {
		flex: 1;
		padding: var(--space-4);
	}
	.card > h2 {
		margin-bottom: var(--space-4);
	}
	.tutorial-section-wrapper {
		display: grid;
		gap: var(--space-4);
	}
	.tutorial-section > h3 {
		margin-bottom: var(--space-2);
	}
</style>
