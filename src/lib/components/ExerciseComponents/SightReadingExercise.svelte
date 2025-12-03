<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { onMount } from 'svelte';
	import ExitIcon from '../Icons/ExitIcon.svelte';
	import NoteInputButtons from '../Inputs/NoteInputButtons.svelte';
	import { SightreadingExercise } from '$lib/exerciselogic/SightReadingExercise.svelte';
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';

	const { handleExitPressed, difficulty }: { handleExitPressed: () => void; difficulty: any } =
		$props();

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
		midiService.init();
	});

	const game = new SightreadingExercise(60, difficulty);

	$effect(() => {
		const midiServiceUnsubscribe = midiService.subscribe(game.handleMidiInput);

		return () => {
			game.destroy();
			Howler.stop();
			midiServiceUnsubscribe();
		};
	});
</script>

<main class="game">
	<button class="text on-background icon-container" onclick={handleExitPressed}>
		<ExitIcon />
		Exit
	</button>
	<div class="card">
		<div class="game-information">
			<div class="information-entry">
				<p class="body-large bold">430</p>
				<p class="body-regular">Score</p>
			</div>
			<div class="information-entry">
				<p class="body-large bold">{game.correctNotesPlayedString}</p>
				<p class="body-regular">Correct</p>
			</div>
			<div class="information-entry">
				<p class="body-large bold timer">{game.timeLeftString}</p>
				<p class="body-regular">Time</p>
			</div>
		</div>
		<div class="game-viewport">
			<p>Current Note: {game.currentNoteString}</p>
			<p>Played Note: {game.playedNote}</p>
		</div>
		<div class="game-inputs">
			<NoteInputButtons handleNotePressed={game.handleNoteInput} />
		</div>
	</div>
</main>

<style>
	.game-information {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}
	.information-entry:nth-child(2) {
		text-align: center;
	}
	.information-entry:last-child {
		text-align: end;
	}
	.game-viewport {
		min-height: 20em;
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}
	.game-inputs {
		padding-block: var(--space-4);
	}
</style>
