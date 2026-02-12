<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ThemeToggle, initTheme } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<svelte:head>
	<title>Jason Coawette - Design Engineer</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav
	class="
		sticky top-0
		flex h-fit
		w-full max-w-2xl flex-row
		items-center justify-between
	"
>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href="/" aria-label="home" class="h-fit w-fit">
		<h1 class="shimmer-text" data-text="Jason Coawette">Jason Coawette</h1>
	</a>

	<!-- Button Wrapper -->
	<div
		class="
			flex h-fit
			w-fit flex-row
			items-center justify-end gap-2
		"
	>
		<ThemeToggle />
		<button
			class="
				liquid-glass flex h-fit
				w-fit cursor-pointer items-center
				justify-center rounded-full p-2"
			aria-label="Email Me"
		>
			Email
		</button>
	</div>
</nav>
<main
	class="
		mt-3 flex
		h-fit w-full max-w-2xl flex-col
		items-center justify-start
	"
>
	{@render children()}
</main>
