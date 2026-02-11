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
	<link rel="icon" href={favicon} />
</svelte:head>
<nav
	class="
		sticky top-0
		flex h-fit
		w-full max-w-4xl flex-row
		items-center justify-between
	"
>
	<h1>Jason Coawette</h1>

	<!-- Button Wrapper -->
	<div
		class="
			flex h-fit
			w-fit flex-row
			items-center justify-end gap-2
		"
	>
		<ThemeToggle />
	</div>
</nav>
<main
	class="
		mt-3 flex
		h-fit w-full max-w-4xl flex-col
		items-center justify-start
	"
>
	{@render children()}
</main>
