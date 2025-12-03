<script lang="ts">
	import type { TutorialSection } from '$lib/data/exercisesData';

	const { tutorialEntries }: { tutorialEntries: TutorialSection[] } = $props();
</script>

<div class="card">
	<h2 class="body-regular">Quick Tutorial</h2>
	<div class="tutorial-section-wrapper">
		{#each tutorialEntries as entry, i (i)}
			<div class="tutorial-section">
				<h3 class="body-regular bold">{entry.header}</h3>
				{#each entry.text as text, i (i)}
					<p class="body-small text-light">{text}</p>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.card {
		flex: 1;
		width: 100%;
		padding: var(--space-4);
		padding-bottom: var(--space-5);
	}
	.card > h2 {
		margin-bottom: var(--space-4);
	}
	.tutorial-section-wrapper {
		display: grid;
		gap: var(--space-4);
	}
	.tutorial-section > h3 {
		margin-bottom: var(--space-1);
	}
	.tutorial-section > p:not(:last-child) {
		margin-bottom: var(--space-2);
	}
</style>
