<script lang="ts">
	type Props = {
		message: string;
		continuePressed: () => void;
	};

	const { message, continuePressed }: Props = $props();
</script>

<div class="game-over">
	<p class="body-large">{message}</p>
	<button class="primary" onclick={continuePressed}>Continue</button>
</div>

<style>
	.game-over {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--space-4);
	}
	button {
		margin-top: var(--space-4);
	}
</style>
