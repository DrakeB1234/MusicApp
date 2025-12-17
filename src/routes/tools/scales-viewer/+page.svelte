<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { stringToNote, type Note } from '$lib/helpers/notehelpers';
	import { onMount } from 'svelte';
	import { MusicStaff } from 'vector-score';

	let staff: MusicStaff | null = null;

	// const testScaleNotes: string[] = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'c5'];
	const testScaleNotes: string[] = ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'];

	const playScaleDelayMS = 500;
	let playScaleInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		pianoAudioService.init();
	});

	function setupStaff(node: HTMLElement) {
		if (staff) return;
		staff = new MusicStaff(node, {
			staffType: 'treble',
			width: 280,
			scale: 1.4,
			spaceAbove: 2,
			spaceBelow: 1,
			staffColor: 'var(--color-font)',
			staffBackgroundColor: 'var(--color-surface)'
		});

		staff.drawNote(testScaleNotes);
	}

	function handleNoteButtonPressed(note: string) {
		const noteObj = stringToNote(note);
		if (!noteObj) return;

		pianoAudioService.playNote(noteObj);
	}

	function handlePlayAllPressed() {
		if (playScaleInterval) {
			clearInterval(playScaleInterval);
			playScaleInterval = null;
		}

		let noteObjs: Note[] = [];

		testScaleNotes.forEach((e) => {
			const newNote = stringToNote(e);
			if (newNote) noteObjs.push(newNote);
		});

		if (noteObjs.length > 1) {
			let currentNoteIdx = 0;
			playScaleInterval = setInterval(() => {
				if (currentNoteIdx >= noteObjs.length) {
					clearInterval(playScaleInterval!);
					playScaleInterval = null;
					return;
				}

				pianoAudioService.playNote(noteObjs[currentNoteIdx]);
				currentNoteIdx++;
			}, playScaleDelayMS);
		}
	}
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<div class="card">
			<div use:setupStaff class="staff-container"></div>
			<div class="note-wrapper">
				<div class="note-item">
					<h2 class="body-regular">Notes in Scale Cmaj</h2>
				</div>
				<div class="note-buttons-container">
					{#each testScaleNotes as note}
						<button class="text on-background bold" onclick={() => handleNoteButtonPressed(note)}
							>{note}</button
						>
					{/each}
				</div>
				<div class="note-item">
					<button class="primary" onclick={handlePlayAllPressed}>Play All</button>
				</div>
			</div>
		</div>
	</main>
</Wrapper>

<style>
	main {
		padding-block: var(--space-4);
	}
	.card {
		padding: var(--space-4) var(--space-2);
		padding-top: 0;
	}
	.staff-container {
		width: fit-content;
		margin-inline: auto;
	}
	.note-wrapper {
		display: flex;
		flex-direction: column;
		max-width: 450px;
		margin-inline: auto;
		border: 1px solid var(--color-border);
		padding-block: var(--space-4);
	}
	.note-buttons-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		background-color: var(--color-background);
		padding: var(--space-4) var(--space-2);
		border-block: 1px solid var(--color-border);
	}
	.note-item {
		display: flex;
		padding-inline: var(--space-4);
	}
	.note-item > h2 {
		margin-bottom: var(--space-4);
	}
	.note-item > button {
		margin-top: var(--space-4);
		margin-left: auto;
	}
</style>
