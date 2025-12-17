<script lang="ts">
	type Props = {
		label: string;
		id: string;
		optionValues: string[];
		value?: string;
		onChange?: () => void;
	};
	let { label, id, optionValues, value = $bindable(), onChange }: Props = $props();
</script>

<div class="select-container">
	<label for={id} class="body-regular">{label}</label>
	<select {id} bind:value onchange={onChange}>
		{#each optionValues as option}
			<option>{option}</option>
		{/each}
	</select>
</div>

<style>
	.select-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		width: fit-content;
	}
</style>
