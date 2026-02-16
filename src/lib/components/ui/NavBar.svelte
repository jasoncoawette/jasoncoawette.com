<script lang="ts">
	import { Chat, ChevronLeft, flyBlur, shine } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';

	let {
		title,
		subtitle,
		link = 'https://jasoncoawette.com',
		variant = 'default'
	}: {
		title: string;
		subtitle?: string;
		link?: string;
		variant?: 'default' | 'cms';
	} = $props();

	const mobile = new MediaQuery('max-width: 640px', false);
	let threshold = $derived(mobile.current ? 88 : 128);
	let hysteresis = $derived(mobile.current ? 70 : 40);
	let scrolled = $state(false);

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!scrolled && y > threshold) {
			scrolled = true;
		} else if (scrolled && y < threshold - hysteresis) {
			scrolled = false;
		}
	});
</script>

<!-- Sticky nav with progressive blur -->
<nav class="sticky top-0 z-20 flex w-full items-center justify-center sm:mt-12">
	<div class="pointer-events-none absolute inset-0 z-20">
		<div class="blur-layer bl-1"></div>
		<div class="blur-layer bl-2"></div>
		<div class="blur-layer bl-3"></div>
		<div class="blur-layer bl-4"></div>
		<div class="blur-layer bl-5"></div>
		<div class="blur-layer bl-6"></div>
	</div>

	<div class="nav-bg"></div>

	<div class="sticky top-0 z-30 h-fit w-full max-w-3xl px-4 pt-6 pb-4">
		<div class="pointer-events-auto relative flex h-fit items-center gap-4">
			{#if variant === 'cms'}
				<a href="https://jasoncoawette.com" aria-label="Back to home">
					<button class="glass btn-icon btn-scale" use:shine>
						<ChevronLeft color="var(--color-primary-fg)" />
					</button>
				</a>
			{/if}

			{#if scrolled}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={link} class="relative flex flex-col items-start">
					<h1
						class="text-lg! whitespace-nowrap"
						transition:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 50 }}
					>
						{title}
					</h1>
					<p
						class="leading-tight! whitespace-nowrap"
						transition:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 200 }}
					>
						{subtitle}
					</p>
				</a>
			{/if}

			<div class="flex w-full items-center justify-end gap-2">
				<button class="glass btn-icon inline-flex" use:shine>
					<Chat />
				</button>
				<a href="https://cal.com/jason-coawette/lets-connect" aria-label="Contact" class="rounded-full">
					<button class="glass btn-text btn-scale" use:shine>Connect</button>
				</a>
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
		background: linear-gradient(
			to bottom,
			var(--nav-tint) 0%,
			var(--nav-tint) 60%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 60%,
			rgba(0, 0, 0, 0.4) 80%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 60%,
			rgba(0, 0, 0, 0.4) 80%,
			transparent 100%
		);
	}
</style>
