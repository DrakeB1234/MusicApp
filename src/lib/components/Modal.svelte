<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { type Snippet } from 'svelte';

	let {
		open = $bindable(false),
		headerText,
		children
	}: { open: boolean; headerText: string; children: Snippet } = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	});

	function handleClose() {
		open = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialog) {
			dialog.close();
		}
	}
</script>

<dialog bind:this={dialog} onclose={handleClose} onclick={handleBackdropClick}>
	<div class="header-container">
		<h2 class="body-large">{headerText}</h2>
		<button class="text small" onclick={() => (open = false)} aria-label="close-dialog"
			><Icon name="material-exit" /></button
		>
	</div>
	<div class="modal-content">
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		margin: var(--space-4) auto;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0;
		background: var(--color-surface);
		width: min(500px, 100%);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		padding: var(--space-4);
		overflow-y: auto;
	}

	.header-container {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		justify-content: space-between;
		padding: var(--space-2) var(--space-4);
		padding-right: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}

	@media (max-width: 600px) {
		dialog {
			max-width: 100dvw;
			width: 100%;
			border-radius: 0;
			margin: 0;
		}
	}
</style>
