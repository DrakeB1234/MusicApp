<script lang="ts">
	import { page } from '$app/state';
	import icon from '$lib/assets/icon.svg';
	import ExitIcon from './Icons/ExitIcon.svelte';
	import MenuIcon from './Icons/MenuIcon.svelte';

	let currentLink = $state(page.url.pathname);
	let showMobileNav = $state(false);

	function toggleNav() {
		showMobileNav = !showMobileNav;
	}
</script>

<div class="navbar">
	<a class="reset logo" href="/"><img src={icon} alt="" /></a>
	<nav class="desktop-links">
		<a href="/" class="reset link" class:active={currentLink === '/'}>Dashboard</a>
		<a href="/exercises" class="reset link" class:active={currentLink.includes('/exercises')}
			>Exercises</a
		>
		<a href="/tools" class:active={currentLink.includes('/tools')} class="reset link">Tools</a>
		<a href="/" class="reset link">Stats</a>
	</nav>
	<button class="primary mobile-menu-button" onclick={toggleNav}>
		<MenuIcon color="var(--color-on-primary)" />
	</button>
</div>

{#if showMobileNav}
	<div class="backdrop" onclick={toggleNav} aria-hidden="true"></div>
{/if}

<div class="sidebar-container" class:show={showMobileNav}>
	<div class="mobile-header">
		<button class="primary" onclick={toggleNav}>
			<ExitIcon size={24} color="var(--color-on-primary)" />
		</button>
	</div>
	<nav class="mobile-links">
		<a href="/" class="reset link" class:active={currentLink === '/'} onclick={toggleNav}
			>Dashboard</a
		>
		<a
			href="/exercises"
			class="reset link"
			class:active={currentLink.includes('/exercises')}
			onclick={toggleNav}>Exercises</a
		>
		<a
			href="/tools"
			class:active={currentLink.includes('/tools')}
			class="reset link"
			onclick={toggleNav}>Tools</a
		>
		<a href="/" class="reset link" onclick={toggleNav}>Stats</a>
	</nav>
</div>

<style>
	.navbar {
		display: flex;
		align-items: center;
		background-color: var(--color-primary);
		color: var(--color-on-primary);
		padding-right: var(--space-2);
		z-index: 10;
	}
	a.logo {
		padding: 0 var(--space-4);
	}
	nav.desktop-links {
		display: flex;
	}
	a.link {
		height: 100%;
		padding: var(--space-4);
		transition: var(--transition-color);
		color: var(--color-on-primary);
		text-decoration: none;
	}
	a.link:hover {
		background-color: var(--color-primary-dark);
	}
	a.active {
		background-color: var(--color-primary-dark);
	}
	button.mobile-menu-button {
		display: none;
		margin-left: auto;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 11;
		display: none;
		background-color: rgba(0, 0, 0, 0.3);
	}
	.sidebar-container {
		position: fixed;
		top: 0;
		right: 0;
		width: 50dvw;
		height: 100vh;
		background-color: var(--color-primary);
		display: none;
		z-index: 12;
		overflow-y: auto;
	}
	.sidebar-container.show {
		display: block;
	}
	.mobile-header {
		display: flex;
		justify-content: flex-end;
		padding: var(--space-4);
	}
	nav.mobile-links {
		display: flex;
		flex-direction: column;
	}

	@media screen and (max-width: 700px) {
		nav.desktop-links {
			display: none;
		}
		button.mobile-menu-button {
			display: block;
		}
		.backdrop {
			display: block;
		}
	}
</style>
