<script lang="ts">
	import { ThemeToggle, ChevronLeft, flyBlur } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';

	let { title, subtitle, link = 'https://jasoncoawette.com', variant = 'default' }: {
		title: string;
		subtitle?: string;
		link?: string;
		variant?: 'default' | 'cms';
	} = $props();

	const mobile = new MediaQuery('max-width: 640px', false);
	let threshold = $derived(mobile.current ? 88 : 128);
	let scrolled = $derived((scrollY.current ?? 0) > threshold);
</script>

<!-- Sticky nav with progressive blur -->
<nav class="sticky z-20 top-0 flex w-full items-center justify-center lg:mt-16">
	
	<div class="absolute inset-0 z-20 pointer-events-none">
		<div class="blur-layer bl-1"></div>
		<div class="blur-layer bl-2"></div>
		<div class="blur-layer bl-3"></div>
		<div class="blur-layer bl-4"></div>
		<div class="blur-layer bl-5"></div>
		<div class="blur-layer bl-6"></div>
	</div>

	<div class="nav-bg"></div>

	<div class="sticky top-0 z-30 w-full h-fit max-w-3xl pt-6 px-4 pb-6 lg:pb-4">
		<div class="flex items-center gap-4 h-fit relative pointer-events-auto">
			{#if variant === 'cms'}
				<a href="https://jasoncoawette.com" class="glass btn-icon" aria-label="Back to home">
					<ChevronLeft />
				</a>
			{/if}

			{#if scrolled}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={link} class="relative flex flex-col items-start">
					<h1 class="text-lg! whitespace-nowrap"
							transition:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 50 }}>{title}</h1>
					<p class="whitespace-nowrap leading-tight!"
						 transition:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 200 }}>{subtitle}</p>
				</a>
			{/if}
			
			<div class="flex items-center justify-end gap-2 w-full">
				<ThemeToggle />
				<button class="glass btn-text"> Email </button>
			</div>
		</div>
	</div>
</nav>

<style>
	/* ---- Progressive blur layers (mask gradients not expressible in Tailwind) ---- */
	.blur-layer {
		position: absolute;
		inset: 0;
	}

	.bl-1 {
		-webkit-backdrop-filter: blur(4px) saturate(1.8);
		backdrop-filter: blur(4px) saturate(1.8);
		mask: linear-gradient(to bottom, #000 0%, #000 20%, transparent 35%);
		-webkit-mask: linear-gradient(to bottom, #000 0%, #000 20%, transparent 35%);
	}

	.bl-2 {
		-webkit-backdrop-filter: blur(4px) saturate(1.6);
		backdrop-filter: blur(4px) saturate(1.6);
		mask: linear-gradient(to bottom, transparent 10%, #000 25%, #000 40%, transparent 55%);
		-webkit-mask: linear-gradient(to bottom, transparent 10%, #000 25%, #000 40%, transparent 55%);
	}

	.bl-3 {
		-webkit-backdrop-filter: blur(4px) saturate(1.4);
		backdrop-filter: blur(4px) saturate(1.4);
		mask: linear-gradient(to bottom, transparent 25%, #000 40%, #000 55%, transparent 70%);
		-webkit-mask: linear-gradient(to bottom, transparent 25%, #000 40%, #000 55%, transparent 70%);
	}

	.bl-4 {
		-webkit-backdrop-filter: blur(2px) saturate(1.2);
		backdrop-filter: blur(2px) saturate(1.2);
		mask: linear-gradient(to bottom, transparent 40%, #000 55%, #000 70%, transparent 85%);
		-webkit-mask: linear-gradient(to bottom, transparent 40%, #000 55%, #000 70%, transparent 85%);
	}

	.bl-5 {
		-webkit-backdrop-filter: blur(1px) saturate(1.1);
		backdrop-filter: blur(1px) saturate(1.1);
		mask: linear-gradient(to bottom, transparent 55%, #000 70%, #000 85%, transparent 100%);
		-webkit-mask: linear-gradient(to bottom, transparent 55%, #000 70%, #000 85%, transparent 100%);
	}

	.bl-6 {
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		mask: linear-gradient(to bottom, transparent 70%, #000 85%, #000 100%);
		-webkit-mask: linear-gradient(to bottom, transparent 70%, #000 85%, #000 100%);
	}

	/* ---- Background tint (complex gradient mask) ---- */
	.nav-bg {
		position: absolute;
		inset: 0;
		bottom: -32px;
		z-index: 0;
		pointer-events: none;
		background: linear-gradient(to bottom, var(--nav-tint) 0%, var(--nav-tint) 60%, transparent 100%);
		mask-image: linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.4) 80%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.4) 80%, transparent 100%);
	}
</style>
