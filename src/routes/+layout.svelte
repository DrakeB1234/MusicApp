<script lang="ts">
	import { dev } from '$app/environment';
	import { RenderScan } from 'svelte-render-scan';

	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		if (dev) {
			const eruda = (await import('eruda')).default;
			eruda.init();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if dev}
	<!-- <RenderScan /> -->
{/if}

{@render children()}
