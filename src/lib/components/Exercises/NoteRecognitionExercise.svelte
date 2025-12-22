<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { onMount } from 'svelte';
	import NoteInputButtons from '$lib/components/Inputs/NoteInputButtons.svelte';
	import {
		NoteRecognitionExercise,
		type ExerciseParams
	} from '$lib/exerciselogic/NoteRecognitionExercise.svelte';
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { MusicStaff, type StaffTypes } from 'vector-score';

	const { handleExitPressed, params }: { handleExitPressed: () => void; params: ExerciseParams } =
		$props();

	const game = new NoteRecognitionExercise(params.difficulty, params.clef);
	let isStart: boolean = $state(false);

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
		midiService.init();
	});

	$effect(() => {
		const midiServiceUnsubscribe = midiService.subscribe(game.handleMidiInput);

		return () => {
			game.destroy();
			Howler.stop();
			midiServiceUnsubscribe();
		};
	});

	function setupStaff(node: HTMLElement) {
		const newStaff = new MusicStaff(node, {
			staffType: params.clef as StaffTypes,
			width: 200,
			scale: 1.4,
			spaceAbove: 3,
			spaceBelow: 4,
			staffColor: 'var(--color-font)',
			staffBackgroundColor: 'var(--color-background)'
		});

		game.setRenderer(newStaff);
	}

	function handleStart() {
		isStart = true;
		game.startGameLoop();
	}
</script>

<ExerciseShell
	{handleStart}
	handleExit={handleExitPressed}
	stats={[
		{ value: game.score, label: 'Score' },
		{ value: game.correctAndTotalNotes, label: 'Correct' },
		{ value: game.timeLeft, label: 'Time Left' }
	]}
	isGameOver={game.isGameOver}
	isStarted={isStart}
	showMidiDevice
>
	{#snippet viewport()}
		<div use:setupStaff class="staff-container"></div>
	{/snippet}

	{#snippet controls()}
		<div class="inputs">
			<NoteInputButtons handleNotePressed={game.handleNoteInput} disabled={!isStart} />
		</div>
	{/snippet}
</ExerciseShell>

<style>
	.staff-container {
		width: fit-content;
		margin-inline: auto;
	}
	.inputs {
		padding: var(--space-2);
		padding-bottom: var(--space-5);
	}
</style>
