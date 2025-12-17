<script lang="ts">
	let {
		buttonValues,
		handleButtonPressed,
		disableInputs
	}: {
		buttonValues: any[];
		handleButtonPressed: (value: any) => void;
		disableInputs: boolean;
	} = $props();
</script>

<div class="input-buttons-wrapper">
	<div class="buttons">
		{#each buttonValues as value}
			<button class="secondary" onclick={() => handleButtonPressed(value)} disabled={disableInputs}
				>{value}</button
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
</style>
