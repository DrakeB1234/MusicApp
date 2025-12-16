<script lang="ts">
	import ExitIcon from '$lib/components/Icons/ExitIcon.svelte';
	import type { Snippet } from 'svelte';
	import MidiDeviceConnect from '../MidiDeviceConnect.svelte';

	type Stat = {
		label: string;
		value: string | number;
	};

	let {
		onExit,
		stats,
		viewport,
		controls,
		showMidiDevice = false
	}: {
		onExit: () => void;
		stats: Stat[];
		viewport: Snippet;
		controls?: Snippet;
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
			{@render viewport()}
		</div>

		{#if controls}
			{#if showMidiDevice}
				<div class="device-connect">
					<MidiDeviceConnect />
				</div>
			{/if}
			{@render controls()}
		{/if}
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
		padding-block: var(--space-4);
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		justify-content: center;
	}
	.device-connect {
		padding: var(--space-2);
	}
</style>
