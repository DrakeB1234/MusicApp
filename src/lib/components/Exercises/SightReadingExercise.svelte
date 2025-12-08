<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { onMount } from 'svelte';
	import ExitIcon from '$lib/components/Icons/ExitIcon.svelte';
	import NoteInputButtons from '$lib/components/Inputs/NoteInputButtons.svelte';
	import {
		SightreadingExercise,
		type ExerciseParams
	} from '$lib/exerciselogic/SightReadingExercise.svelte';
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import { SingleStaffRenderer, SVGContext } from '$lib/sola-score';

	const { handleExitPressed, params }: { handleExitPressed: () => void; params: ExerciseParams } =
		$props();

	let staffContainer: HTMLDivElement;
	const game = new SightreadingExercise(params.difficulty, params.clef);

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
		midiService.init();
		const staffSvgCtx = new SVGContext(staffContainer, {
			scale: 1.6,
			backgroundColor: 'var(--color-surface)'
		});
		const staffRenderer = new SingleStaffRenderer(staffSvgCtx, {
			staffType: params.clef as any,
			width: 150,
			spacesAbove: 3,
			spacesBelow: 4
		});
		game.setRenderer(staffRenderer);
	});

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
				<p class="body-large bold">{game.score}</p>
				<p class="body-regular">Score</p>
			</div>
			<div class="information-entry">
				<p class="body-large bold">{game.correctNotesPlayedString}</p>
				<p class="body-regular">Correct</p>
			</div>
			<div class="information-entry">
				<p class="body-large bold">{game.timeLeftString}</p>
				<p class="body-regular">Time</p>
			</div>
		</div>
		<div class="game-viewport">
			<div bind:this={staffContainer} class="staff-container"></div>
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
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}
	.staff-container {
		width: fit-content;
		margin-inline: auto;
	}
	.game-inputs {
		padding-block: var(--space-4);
	}
</style>
