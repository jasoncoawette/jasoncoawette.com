<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import appleIcon from '$lib/assets/apple-icon.png';
	import banner from '$lib/assets/banner.png';
	import { NavBar, Footer } from '$lib';

	let { children } = $props();

</script>

<svelte:head>
	<title>Jason Coawette - Software Engineer</title>
	
	<meta
		name="description"
		content="Software engineer at Boeing - Design obsessed - Subtraction first"
	/>

	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={appleIcon} />

	<!-- OpenGraph Meta Tags -->
	<meta property="og:title" content="Jason Coawette - Software Engineer" />
	<meta
		property="og:description"
		content="Software engineer at Boeing - Design obsessed - Subtraction first"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://jasoncoawette.com" />
	<meta property="og:image" content={banner} />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Jason Coawette - Software Engineer" />
	<meta
		name="twitter:description"
		content="Software engineer at Boeing - Design obsessed - Subtraction first"
	/>
	<meta name="twitter:image" content={banner} />
</svelte:head>

<NavBar title="Jason Coawette" subtitle="Software Engineer" />
<main class="flex w-full max-w-3xl flex-1 flex-col items-center justify-start px-4">
	{@render children()}
</main>
<Footer />

<!-- Bottom progressive blur -->
<div class="bottom-blur" aria-hidden="true">
	<div class="bb-bg"></div>
	<div class="bb-layer bb-1"></div>
	<div class="bb-layer bb-2"></div>
	<div class="bb-layer bb-3"></div>
	<div class="bb-layer bb-4"></div>
</div>

<style>
	.bottom-blur {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 90px;
		z-index: 10;
		pointer-events: none;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}

	.bb-bg {
		position: absolute;
		inset: 0;
		top: -16px;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(to top, var(--nav-tint) 0%, var(--nav-tint) 50%, transparent 100%);
		mask-image: linear-gradient(
			to top,
			black 0%,
			black 50%,
			rgba(0, 0, 0, 0.4) 75%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to top,
			black 0%,
			black 50%,
			rgba(0, 0, 0, 0.4) 75%,
			transparent 100%
		);
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}

	.bb-layer {
		position: absolute;
		inset: 0;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}

	.bb-1 {
		-webkit-backdrop-filter: blur(4px) saturate(1.8);
		backdrop-filter: blur(4px) saturate(1.8);
		mask: linear-gradient(to top, #000 0%, #000 30%, transparent 50%);
		-webkit-mask: linear-gradient(to top, #000 0%, #000 30%, transparent 50%);
	}

	.bb-2 {
		-webkit-backdrop-filter: blur(3px) saturate(1.4);
		backdrop-filter: blur(3px) saturate(1.4);
		mask: linear-gradient(to top, transparent 20%, #000 45%, #000 65%, transparent 85%);
		-webkit-mask: linear-gradient(to top, transparent 20%, #000 45%, #000 65%, transparent 85%);
	}

	.bb-3 {
		-webkit-backdrop-filter: blur(1px) saturate(1.1);
		backdrop-filter: blur(1px) saturate(1.1);
		mask: linear-gradient(to top, transparent 50%, #000 75%, #000 100%);
		-webkit-mask: linear-gradient(to top, transparent 50%, #000 75%, #000 100%);
	}
	.bb-4 {
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		mask: linear-gradient(to top, transparent 75%, #000 90%, #000 100%);
		-webkit-mask: linear-gradient(to top, transparent 75%, #000 90%, #000 100%);
	}
</style>
