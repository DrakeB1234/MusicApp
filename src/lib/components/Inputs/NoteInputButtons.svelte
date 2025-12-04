<script lang="ts">
	import type { Note } from '$lib/helpers/notehelpers';

	const { handleNotePressed }: { handleNotePressed: (note: Note) => void } = $props();

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
			onclick={() => handleActiveAccidentalPressed(ActiveAccidental.SHARP)}>#</button
		>
		<button
			class="secondary"
			class:active={activeAccidental === ActiveAccidental.FLAT}
			onclick={() => handleActiveAccidentalPressed(ActiveAccidental.FLAT)}>b</button
		>
	</div>
	<div class="note-buttons">
		<button class="secondary" onclick={() => handleNoteNamePressed('C')}>C</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('D')}>D</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('E')}>E</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('F')}>F</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('G')}>G</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('A')}>A</button>
		<button class="secondary" onclick={() => handleNoteNamePressed('B')}>B</button>
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
	}
</style>
