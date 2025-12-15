<script lang="ts">
	let {
		buttonValues,
		handleButtonPressed,
		incorrectValue,
		disableInputs
	}: {
		buttonValues: any[];
		handleButtonPressed: (value: any) => void;
		incorrectValue?: any | null;
		disableInputs: boolean;
	} = $props();

	$effect(() => {
		if (incorrectValue) {
			const timer = setTimeout(() => {
				incorrectValue = null;
			}, 500);
			return () => clearTimeout(timer);
		}
	});
</script>

<div class="input-buttons-wrapper">
	<div class="buttons">
		{#each buttonValues as value}
			<button
				class="secondary"
				onclick={() => handleButtonPressed(value)}
				class:incorrect={incorrectValue === value}
				disabled={disableInputs}>{value}</button
			>
		{/each}
	</div>
</div>

<style>
	.input-buttons-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
		transition: var(--transition-color);
	}
	.incorrect {
		color: var(--color-on-error);
		background-color: var(--color-error) !important;
	}
</style>
