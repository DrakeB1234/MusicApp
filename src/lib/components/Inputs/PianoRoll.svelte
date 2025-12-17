<script lang="ts">
	import { MAX_OCTAVE, MIN_OCTAVE, pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { NATURAL_NOTE_NAMES } from '$lib/helpers/notehelpers';

	const WHITE_W = 40;
	const WHITE_H = 120;
	const BLACK_W = 24;
	const BLACK_H = 70;

	let currentOctave = $state(4);

	const BLACK_KEYS = [
		{ name: 'C#', whiteIndex: 0 },
		{ name: 'D#', whiteIndex: 1 },
		{ name: 'F#', whiteIndex: 3 },
		{ name: 'G#', whiteIndex: 4 },
		{ name: 'A#', whiteIndex: 5 }
	];

	const VIEW_WIDTH = 7 * WHITE_W;

	function handlePianoClick(e: PointerEvent) {
		const target = e.target as SVGElement;
		const note = target.dataset.note;
		const accidental = target.dataset.accidental || null;

		if (!note) return;

		pianoAudioService.playNote({
			name: note,
			octave: currentOctave,
			accidental: accidental
		});
	}

	function changeOctave(delta: number) {
		const newOctave = currentOctave + delta;
		if (newOctave >= MIN_OCTAVE && newOctave <= MAX_OCTAVE) {
			currentOctave = newOctave;
		}
	}
</script>

<div class="piano-wrapper">
	<div class="controls">
		<button
			class="secondary"
			disabled={currentOctave <= MIN_OCTAVE}
			onclick={() => changeOctave(-1)}>-</button
		>
		<p class="label">Octave {currentOctave}</p>
		<button class="secondary" disabled={currentOctave >= MAX_OCTAVE} onclick={() => changeOctave(1)}
			>+</button
		>
	</div>

	<div class="svg-container">
		<svg
			viewBox="0 0 {VIEW_WIDTH} {WHITE_H + 2}"
			class="piano-svg"
			onpointerdown={handlePianoClick}
			role="none"
		>
			<defs>
				<linearGradient id="white-grad" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="#fff" />
					<stop offset="100%" stop-color="#eee" />
				</linearGradient>
				<linearGradient id="black-grad" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stop-color="#444" />
					<stop offset="100%" stop-color="#111" />
				</linearGradient>
			</defs>

			{#each NATURAL_NOTE_NAMES as note, i}
				<rect
					data-note={note}
					x={i * WHITE_W}
					y="0"
					width={WHITE_W}
					height={WHITE_H}
					rx="4"
					ry="4"
					class="key white"
				/>
			{/each}

			{#each BLACK_KEYS as k}
				{@const x = (k.whiteIndex + 1) * WHITE_W - BLACK_W / 2}
				<rect
					data-note={k.name.charAt(0)}
					data-accidental="#"
					{x}
					y="0"
					width={BLACK_W}
					height={BLACK_H}
					rx="2"
					ry="2"
					class="key black"
				/>
			{/each}
		</svg>
	</div>
</div>

<style>
	.piano-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		-webkit-tap-highlight-color: transparent;
		padding: var(--space-1);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.label {
		font-variant-numeric: tabular-nums;
		min-width: 5rem;
		text-align: center;
	}

	.svg-container {
		width: 100%;
		max-width: 400px;
	}

	.piano-svg {
		width: 100%;
		height: auto;
		cursor: pointer;
	}

	.key {
		transition:
			transform 0.05s,
			fill 0.05s;
		pointer-events: all;
	}
	.key.white {
		fill: url(#white-grad);
		stroke: #ccc;
		stroke-width: 1px;
	}
	.key.white:active {
		fill: #ddd;
		transform: translateY(1px);
	}
	.key.black {
		fill: url(#black-grad);
		stroke: #000;
		stroke-width: 1px;
	}
	.key.black:active {
		fill: #222;
		transform: translateY(1px);
	}
</style>
