<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import banner from '$lib/assets/banner.svg';
	import appleIcon from '$lib/assets/apple-icon.svg';
	import { initTheme } from '$lib';
	import { NavBar, Footer } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();
	
	onMount(() => {
		initTheme();
	});
</script>

<svelte:head>
	<meta name="description" content="Jason Coawette is a design-obsessed software engineer building tasteful interfaces for humans and agentic AI." />
	
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={appleIcon} />
	
	<!-- OpenGraph Meta Tags -->
	<meta property="og:title" content="Jason Coawette - Design Engineer" />
	<meta property="og:description" content="Jason Coawette is a design-obsessed software engineer building tasteful interfaces for humans and agentic AI." />
	<meta property="og:image" content={banner} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://jasoncoawette.com" />
	
	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Jason Coawette - Design Engineer" />
	<meta name="twitter:description" content="Jason Coawette is a design-obsessed software engineer building tasteful interfaces for humans and agentic AI." />
	<meta name="twitter:image" content={banner} />
	
</svelte:head>

<NavBar title="Jason Coawette" subtitle="Design Engineer" link="https://jasoncoawette.com" />
<main
	class="
		flex w-full max-w-3xl flex-col items-center
		justify-start px-4
	"
>
	{@render children()}
</main>
<Footer />
