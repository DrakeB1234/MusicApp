<script lang="ts">
	import { MAX_BPM, MIN_BPM, sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import StartStopIcon from '$lib/components/Icons/StartStopIcon.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import SliderInput from '$lib/components/SliderInput.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		sfxAudioService.init();
	});

	let bpmValue = $state(120);
	let isPlaying = $state(false);
	let currentBeat = $state(0);
	let beatCount = $state(4);
	let timerId: ReturnType<typeof setInterval>;

	function tick() {
		currentBeat = currentBeat + 1;
		if (currentBeat >= beatCount) {
			currentBeat = 0;
		}
		if (currentBeat === 0) {
			sfxAudioService.play('clickUp');
		} else {
			sfxAudioService.play('clickDown');
		}
	}

	function toggleMetronome() {
		if (bpmValue > MAX_BPM) bpmValue = MAX_BPM;
		else if (bpmValue < MIN_BPM) bpmValue = MIN_BPM;
		if (beatCount < 1) beatCount = 1;
		else if (beatCount > 9) beatCount = 9;

		currentBeat = 0;

		if (isPlaying) {
			isPlaying = false;
		} else {
			isPlaying = true;
			sfxAudioService.play('clickUp');
		}
	}

	function handleBeatChange(e: Event & { currentTarget: HTMLInputElement }) {
		const inputValue = e.currentTarget.value;
		if (!inputValue.match('^[0-9]$')) {
			beatCount = 4;
			e.currentTarget.value = beatCount.toString();
			return;
		}
		let value = Number(inputValue);

		beatCount = value;
	}

	$effect(() => {
		clearInterval(timerId);

		if (isPlaying) {
			const interval = Math.round(60000 / bpmValue);
			timerId = setInterval(tick, interval);
		}

		return () => clearInterval(timerId);
	});
</script>

<Navbar />
<Wrapper maxWidth="var(--max-width-2)">
	<main>
		<div class="card">
			<p class="ui-xlarge bold">{isPlaying ? currentBeat + 1 : 0}</p>
			<ul class="beat-container">
				{#each { length: beatCount }, i (i)}
					<li class="beat" class:active={currentBeat === i && isPlaying}></li>
				{/each}
			</ul>

			<div class="bpm-container">
				<SliderInput min={MIN_BPM} max={MAX_BPM} step={5} label="BPM" bind:value={bpmValue} />
			</div>

			<div class="action-buttons">
				<button class="primary icon-container" onclick={toggleMetronome}>
					<StartStopIcon color="var(--color-on-primary)" isStart={isPlaying} />
					{#if !isPlaying}
						Start
					{:else}
						Stop
					{/if}
				</button>
			</div>

			<div class="inputs-wrapper">
				<div class="card-secondary">
					<div class="input-container">
						<label for="beats" class="body-regular">Beats</label>
						<input
							id="beats"
							class="default"
							type="number"
							min="1"
							max="9"
							value={beatCount}
							onchange={handleBeatChange}
						/>
					</div>
				</div>
			</div>
		</div>
	</main>
</Wrapper>

<style>
	main {
		padding: var(--space-4);
	}

	.card {
		padding-block: var(--space-4);
	}

	p.ui-xlarge {
		margin-inline: auto;
		width: fit-content;
	}

	ul.beat-container {
		display: flex;
		justify-content: center;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	li.beat {
		list-style: none;
		background-color: var(--color-surface-xdark);
		width: 16px;
		height: 16px;
		border-radius: var(--radius-full);
		transition: var(--transition-color);
	}

	li.beat.active {
		background-color: var(--color-primary);
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		margin-top: var(--space-4);
	}

	.bpm-container {
		margin-top: var(--space-4);
	}

	.inputs-wrapper {
		margin-top: var(--space-4);
		padding: var(--space-4);
	}

	.card-secondary {
		padding: var(--space-4);
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-inline: auto;
		width: fit-content;
	}

	input#beats {
		text-align: center;
		width: 4ch;
	}
</style>
