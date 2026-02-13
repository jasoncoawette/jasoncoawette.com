<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 20);
</script>

<nav class="nav" class:scrolled>
	<div class="
		flex flex-col w-fit h-fit shrink-0
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
		flex flex-row grow
		items-center justify-end gap-x-2
	">
		<ThemeToggle/>
		<button>
			Email
		</button>
	</div>
</nav>

<style>
	.nav {
		--nav-tint: oklch(97% 0 0 / 0.7);
		position: sticky;
		top: 0;
		z-index: 4;
		display: flex;
		flex-wrap: wrap-reverse;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 48rem;
		margin: 0 auto;
		padding: 1rem;
		-webkit-backdrop-filter: blur(0px) saturate(1);
		backdrop-filter: blur(0px) saturate(1);
		background: transparent;
		mask-image: none;
		-webkit-mask-image: none;
		transition:
			flex-wrap 300ms ease-out,
			backdrop-filter 300ms ease-out,
			-webkit-backdrop-filter 300ms ease-out,
			background 300ms ease-out;
	}

	:global(.dark) .nav {
		--nav-tint: oklch(20.5% 0 0 / 0.65);
	}

	.nav.scrolled {
		flex-wrap: nowrap;
		-webkit-backdrop-filter: blur(20px) saturate(1.8);
		backdrop-filter: blur(20px) saturate(1.8);
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

	.nav-title {
		transition: font-size 300ms ease-out;
	}

	.nav-title.scrolled {
		font-size: var(--text-lg);
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
