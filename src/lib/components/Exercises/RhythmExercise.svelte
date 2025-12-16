<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { RhythmExercise } from '$lib/exerciselogic/RhythmExercise.svelte';
	import StartStopIcon from '../Icons/StartStopIcon.svelte';
	import { RhythmStaff } from 'vector-score';

	const { handleExitPressed, params }: { handleExitPressed: () => void; params: string } = $props();

	const game = new RhythmExercise(params);
	let isStart: boolean = $state(false);

	onMount(() => {
		sfxAudioService.init();
	});

	onDestroy(() => {
		Howler.stop();
		game.destroy();
	});

	// Toggles internal state, which renders staff container, on mount its calls setupStaff due to the staff container div
	// use:setupStaff
	function handleStart() {
		isStart = true;
	}

	function setupStaff(node: HTMLElement) {
		const newStaff = new RhythmStaff(node, {
			width: 360,
			scale: 1.4,
			barsCount: 2,
			topNumber: 4,
			spaceAbove: 3,
			spaceBelow: 4,
			staffColor: 'var(--color-font)',
			staffBackgroundColor: 'var(--color-background)'
		});

		game.setRenderer(newStaff);
		game.start();
	}
</script>

<ExerciseShell
	onExit={handleExitPressed}
	stats={[
		{ value: game.score, label: 'Score' },
		{ value: game.correct, label: 'Correct' },
		{ value: game.triesLeft, label: 'Tries' }
	]}
>
	{#snippet viewport()}
		{#if !isStart}
			<div class="start-container">
				<p class="body-large">When ready, press start!</p>
				<button class="primary icon-container custom" onclick={handleStart}>
					<StartStopIcon color="var(--color-on-primary)" />
					Start
				</button>
			</div>
		{:else}
			<div class="game-container">
				<div class="countdown-container">
					<p class="ui-large bold">{game.currentStartTime}</p>
				</div>
				<div use:setupStaff class="staff-container"></div>
			</div>
		{/if}
	{/snippet}
	{#snippet controls()}
		<div class="input">
			<button class="secondary custom" disabled={!game.isListeningInput} onclick={game.handleInput}
				>TAP HERE</button
			>
		</div>
	{/snippet}
</ExerciseShell>

<style>
	.start-container {
		display: grid;
		place-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
	}
	button.custom {
		padding: var(--space-4) var(--space-6);
		transition: none;
	}
	button.custom:active {
		background-color: var(--color-primary);
	}
	.input {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
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
