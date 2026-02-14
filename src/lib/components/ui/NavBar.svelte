<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { ChevronLeft } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';
	import { cubicOut } from 'svelte/easing';

	let { title, subtitle, variant = 'default' }: {
		title: string;
		subtitle?: string;
		variant?: 'default' | 'cms';
	} = $props();

	let scrolled = $derived((scrollY.current ?? 0) > 72);

	/**
	 * Custom transition: blur + translateY + opacity
	 */
	function blurFly(
		_node: Element,
		{ delay = 0, duration = 300, y = -6, amount = 4, easing = cubicOut }: {
			delay?: number;
			duration?: number;
			y?: number;
			amount?: number;
			easing?: (t: number) => number;
		} = {}
	) {
		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
				opacity: ${t};
				filter: blur(${(1 - t) * amount}px);
				transform: translateY(${(1 - t) * y}px);
			`
		};
	}
</script>

<nav class="sticky z-10 top-0 flex w-full items-center justify-center sm:mt-8 md:mt-12">
	<!-- Progressive blur: 6 stacked layers -->
	<div class="blur-wrap">
		<div class="blur-layer bl-1"></div>
		<div class="blur-layer bl-2"></div>
		<div class="blur-layer bl-3"></div>
		<div class="blur-layer bl-4"></div>
		<div class="blur-layer bl-5"></div>
		<div class="blur-layer bl-6"></div>
	</div>

	<div class="nav-bg"></div>

	<div class="nav-inner pt-6 px-4 pb-6 sm:pb-0">
		<div class="title-area">
			{#if variant === 'cms'}
				<a href="https://jasoncoawette.com" class="back-button" aria-label="Back to home">
					<ChevronLeft size={20} strokeWidth={2.5} />
				</a>
			{/if}

			{#if scrolled}
				<div class="scrolled-content"
					out:blurFly={{ y: -6, amount: 4, duration: 500 }}
				>
					<h1 class="scrolled-title whitespace-nowrap" in:blurFly={{ y: 6, amount: 4, duration: 500, delay: 200 }}>{title}</h1>
					<p class="whitespace-nowrap text-sm tracking-tight" in:blurFly={{ y: 6, amount: 4, duration: 500, delay: 300 }}>{subtitle}</p>
				</div>
			{/if}
		</div>

		<div class="nav-actions">
			<ThemeToggle />
			<button class="glass btn-text"> Email </button>
		</div>
	</div>
</nav>

<style>
	/* ---- Progressive blur wrapper ---- */
	.blur-wrap {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.blur-layer {
		position: absolute;
		inset: 0;
	}

	.bl-1 {
		-webkit-backdrop-filter: blur(4px) saturate(1.8);
		backdrop-filter: blur(4px) saturate(1.8);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) 20%,
			rgba(0, 0, 0, 0) 35%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) 20%,
			rgba(0, 0, 0, 0) 35%
		);
	}

	.bl-2 {
		-webkit-backdrop-filter: blur(4px) saturate(1.6);
		backdrop-filter: blur(4px) saturate(1.6);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 10%,
			rgba(0, 0, 0, 1) 25%,
			rgba(0, 0, 0, 1) 40%,
			rgba(0, 0, 0, 0) 55%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 10%,
			rgba(0, 0, 0, 1) 25%,
			rgba(0, 0, 0, 1) 40%,
			rgba(0, 0, 0, 0) 55%
		);
	}

	.bl-3 {
		-webkit-backdrop-filter: blur(4px) saturate(1.4);
		backdrop-filter: blur(4px) saturate(1.4);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 25%,
			rgba(0, 0, 0, 1) 40%,
			rgba(0, 0, 0, 1) 55%,
			rgba(0, 0, 0, 0) 70%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 25%,
			rgba(0, 0, 0, 1) 40%,
			rgba(0, 0, 0, 1) 55%,
			rgba(0, 0, 0, 0) 70%
		);
	}

	.bl-4 {
		-webkit-backdrop-filter: blur(2px) saturate(1.2);
		backdrop-filter: blur(2px) saturate(1.2);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 40%,
			rgba(0, 0, 0, 1) 55%,
			rgba(0, 0, 0, 1) 70%,
			rgba(0, 0, 0, 0) 85%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 40%,
			rgba(0, 0, 0, 1) 55%,
			rgba(0, 0, 0, 1) 70%,
			rgba(0, 0, 0, 0) 85%
		);
	}

	.bl-5 {
		-webkit-backdrop-filter: blur(1px) saturate(1.1);
		backdrop-filter: blur(1px) saturate(1.1);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 55%,
			rgba(0, 0, 0, 1) 70%,
			rgba(0, 0, 0, 1) 85%,
			rgba(0, 0, 0, 0) 100%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 55%,
			rgba(0, 0, 0, 1) 70%,
			rgba(0, 0, 0, 1) 85%,
			rgba(0, 0, 0, 0) 100%
		);
	}
	.bl-6 {
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 70%,
			rgba(0, 0, 0, 1) 85%,
			rgba(0, 0, 0, 1) 100%
		);
		-webkit-mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 70%,
			rgba(0, 0, 0, 1) 85%,
			rgba(0, 0, 0, 1) 100%
		);
	}

	/* ---- Background tint + mask fade ---- */
	.nav-bg {
		position: absolute;
		inset: 0;
		bottom: -24px;
		z-index: 0;
		background: transparent;
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

	/* ---- Content ---- */
	.nav-inner {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 48rem;
		gap: 0.75rem;
	}

  /* Below 400px: stack buttons above title */
  @media (max-width: 400px) {
      .nav-inner {
          position: sticky;
      }
  }

	.title-area {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-height: 2.5rem;
		position: relative;
	}

	.scrolled-content {
		position: absolute;
		top: 0;
		left: 0;
	}

	.title-area:has(.back-button) .scrolled-content {
		left: 1.75rem;
	}

	.back-button {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-primary);
		opacity: 0.7;
		transition: opacity 200ms ease;
		flex-shrink: 0;
	}

	.back-button:hover {
		opacity: 1;
	}

	.nav-actions {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.5rem;
	}

	/* Override global h1 styles for scrolled state */
	.scrolled-title {
		font-size: var(--text-lg) !important;
		font-weight: 600;
	}
</style>
