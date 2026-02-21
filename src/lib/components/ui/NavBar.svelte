<script lang="ts">
	import { shine } from '$lib';
	import { navState } from '$lib/navigation.svelte';

	let {
		title,
		subtitle
	}: {
		title: string;
		subtitle?: string;
	} = $props();

	let scrolled = $derived(navState.pastHeading);
</script>

<!-- Sticky nav with progressive blur -->
<nav class="sticky top-0 z-50 flex w-full items-center justify-center sm:pt-4">
	<div class="pointer-events-none absolute inset-0">
		<div class="blur-layer bl-1"></div>
		<div class="blur-layer bl-2"></div>
		<div class="blur-layer bl-3"></div>
		<div class="blur-layer bl-4"></div>
		<div class="blur-layer bl-5"></div>
		<div class="blur-layer bl-6"></div>
	</div>

	<div class="nav-bg"></div>

	<div class="sticky top-0 z-10 h-fit w-full max-w-3xl px-4 pt-6 pb-4">
		<div class="pointer-events-auto relative flex h-fit items-center justify-start gap-4">
			<a
				href="/"
				class="nav-title relative flex flex-col items-start justify-start"
				class:visible={scrolled}
			>
				<h1 class="text-lg! whitespace-nowrap">{title}</h1>
				<p class="nav-subtitle leading-tight! whitespace-nowrap">{subtitle}</p>
			</a>

			<a
				href="https://cal.com/jason-coawette/lets-connect"
				aria-label="Contact"
				class="btn-pos ml-auto rounded-full"
				class:scrolled
			>
				<button class="glass btn-text btn-scale h-fit w-fit" use:shine>Book Time</button>
			</a>
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

	/* ---- Nav title slide (CSS-only, no DOM mount/unmount) ---- */
	.nav-title {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(8px);
		pointer-events: none;
		transition:
			opacity 400ms ease,
			filter 400ms ease,
			transform 400ms ease;
	}

	.nav-title.visible {
		opacity: 1;
		filter: blur(0);
		transform: translateY(0);
		pointer-events: auto;
	}

	/* ---- Staggered subtitle animation ---- */
	.nav-subtitle {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(4px);
		transition:
			opacity 400ms ease,
			filter 400ms ease,
			transform 400ms ease;
	}

	.nav-title.visible .nav-subtitle {
		opacity: 1;
		filter: blur(0);
		transform: translateY(0);
		transition-delay: 150ms;
	}

	/* ---- Book Time button: aligns with H1 at top, slides into nav on scroll ---- */
	@media (min-width: 780px) {
		.btn-pos {
			position: absolute;
			right: 0;
			top: 3.375rem; /* ~54px: button center ≈ H1 center on initial load */
			transition: top 350ms ease;
		}

		.btn-pos.scrolled {
			top: -3px; /* button center ≈ nav-title center */
		}
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
