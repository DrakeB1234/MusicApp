<script lang="ts">
	type ButtonEntry = {
		value: any;
		text: string;
	};
	type Props = {
		buttons: ButtonEntry[];
		value: string;
		onChange?: () => void;
	};

	let { buttons, value = $bindable(), onChange }: Props = $props();
</script>

<div class="toggle-buttons-container">
	{#each buttons as entry, i (i)}
		<button
			class="text"
			class:active={value === entry.value}
			onclick={() => {
				value = entry.value;
				if (onChange) onChange();
			}}
			>{entry.text}
		</button>
	{/each}
</div>

<style>
	.toggle-buttons-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}
</style>
