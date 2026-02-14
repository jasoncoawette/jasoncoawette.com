<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';
	import { cubicOut } from 'svelte/easing';

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

<nav class="nav">
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

	<div class="nav-inner">
		<a href="https://jasoncoawette.com/" class="title-block">
			{#if !scrolled}
				<div class="title-default"
					in:blurFly={{ y: 16, amount: 4, duration: 500 }}
					out:blurFly={{ y: -16, amount: 4, duration: 500 }}
				>
					<h1>Jason Coawette</h1>
				</div>
			{/if}

			{#if scrolled}
				<div class="title-scrolled"
					out:blurFly={{ y: -6, amount: 4, duration: 500 }}
				>
					<h1 in:blurFly={{ y: 6, amount: 4, duration: 500, delay: 200 }}>Jason Coawette</h1>
					<p class="nav-subtitle" in:blurFly={{ y: 6, amount: 4, duration: 500, delay: 300 }}>Design Engineer</p>
				</div>
			{/if}
		</a>

		<div class="nav-actions">
			<ThemeToggle />
			<button class="glass btn-text"> Email </button>
		</div>
	</div>
</nav>

<style>
	/* ---- Nav container — sticky ---- */
	.nav {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

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
		flex-wrap: nowrap;
		width: 100%;
		max-width: 48rem;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1rem 1rem 1rem;
		gap: 0.75rem;
	}

	/* ---- Actions ---- */
	.nav-actions {
		display: flex;
		flex-direction: row;
		flex-shrink: 0;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	/* ---- Title block: grid overlap so both titles share the same cell ---- */
	.title-block {
		display: grid;
		align-items: center;
		min-height: 2.5rem;
		overflow: hidden;
	}

	.title-block > * {
		grid-area: 1 / 1;
	}

	.title-default h1 {
		white-space: nowrap;
	}

	.title-scrolled h1 {
		font-size: var(--text-lg);
		white-space: nowrap;
	}

	/* ---- Subtitle ---- */
	.nav-subtitle {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-tight);
		white-space: nowrap;
	}
</style>
