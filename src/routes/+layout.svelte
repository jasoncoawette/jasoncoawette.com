<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initTheme } from '$lib';
	import { NavBar, Footer } from '$lib';
	import { BlurBlock } from '$lib/components/ui';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children } = $props();

	const isHome = $derived(page.url.pathname === '/');

	// Chain footer after home page animations (must match +page.svelte timing)
	const CD = 30, DUR = 400;
	const end = (d: number, n: number) => d + (n - 1) * CD + DUR;
	const footerDelay = end(end(end(0, 14), 166), 41) + 3 * 100 + DUR;

	onMount(() => {
		initTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar title="Jason Coawette" subtitle="Design Engineer" link="https://jasoncoawette.com"/>
<main
	class="
		flex w-full max-w-3xl flex-col items-center
		justify-start px-4
	"
>
	{@render children()}
</main>
{#if isHome}
	<BlurBlock class="flex w-full items-center justify-center" delay={footerDelay}>
		<Footer />
	</BlurBlock>
{:else}
	<Footer />
{/if}