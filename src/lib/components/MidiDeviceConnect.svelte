<script>
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import ConnectIcon from './Icons/ConnectIcon.svelte';
	import Modal from './Modal.svelte';

	let openModal = $state(false);
</script>

<button class="text icon-container" onclick={() => (openModal = true)}>
	<span class="connect-status" class:active={midiService.isDeviceConnected}></span>
	<ConnectIcon />
	Devices
</button>

<Modal bind:open={openModal} headerText="Device Connections">
	{#if midiService.error}
		<p class="body-error">*{midiService.error}</p>
	{:else}
		<p class="body-regular">
			{!midiService.error && midiService.isDeviceConnected
				? 'Device connected!'
				: 'Device disconnected.'}
		</p>
	{/if}
	<button class="secondary" onclick={midiService.refreshDevices}>Refresh</button>
</Modal>

<style>
	span.connect-status {
		width: 8px;
		height: 8px;
		background-color: var(--color-error);
		border-radius: var(--radius-full);
		border: 1px solid var(--color-on-error);
	}
	span.active {
		background-color: var(--color-success);
		border-color: var(--color-on-success);
	}
	button {
		margin-top: var(--space-4);
	}
</style>
