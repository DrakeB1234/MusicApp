<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
</script>

<Navbar />
<Wrapper>
	<main>
		<div class="card">
			<h2 class="body-regular">Exercises</h2>
			<div class="card-item">
				<div class="icon-container"></div>
				<div class="card-text">
					<p class="body-regular">Sightreading</p>
					<p class="body-small">
						Multiple notes are played simultaneously. Can you identify the chord? Click on the right
						answer.
					</p>
				</div>
			</div>
		</div>

		<div class="card">
			<h2 class="body-regular">Tools</h2>
		</div>
	</main>
</Wrapper>

<style>
	main {
		display: flex;
		gap: var(--space-4);

		padding: var(--space-4);
	}

	.card:first-child {
		flex: 2;
	}
	.card:nth-child(2) {
		flex: 1;
	}
	.icon-container {
		margin-top: var(--space-4);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
		background-color: var(--color-primary);
	}
	.card-item {
		display: flex;
		align-items: start;
	}
	.card-text {
		padding: var(--space-4);
	}

	@media screen and (max-width: 900px) {
		main {
			flex-direction: column;
		}
	}
</style>
