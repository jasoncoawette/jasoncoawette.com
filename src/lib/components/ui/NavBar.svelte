<script lang="ts">
	import { ThemeToggle } from '$lib';
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 20);
</script>

<!--TODO: States: Back-->
<nav class="
	sticky top-0 z-30
	flex flex-col sm:flex-row
	w-full min-w-sm h-fit items-center justify-center gap-y-4
	p-4
">
	<div class="nav-glass"></div>

	<div class="z-40 flex w-full max-w-3xl items-center sm:justify-between">
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
	.nav-glass {
		pointer-events: none;
		position: absolute;
		inset: 0;
		z-index: 30;
		backdrop-filter: blur(4px) saturate(0);
		-webkit-backdrop-filter: blur(4px) saturate(0);
		background: linear-gradient(
			to bottom,
			var(--color-nav-tint),
			transparent
		);
		mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 60%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0%,
			black 60%,
			transparent 100%
		);
	}

	.nav-title {
		transition: font-size 300ms ease-out, filter 300ms ease-out;
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