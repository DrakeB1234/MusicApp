<script>
	import { midiService } from '$lib/midiservice/midiService.svelte';
	import ConnectIcon from './Icons/ConnectIcon.svelte';
</script>

<button class="text icon-container">
	<span class="connect-status" class:active={midiService.isDeviceConnected}></span>
	<ConnectIcon />
	<p class="body-regular">Devices</p>
</button>

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
</style>
