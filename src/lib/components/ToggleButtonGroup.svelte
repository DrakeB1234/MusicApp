<script lang="ts">
	type ButtonEntry = {
		value: any;
		text: string;
	};
	type Props = {
		buttons: ButtonEntry[];
		onChange: (value: any) => void;
	};

	const { buttons, onChange }: Props = $props();
	let activeButtonIdx = $state(0);

	function handleButtonPressed(e: string, index: number) {
		activeButtonIdx = index;
		onChange(buttons[activeButtonIdx].value);
	}
</script>

<div class="row">
	{#each buttons as entry, i (i)}
		<button
			class="text"
			class:active={activeButtonIdx === i}
			onclick={() => handleButtonPressed(entry.value, i)}
			>{entry.text}
		</button>
	{/each}
</div>

<style>
	.row {
		display: flex;
		gap: var(--space-1);
	}
</style>
