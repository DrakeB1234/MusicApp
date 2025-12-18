<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { NATURAL_NOTE_NAMES } from '$lib/helpers/notehelpers';
	import { onMount } from 'svelte';

	const START_OCTAVE = 2;
	const END_OCTAVE = 6;

	const WHITE_W = 50;
	const WHITE_H = 220;
	const BLACK_W = 30;
	const BLACK_H = 130;

	const whiteKeys: any[] = [];
	const blackKeys: any[] = [];

	let whiteKeyCount = 0;

	for (let oct = START_OCTAVE; oct <= END_OCTAVE; oct++) {
		NATURAL_NOTE_NAMES.forEach((note) => {
			whiteKeys.push({
				note,
				octave: oct,
				x: whiteKeyCount * WHITE_W
			});

			if (['C', 'D', 'F', 'G', 'A'].includes(note)) {
				blackKeys.push({
					note: note,
					accidental: '#',
					octave: oct,
					x: (whiteKeyCount + 1) * WHITE_W - BLACK_W / 2
				});
			}

			whiteKeyCount++;
		});
	}

	const VIEW_WIDTH = whiteKeyCount * WHITE_W;
	const VIEW_HEIGHT = WHITE_H + 2;

	onMount(() => {
		const c4Key = whiteKeys.find((k) => k.note === 'C' && k.octave === 4);

		if (c4Key && topScrollRef && pianoScrollRef) {
			const centerPos = c4Key.x;

			// 3. Apply scroll immediately
			topScrollRef.scrollLeft = centerPos;
			pianoScrollRef.scrollLeft = centerPos;
		}
	});

	function handlePianoClick(e: PointerEvent) {
		const target = e.target as SVGElement;

		const note = target.dataset.note;
		const octave = target.dataset.octave;
		const accidental = target.dataset.accidental || null;

		if (!note || !octave) return;

		pianoAudioService.playNote({
			name: note,
			octave: parseInt(octave),
			accidental: accidental
		});
	}

	// --- SCROLL SYNC LOGIC ---
	let topScrollRef: HTMLDivElement | undefined = $state();
	let pianoScrollRef: HTMLDivElement | undefined = $state();

	function handleTopScroll() {
		if (topScrollRef && pianoScrollRef) {
			pianoScrollRef.scrollLeft = topScrollRef.scrollLeft;
		}
	}
</script>

<div class="piano-wrapper">
	<div class="scrollbar-octaves">
		<p class="body-regular">C{START_OCTAVE}</p>
		<p class="body-regular">C4</p>
		<p class="body-regular">C{END_OCTAVE}</p>
	</div>
	<div class="top-scrollbar" bind:this={topScrollRef} onscroll={() => handleTopScroll()}>
		<div style="width: {VIEW_WIDTH}px; height: 1px;"></div>
	</div>
	<div class="scroll-container" bind:this={pianoScrollRef}>
		<svg
			viewBox="0 0 {VIEW_WIDTH} {VIEW_HEIGHT}"
			class="piano-svg"
			style="width: {VIEW_WIDTH}px;"
			onpointerdown={handlePianoClick}
			role="none"
		>
			<defs>
				<linearGradient id="black-grad" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stop-color="#444" />
					<stop offset="100%" stop-color="#111" />
				</linearGradient>
			</defs>

			{#each whiteKeys as k}
				<rect
					data-note={k.note}
					data-octave={k.octave}
					x={k.x}
					y="0"
					width={WHITE_W}
					height={WHITE_H}
					rx="4"
					ry="4"
					class="key white"
				/>
				{#if k.note === 'C'}
					<text x={k.x + WHITE_W / 2} y={WHITE_H - 10} class="key-label">C{k.octave}</text>
				{/if}
			{/each}

			{#each blackKeys as k}
				<rect
					data-note={k.note}
					data-accidental={k.accidental}
					data-octave={k.octave}
					x={k.x}
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
		-webkit-tap-highlight-color: transparent;
	}

	.scrollbar-octaves {
		display: flex;
		justify-content: space-between;
		padding-inline: var(--space-4);
	}

	.top-scrollbar {
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		padding-block: var(--space-1);
		margin-bottom: var(--space-6);
		cursor: grab;
	}
	.top-scrollbar::-webkit-scrollbar {
		height: 2rem;
	}
	.top-scrollbar::-webkit-scrollbar-track {
		background: var(--color-surface-dark);
		height: 2rem;
	}
	.top-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--color-surface-xdark);
		border-radius: var(--radius-full);
		height: 2rem;
	}

	.scroll-container {
		width: 100%;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		user-select: none;
		-ms-overflow-style: none;
	}

	.piano-svg {
		height: auto;
		display: block;
		margin: 0 auto;
		cursor: pointer;
		max-width: unset;
		padding-inline: var(--space-4);
		background-color: var(--color-surface-dark);
	}

	.key {
		transition:
			transform 0.05s,
			fill 0.05s;
		pointer-events: all;
	}

	.key.white {
		fill: white;
		stroke: #d5d7dd;
		stroke-width: 1px;
	}
	.key.white:active {
		fill: #f3f3f5;
		transform: translateY(2px);
	}

	.key.black {
		fill: url(#black-grad);
		stroke: #000;
		stroke-width: 1px;
	}
	.key.black:active {
		fill: #222;
		transform: translateY(2px);
	}

	.key-label {
		font-size: var(--font-size-16);
		fill: #6f727a;
		text-anchor: middle;
		pointer-events: none;
		user-select: none;
	}
</style>
