<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { onMount } from 'svelte';
	import NoteInputButtons from '$lib/components/Inputs/NoteInputButtons.svelte';
	import {
		SightreadingExercise,
		type ExerciseParams
	} from '$lib/exerciselogic/SightReadingExercise.svelte';
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseGameOver from './ExerciseGameOver.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { MusicStaff, type StaffTypes } from 'vector-score';

	const { handleExitPressed, params }: { handleExitPressed: () => void; params: ExerciseParams } =
		$props();

	const game = new SightreadingExercise(params.difficulty, params.clef);

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
</script>

<ExerciseShell
	onExit={handleExitPressed}
	stats={[
		{ value: game.score, label: 'Score' },
		{ value: game.correctAndTotalNotes, label: 'Correct' },
		{ value: game.timeLeft, label: 'Time Left' }
	]}
>
	{#snippet viewport()}
		{#if !game.isGameOver}
			<div use:setupStaff class="staff-container"></div>
		{:else}
			<ExerciseGameOver message="Times Up!" continuePressed={handleExitPressed} />
		{/if}
	{/snippet}
	{#snippet controls()}
		<NoteInputButtons handleNotePressed={game.handleNoteInput} />
	{/snippet}
</ExerciseShell>

<style>
	.staff-container {
		width: fit-content;
		margin-inline: auto;
	}
</style>
