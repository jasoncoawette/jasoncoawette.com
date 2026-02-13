<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 20);
</script>

<nav class="nav" class:scrolled>
	<div class="nav-bg" class:scrolled></div>

	<div class="nav-inner" class:scrolled>
		<div class="
			flex flex-col w-fit h-fit shrink-0
			items-start justify-center
		">
			<h1 class="nav-title" class:scrolled>
				Jason Coawette
			</h1>
			<p class="nav-subtitle" class:scrolled>
				Design Engineer
			</p>
		</div>

		<div class="
			flex flex-row grow
			items-center justify-end gap-x-2
		">
			<ThemeToggle/>
			<button class="glass btn-text">
				Email
			</button>
		</div>
	</div>
</nav>

<style>
	/* ---- Layer 1: Nav container — sticky + backdrop blur ---- */
	.nav {
		--nav-tint: oklch(97% 0 0 / 0.7);
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		-webkit-backdrop-filter: blur(0px) saturate(1);
		backdrop-filter: blur(0px) saturate(1);
		transition:
			backdrop-filter 300ms ease-out,
			-webkit-backdrop-filter 300ms ease-out;
	}

	:global(.dark) .nav {
		--nav-tint: oklch(20.5% 0 0 / 0.65);
	}

	.nav.scrolled {
		-webkit-backdrop-filter: blur(20px) saturate(1.8);
		backdrop-filter: blur(20px) saturate(1.8);
	}

	/* ---- Layer 2: Background tint + mask fade ---- */
	.nav-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: transparent;
		transition: background 300ms ease-out;
		pointer-events: none;
	}

	.nav-bg.scrolled {
		background: linear-gradient(
			to bottom,
			var(--nav-tint) 0%,
			var(--nav-tint) 80%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 70%,
			rgba(0,0,0,0.4) 85%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 70%,
			rgba(0,0,0,0.4) 85%,
			transparent 100%
		);
	}

	/* ---- Layer 3: Content ---- */
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
		transition: flex-wrap 300ms ease-out;
	}

	.nav-inner.scrolled {
		flex-wrap: nowrap;
	}

	/* ---- Title ---- */
	.nav-title {
		transition: font-size 300ms ease-out;
	}

	.nav-title.scrolled {
		font-size: var(--text-lg);
	}

	/* ---- Subtitle ---- */
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

	.nav-subtitle.scrolled {
		max-height: 1.5rem;
		opacity: 1;
		filter: blur(0);
		transform: translateY(0);
		transition:
			max-height 300ms ease-out,
			opacity 300ms ease-out,
			filter 300ms ease-out,
			transform 300ms ease-out;
	}

	/* ---- ≤370px overrides ---- */
	@keyframes blur-in-y {
		from {
			opacity: 0;
			filter: blur(4px);
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}

	@media (max-width: 370px) {
		.nav-inner.scrolled {
			flex-wrap: wrap-reverse;
		}

		.nav-bg.scrolled {
			mask-image: linear-gradient(
				to bottom,
				black 0%,
				black 30%,
				rgba(0,0,0,0.4) 60%,
				rgba(0,0,0,0.15) 80%,
				transparent 100%
			);
			-webkit-mask-image: linear-gradient(
				to bottom,
				black 0%,
				black 30%,
				rgba(0,0,0,0.4) 60%,
				rgba(0,0,0,0.15) 80%,
				transparent 100%
			);
		}

		.nav-title {
			transition: font-size 300ms ease-out;
		}

		.nav-title.scrolled {
			font-size: var(--text-lg);
			animation: blur-in-y 300ms ease-out backwards;
		}
	}
</style>
