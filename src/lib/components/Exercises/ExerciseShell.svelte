<script lang="ts">
	import ExitIcon from '$lib/components/Icons/ExitIcon.svelte';
	import type { Snippet } from 'svelte';
	import MidiDeviceConnect from '../MidiDeviceConnect.svelte';
	import StartStopIcon from '../Icons/StartStopIcon.svelte';

	type Stat = {
		label: string;
		value: string | number;
	};

	let {
		onExit,
		stats,
		viewport,
		controls,
		isStart: isStarted,
		handleStart,
		showMidiDevice = false
	}: {
		onExit: () => void;
		stats: Stat[];
		viewport: Snippet;
		controls: Snippet;
		handleStart: () => void;
		isStart: boolean;
		showMidiDevice?: boolean;
	} = $props();
</script>

<main class="game">
	<button class="text on-background icon-container" onclick={onExit}>
		<ExitIcon />
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
			<div class="viewport-wrapper" class:hidden={!isStarted}>
				{@render viewport()}
			</div>
			{#if !isStarted}
				<div class="start-container">
					<p class="body-large">When Ready, press Start!</p>
					<button class="primary large icon-container" onclick={handleStart}>
						<StartStopIcon color="var(--color-on-primary)" />
						Start
					</button>
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
	.device-connect {
		padding: var(--space-2);
	}
	.hidden {
		display: none;
	}
</style>
