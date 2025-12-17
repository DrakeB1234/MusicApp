<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import StartStopIcon from '$lib/components/Icons/StartStopIcon.svelte';
	import SelectInput from '$lib/components/Inputs/SelectInput.svelte';
	import ToggleButtonGroup from '$lib/components/Inputs/ToggleButtonGroup.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { getScaleNotes, SCALE_INTERVALS } from '$lib/helpers/chordHelpers';
	import { NATURAL_NOTE_NAMES, noteToVectorScoreString, type Note } from '$lib/helpers/notehelpers';
	import { onDestroy, onMount } from 'svelte';
	import { MusicStaff } from 'vector-score';

	let staffInstance: MusicStaff | null = null;
	let currentScaleNoteObjs: Note[] = [];

	let currentPlayedNoteIdx: number | null = $state(null);
	let currentScaleButtonNotes: string[] = $state([]);
	let selectedKey: string = $state('C');
	let selectedScale: string = $state('Major');
	let selectedAccidental: string = $state('n');

	let selectKeyRoot: string = $derived(
		selectedKey + (selectedAccidental !== 'n' ? selectedAccidental : '')
	);

	const playScaleDelayMS = 500;
	let playScaleInterval: ReturnType<typeof setInterval> | null = $state(null);

	onMount(() => {
		pianoAudioService.init();

		// Init scale with new notes
		handleInputChange();
	});

	onDestroy(() => {
		if (playScaleInterval) {
			clearInterval(playScaleInterval);
			playScaleInterval = null;
		}
		Howler.stop();
	});

	function setupStaff(node: HTMLElement) {
		if (staffInstance) return;
		staffInstance = new MusicStaff(node, {
			staffType: 'treble',
			width: 320,
			scale: 1.4,
			spaceAbove: 2,
			spaceBelow: 1,
			staffColor: 'var(--color-font)',
			staffBackgroundColor: 'var(--color-surface)'
		});
	}

	function handleNoteButtonPressed(noteObjIndex: number) {
		if (noteObjIndex > currentScaleNoteObjs.length || noteObjIndex < 0) return;

		pianoAudioService.playNote(currentScaleNoteObjs[noteObjIndex]);
	}

	function handlePlayAllPressed() {
		if (playScaleInterval) {
			clearInterval(playScaleInterval);
			playScaleInterval = null;
			currentPlayedNoteIdx = null;
		}

		if (currentScaleNoteObjs.length < 1) return;

		playScaleInterval = setInterval(() => {
			if (currentPlayedNoteIdx === null) currentPlayedNoteIdx = 0;

			if (currentPlayedNoteIdx >= currentScaleNoteObjs.length) {
				clearInterval(playScaleInterval!);
				playScaleInterval = null;
				currentPlayedNoteIdx = null;
				return;
			}

			pianoAudioService.playNote(currentScaleNoteObjs[currentPlayedNoteIdx]);
			currentPlayedNoteIdx++;
		}, playScaleDelayMS);
	}

	function handleInputChange() {
		const scaleNotes = getScaleNotes(selectKeyRoot, selectedScale);

		if (scaleNotes) {
			currentScaleButtonNotes = scaleNotes.map((e) => e.name + (e.accidental ?? ''));
			currentScaleNoteObjs = scaleNotes;

			if (staffInstance) {
				const vectorScoreNotes = scaleNotes.map((e) => noteToVectorScoreString(e));
				staffInstance.clearAllNotes();
				staffInstance.drawNote(vectorScoreNotes);
				staffInstance.justifyNotes();
			}
		}
	}
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<div class="card">
			<div class="top-container">
				<h2 class="body-large bold">{selectKeyRoot} {selectedScale} Scale</h2>
				<button
					class="primary icon-container play-button"
					onclick={handlePlayAllPressed}
					disabled={playScaleInterval !== null}
					><StartStopIcon color="var(--color-on-primary)" /></button
				>
				<div class="button-group">
					{#each currentScaleButtonNotes as note, i}
						<button
							class="text body-small"
							onclick={() => handleNoteButtonPressed(i)}
							class:active={currentPlayedNoteIdx === i + 1}>{note}</button
						>
					{/each}
				</div>
			</div>

			<div class="staff-container">
				<div use:setupStaff></div>
			</div>

			<div class="bottom-container">
				<div class="inputs">
					<SelectInput
						label="Key"
						id="key"
						optionValues={NATURAL_NOTE_NAMES}
						bind:value={selectedKey}
						onChange={handleInputChange}
					/>
					<SelectInput
						label="Scale"
						id="scale"
						optionValues={Object.keys(SCALE_INTERVALS)}
						bind:value={selectedScale}
						onChange={handleInputChange}
					/>
				</div>
				<ToggleButtonGroup
					buttons={[
						{ text: '♮', value: 'n' },
						{ text: '#', value: '#' },
						{ text: 'b', value: 'b' }
					]}
					bind:value={selectedAccidental}
					onChange={handleInputChange}
				/>
			</div>
		</div>
	</main>
</Wrapper>

<style>
	main {
		padding: var(--space-4);
	}
	.top-container {
		padding: var(--space-5) var(--space-4);
	}
	.top-container > button.play-button {
		margin-top: var(--space-2);
		padding: var(--space-1);
	}
	.top-container > .button-group {
		margin-top: var(--space-4);
	}
	.top-container > .button-group > button {
		min-width: 5ch;
	}
	.top-container > .button-group > button.active {
		background-color: var(--color-success);
		color: var(--color-on-success);
	}

	.staff-container {
		display: flex;
		justify-content: center;
		background-color: var(--color-background);
		border-block: 1px solid var(--color-border);
	}
	.staff-container > div {
		padding-inline: var(--space-4);
		background-color: var(--color-surface);
	}

	.bottom-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-4);
	}
	.bottom-container > .inputs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
</style>
