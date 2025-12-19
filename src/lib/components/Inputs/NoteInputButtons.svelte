<script lang="ts">
	import { NATURAL_NOTE_NAMES, type Note } from '$lib/helpers/notehelpers';

	let {
		handleNotePressed,
		disabled
	}: { handleNotePressed: (note: Note) => void; disabled: boolean } = $props();

	const ActiveAccidental = Object.freeze({
		SHARP: '#',
		FLAT: 'b'
	});

	let activeAccidental: string | null = $state(null);

	function handleActiveAccidentalPressed(value: string) {
		if (value === activeAccidental) activeAccidental = null;
		else activeAccidental = value;
	}

	function handleNoteNamePressed(value: string) {
		const note: Note = {
			name: value,
			octave: null,
			accidental: activeAccidental
		};
		handleNotePressed(note);
	}
</script>

<div class="input-buttons-wrapper">
	<div class="accidental-buttons">
		<button
			class="secondary"
			class:active={activeAccidental === ActiveAccidental.SHARP}
			onclick={() => handleActiveAccidentalPressed(ActiveAccidental.SHARP)}
			{disabled}>#</button
		>
		<button
			class="secondary"
			class:active={activeAccidental === ActiveAccidental.FLAT}
			onclick={() => handleActiveAccidentalPressed(ActiveAccidental.FLAT)}
			{disabled}>b</button
		>
	</div>
	<div class="note-buttons">
		{#each NATURAL_NOTE_NAMES as name}
			<button class="secondary" onclick={() => handleNoteNamePressed(name)} {disabled}
				>{name}</button
			>
		{/each}
	</div>
</div>

<style>
	.accidental-buttons {
		display: flex;
		gap: var(--space-2);
		justify-content: center;
		margin-bottom: var(--space-4);
	}
	.note-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
		transition: var(--transition-color);
	}
</style>
