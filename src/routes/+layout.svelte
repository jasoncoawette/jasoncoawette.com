<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initTheme, initViewport } from '$lib';
	import { NavBar } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
		initViewport();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar />
<main
	class="
		relative z-0
		flex
		min-h-screen w-full max-w-3xl px-4 flex-col
		items-center justify-start
	"
>
	{@render children()}
</main>
