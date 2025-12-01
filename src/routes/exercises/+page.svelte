<script lang="ts">
	import { pianoAudioService } from '$lib/audio/pianoAudioService.svelte';
	import { sfxAudioService } from '$lib/audio/sfxAudioService.svelte';
	import { absoluteSemitoneToNote, type Note } from '$lib/helpers/notehelpers';
	import { midi } from '$lib/midiservice/midiService.svelte';
	import { onMount } from 'svelte';

	const testNote: Note = {
		name: 'C',
		octave: 4,
		accidental: null
	};

	let activeNote: Note[] = $state([]);
	let attackType = $state();

	onMount(() => {
		midi.init();
		pianoAudioService.init();
		sfxAudioService.init();
	});

	$effect(() => {
		const unsubscribe = midi.subscribe((msg) => {
			if (msg.type === 'noteOn') {
				const notes: Note[] = [];
				msg.note.forEach((e) => notes.push(absoluteSemitoneToNote(e)));

				activeNote = notes;
				attackType = msg.attackType;

				// PLAY SOUND
				if (msg.attackType === 'chord') {
					pianoAudioService.playChord(notes);
				} else {
					pianoAudioService.playNote(notes[0]);
				}
			}
		});

		return unsubscribe;
	});
</script>

<div>
	<h1>TESTING</h1>
	<p>Notes:</p>
	{#each activeNote as note}
		<p>{note.name}{note.accidental ?? ''}/{note.octave}</p>
	{/each}
	<p>Attack Type: {attackType}</p>
	<p>Midi Error: {midi.error}</p>
	<p>Connected: {midi.isDeviceConnected}</p>
	<button onclick={() => midi.refreshDevices()}>Refresh Devices</button>
	<br />
	<br />
	<p>Audio Error: {pianoAudioService.error}</p>
	<button onclick={() => pianoAudioService.playNote(testNote)}>Play Note</button>
	{#if pianoAudioService.isMuted}
		<button onclick={pianoAudioService.unMuteSounds}>Unmute</button>
	{:else}
		<button onclick={pianoAudioService.muteSounds}>Mute</button>
	{/if}
	<br />
	<br />
	<button onclick={() => sfxAudioService.play('wrong')}>Play SFX</button>
</div>
