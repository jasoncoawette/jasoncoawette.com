<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initTheme } from '$lib';
	import { NavBar } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar title="Jason Coawette" subtitle="Design Engineer" variant="cms" />
<main
	class="
		flex
		min-h-screen w-full max-w-3xl flex-col items-center
		justify-start px-4
	"
>
	{@render children()}
</main>
