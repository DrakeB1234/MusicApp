<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import ExerciseShell from './ExerciseShell.svelte';
	import { RhythmExercise } from '$lib/exerciselogic/RhythmExercise.svelte';
	import StartStopIcon from '../Icons/StartStopIcon.svelte';

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

	function handleStart() {
		isStart = true;
		game.start();
	}
</script>

<ExerciseShell
	onExit={handleExitPressed}
	stats={[
		{ value: game.score, label: 'Score' },
		{ value: game.correct, label: 'Correct' },
		{ value: game.triesString, label: 'Tries' }
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
					<p class="body-large bold">{game.currentStartTimeCount}</p>
				</div>
				<p class="body-large">Game</p>
				<div class="notes-container">
					{#each game.currentNoteStrings as note}
						<p class="body-regular bold">{note}</p>
					{/each}
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet controls()}
		<div class="input">
			<button class="secondary custom" disabled={!isStart} onclick={game.handleInput}
				>TAP HERE</button
			>
			<button class="secondary custom" onclick={game.reset}>reset</button>
			<button class="secondary custom" onclick={game.test}>test</button>
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
	}
	button.custom:active {
		background-color: var(--color-primary);
	}
	.input {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}
	.game-container {
		display: block;
	}
	.notes-container {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
	}
	.countdown-container {
		text-align: center;
		min-height: 1.6em;
	}
</style>
