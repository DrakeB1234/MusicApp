<script lang="ts">
	import type { Snippet } from 'svelte';
	import MidiDeviceConnect from '../MidiDeviceConnect.svelte';
	import Icon from '$lib/components/Icon.svelte';

	type Stat = {
		label: string;
		value: string | number;
	};

	let {
		stats,
		viewport,
		controls,
		handleExit,
		handleStart,
		isStarted,
		isGameOver,
		showMidiDevice = false
	}: {
		stats: Stat[];
		viewport: Snippet;
		controls: Snippet;
		handleExit: () => void;
		handleStart: () => void;
		isStarted: boolean;
		isGameOver: boolean;
		showMidiDevice?: boolean;
	} = $props();
</script>

<main class="game">
	<button class="text on-background icon-container" onclick={handleExit}>
		<Icon name="material-exit" />
		Exit
	</button>
	<div class="card">
		<div class="game-information">
			{#each stats as stat (stat.label)}
				<div class="information-entry">
					<p class="body-large bold">{stat.value}</p>
					<p class="body-regular">{stat.label}</p>
				</div>
			{/each}
		</div>

		<div class="game-viewport">
			<!-- RENDER VIEWPORT, HIDE WITH CSS -->
			<div class="viewport-wrapper" class:hidden={!isStarted || isGameOver}>
				{@render viewport()}
			</div>
			{#if !isStarted}
				<div class="start-container">
					<p class="body-regular">When Ready, press Start!</p>
					<button class="primary large icon-container" onclick={handleStart}>
						<Icon name="material-start" color="var(--color-on-primary)" />
						Start
					</button>
				</div>
			{/if}
			{#if isGameOver && isStarted}
				<div class="gameover-container">
					<p class="body-large">Game Over!</p>
					<button class="primary large icon-container" onclick={handleExit}>Continue</button>
				</div>
			{/if}
		</div>

		{#if showMidiDevice}
			<div class="device-connect">
				<MidiDeviceConnect />
			</div>
		{/if}
		{@render controls()}
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
	.start-container > button {
		margin-top: var(--space-4);
		margin-inline: auto;
	}
	.game-viewport {
		display: flex;
		flex-direction: column;
		align-items: center;

		padding: var(--space-4) var(--space-2);
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}
	.gameover-container {
		text-align: center;
	}
	.gameover-container > button {
		margin-top: var(--space-4);
		margin-inline: auto;
	}
	.device-connect {
		padding: var(--space-2);
	}
	.hidden {
		display: none;
	}
</style>
