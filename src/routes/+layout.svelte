<script lang="ts">
	import './layout.css';
	import favicon32 from '$lib/assets/favicon-32.png';
	import favicon96 from '$lib/assets/favicon-96.png';
	import appleIcon from '$lib/assets/apple-icon.png';
	import banner from '$lib/assets/banner.png';
	import { NavBar, Footer } from '$lib';

	let { children } = $props();
</script>

<svelte:head>
	<title>Jason Coawette - Forward Deployed Engineer</title>

	<meta
		name="description"
		content="Forward Deployed Engineer - Stratus Ventures and Postbox - previously Boeing"
	/>

	<link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
	<link rel="icon" type="image/png" sizes="96x96" href={favicon96} />
	<link rel="apple-touch-icon" href={appleIcon} />

	<!-- OpenGraph Meta Tags -->
	<meta property="og:title" content="Jason Coawette - Forward Deployed Engineer" />
	<meta
		property="og:description"
		content="Forward Deployed Engineer - Stratus Ventures and Postbox - previously Boeing"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://jasoncoawette.com" />
	<meta property="og:image" content={banner} />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Jason Coawette - Forward Deployed Engineer" />
	<meta
		name="twitter:description"
		content="Forward Deployed Engineer - Stratus Ventures and Postbox - previously Boeing"
	/>
	<meta name="twitter:image" content={banner} />
</svelte:head>

<NavBar title="Jason Coawette" subtitle="I design and build software" />
<main class="flex w-full max-w-3xl flex-1 flex-col items-center justify-start px-4">
	{@render children()}
</main>
<Footer />
