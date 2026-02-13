<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 20);
</script>

<nav class="nav">
	<div class="nav-glass"></div>

	<div class="z-40 flex flex-col sm:flex-row
		w-full max-w-3xl items-center sm:justify-between">
		<div class="
			flex flex-col w-full sm:w-fit h-fit
			items-start justify-center
			transition-all duration-300 ease-out
		">
			<h1 class="nav-title" class:scrolled>
				Jason Coawette
			</h1>
			<p class="nav-subtitle" class:scrolled>
				Design Engineer
			</p>
		</div>

		<div class="
			flex flex-row
			w-full sm:w-fit items-center justify-end gap-x-2
		">
			<ThemeToggle/>
			<button>
				Email
			</button>
			<button>
				X
			</button>
		</div>
	</div>
</nav>

<style>
	.nav {
		--nav-tint: oklch(97% 0 0 / 0.92);
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 1rem;
	}

	:global(.dark) .nav {
		--nav-tint: oklch(20.5% 0 0 / 0.92);
	}

	.nav-glass {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: -2rem;
		z-index: 30;
		backdrop-filter: blur(4px) saturate(0.6);
		-webkit-backdrop-filter: blur(4px) saturate(0.6);
		background: linear-gradient(
			to bottom,
			var(--nav-tint) 0%,
			var(--nav-tint) 60%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 50%,
			rgba(0,0,0,0.4) 70%,
			rgba(0,0,0,0.15) 85%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 50%,
			rgba(0,0,0,0.4) 70%,
			rgba(0,0,0,0.15) 85%,
			transparent 100%
		);
	}

	.nav-title {
		transition: font-size 300ms ease-out;
	}

	.nav-title.scrolled {
		font-size: var(--text-base);
	}

	.nav-subtitle {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-tight);
		max-height: 0;
		opacity: 0;
		filter: blur(4px);
		transform: translateY(6px);
		transition:
			max-height 300ms ease-out,
			opacity 300ms ease-out,
			filter 300ms ease-out,
			transform 300ms ease-out;
		overflow: hidden;
	}

	.nav-subtitle.scrolled {
		max-height: 2rem;
		opacity: 1;
		filter: blur(0);
		transform: translateY(0);
	}
</style>
