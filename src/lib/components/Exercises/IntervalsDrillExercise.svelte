<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { MusicStaff } from 'vector-score';
	import { IntervalsDrillExercise } from '$lib/exerciselogic/IntervalsDrillExercise.svelte';
	import ExerciseGeneralInput from '../Inputs/ExerciseGeneralInput.svelte';

	const { handleExitPressed }: { handleExitPressed: () => void } = $props();

	const game = new IntervalsDrillExercise();
	let isStart: boolean = $state(false);

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
	});

	onDestroy(() => {
		Howler.stop();
		game.destroy();
	});

	function setupStaff(node: HTMLElement) {
		const newStaff = new MusicStaff(node, {
			staffType: 'treble',
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
		{ value: game.correct, label: 'Correct' },
		{ value: game.triesLeft, label: 'Tries Left' }
	]}
	isStarted={isStart}
	isGameOver={game.isGameOver}
>
	{#snippet viewport()}
		<div use:setupStaff class="staff-container"></div>
	{/snippet}

	{#snippet controls()}
		<div class="inputs">
			<ExerciseGeneralInput
				disableInputs={!game.isListeningInput}
				handleButtonPressed={game.handleInput}
				buttonValues={game.buttonValues}
			/>
		</div>
	{/snippet}
</ExerciseShell>

<style>
	.staff-container {
		width: fit-content;
		margin-inline: auto;
	}
	.inputs {
		padding: var(--space-4) var(--space-2);
	}
</style>
