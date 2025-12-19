<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { MusicStaff } from 'vector-score';
	import { ChordGuesserExercise } from '$lib/exerciselogic/ChordGuesserExercise.svelte';
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import ExerciseGeneralInput from '../Inputs/ExerciseGeneralInput.svelte';
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';

	const { handleExitPressed, params }: { handleExitPressed: () => void; params: string } = $props();

	const game = new ChordGuesserExercise(params);
	let isStart: boolean = $state(false);

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
		midiService.init();
	});

	onDestroy(() => {
		Howler.stop();
		game.destroy();
	});

	$effect(() => {
		const midiServiceUnsubscribe = midiService.subscribe(game.handleMidiInput);

		return () => {
			midiServiceUnsubscribe();
		};
	});

	function setupStaff(node: HTMLElement) {
		const newStaff = new MusicStaff(node, {
			staffType: 'treble',
			width: 150,
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
		{ value: game.correct, label: 'Correct' },
		{ value: game.triesLeft, label: 'Tries' }
	]}
	isStarted={isStart}
	isGameOver={game.isGameOver}
	showMidiDevice
>
	{#snippet viewport()}
		<div class="game-container">
			<div class="countdown-container">
				<p class="ui-large bold">{game.timeLeft}</p>
			</div>
			<div use:setupStaff class="staff-container"></div>
		</div>
	{/snippet}
	{#snippet controls()}
		<div class="input">
			<ExerciseGeneralInput
				buttonValues={game.buttonChordStrings}
				handleButtonPressed={game.handleInput}
				disableInputs={!game.isListeningInput}
			/>
		</div>
	{/snippet}
</ExerciseShell>

<style>
	.input {
		padding: var(--space-2);
		padding-bottom: var(--space-5);
	}
	.game-container {
		display: block;
	}
	.staff-container {
		margin-inline: auto;
		padding: 1rem;
	}
	.countdown-container {
		text-align: center;
		min-height: 1.6em;
	}
</style>
