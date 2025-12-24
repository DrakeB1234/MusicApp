<script lang="ts">
	import { dev } from '$app/environment';
	import { RenderScan } from 'svelte-render-scan';

	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	// onMount(async () => {
	// 	if (dev) {
	// 		const eruda = (await import('eruda')).default;
	// 		eruda.init();
	// 	}
	// });

	import { preferences } from '$lib/stores';

	// Light/dark mode selector
	$effect(() => {
		const theme = preferences.value.theme;

		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
			document.documentElement.style.colorScheme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.style.colorScheme = 'light';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if dev}
	<RenderScan />
{/if}

{@render children()}
