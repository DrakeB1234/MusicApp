<script lang="ts">
	import { page } from '$app/state';
	import icon from '$lib/assets/icon.svg';

	let currentLink = $state(page.url.pathname);
</script>

<div class="navbar">
	<div class="logo"><img src={icon} alt="" /></div>
	<nav>
		<a href="/" class="link" class:active={currentLink === '/'}>Dashboard</a>
		<a href="/exercises" class="link" class:active={currentLink.includes('/exercises')}>Exercises</a
		>
		<a href="/" class="link">Tools</a>
		<a href="/" class="link">Stats</a>
	</nav>
</div>

<style>
	.navbar {
		display: flex;
		align-items: center;
		background-color: var(--color-primary);
		color: var(--color-on-primary);
		height: 100%;
		max-height: 60px;
	}
	div.logo {
		padding: 0 var(--space-4);
	}
	nav {
		display: flex;
	}
	a.link {
		height: 100%;
		padding: var(--space-4);
		transition: var(--transition-color);
	}
	a.link:hover {
		background-color: var(--color-primary-dark);
	}
	a.active {
		background-color: var(--color-primary-dark);
	}
</style>
