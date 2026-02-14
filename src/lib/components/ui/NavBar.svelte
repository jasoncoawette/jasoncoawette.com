<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';

	// Phase 1: layout snap (font-size, flex-wrap, padding) — instant, one reflow
	let scrolled = $derived((scrollY.current ?? 0) > 0);
	// Phase 2: subtitle reveal — delayed so layout is already settled
	let settled = $derived((scrollY.current ?? 0) > 24);
</script>

<nav class="nav" class:scrolled>
	<!-- Progressive blur: 6 stacked layers, exponential blur, top-heavy -->
	<div class="blur-wrap">
		<div class="blur-layer bl-1"></div>
		<div class="blur-layer bl-2"></div>
		<div class="blur-layer bl-3"></div>
		<div class="blur-layer bl-4"></div>
		<div class="blur-layer bl-5"></div>
		<div class="blur-layer bl-6"></div>
	</div>

	<div class="nav-bg"></div>

	<div class="nav-inner" class:scrolled>
		<div
			class="
			flex h-fit w-fit shrink-0 flex-col
			items-start justify-center
		"
		>
			<h1 class="nav-title" class:scrolled>Jason Coawette</h1>
			<p class="nav-subtitle" class:settled>Design Engineer</p>
		</div>

		<div class="nav-actions">
			<ThemeToggle />
			<button class="glass btn-text"> Email </button>
		</div>
	</div>
</nav>

<style>
	/* ---- Nav container — sticky ---- */
	.nav {
		--nav-tint: oklch(97% 0 0 / 0.7);
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	:global(.dark) .nav {
		--nav-tint: oklch(20.5% 0 0 / 0.65);
	}

	/* ---- Progressive blur wrapper ---- */
	.blur-wrap {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.blur-layer {
		position: absolute;
		inset: 0;
	}

	/*
		Exponential blur: 16 → 8 → 4 → 2 → 1 → 0.5 px
		Top = strongest blur, fades toward bottom + bleed zone.
		Overlapping mask bands for smooth transitions.
	*/
	.bl-1 {
		-webkit-backdrop-filter: blur(16px) saturate(1.8);
		backdrop-filter: blur(16px) saturate(1.8);
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
		-webkit-backdrop-filter: blur(8px) saturate(1.6);
		backdrop-filter: blur(8px) saturate(1.6);
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
		-webkit-backdrop-filter: blur(1px);
		backdrop-filter: blur(1px);
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
			var(--nav-tint) 70%,
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
		z-index: 1;
		display: flex;
		flex-wrap: wrap-reverse;
		width: 100%;
		max-width: 48rem;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		gap: 0.75rem;
	}

	.nav-inner.scrolled {
		flex-wrap: nowrap;
	}

	/* ---- Actions ---- */
	.nav-actions {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	/* ---- Title ---- */
	/* Phase 1: font-size snaps instantly on scroll — no transition, one clean reflow */
	.nav-title {
		transition: font-size 300ms 1ms ease-out;
	}

	.nav-title.scrolled {
		font-size: var(--text-lg);
	}

	/* ---- Subtitle ---- */
	/* Phase 2: reveals AFTER layout has settled (scrollY > 24px)
	   Only animates compositor-friendly props: opacity, filter, transform */
	.nav-subtitle {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-tight);
		max-height: 0;
		opacity: 0;
		filter: blur(4px);
		transform: translateY(6px);
		overflow: hidden;
		transition:
			max-height 0ms,
			opacity 0ms,
			filter 0ms,
			transform 0ms;
	}

	.nav-subtitle.settled {
		max-height: 1.5rem;
		opacity: 1;
		filter: blur(0);
		transform: translateY(0);
		transition: max-height 500ms 25ms ease-out;
		animation: blur-in-y 500ms 25ms ease-out;
	}

	/* ---- Animations ---- */
	@keyframes blur-in-y {
		from {
			opacity: 0;
			filter: blur(4px);
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}

	@media (max-width: 400px) {
		.nav-actions {
			position: absolute;
			top: 1rem;
			right: 1rem;
		}

		.nav-inner {
			padding-top: 5rem;
			transition: padding-top 300ms ease-out;
		}

		.nav-inner.scrolled {
			flex-wrap: wrap-reverse;
			padding-top: 1rem;
		}

		/* font-size snaps instantly after 155ms delay —
		   timed to the invisible phase of fade-blur-in-y
		   (30% of 500ms + 5ms anim delay = 155ms) */
		.nav-title {
			transition: font-size 300ms ease-in-out;
		}

		.nav-title.scrolled {
			font-size: var(--text-lg);
		}
	}
</style>
