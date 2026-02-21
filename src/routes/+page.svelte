<script lang="ts">
	import { BoeingLink, flyBlur } from '$lib';
	import { navState } from '$lib/navigation.svelte';
	import { scrollY } from 'svelte/reactivity/window';
	import { onMount } from 'svelte';

	let h1Bottom = $state(Infinity);
	let navHeight = $state(0);
	let mounted = $state(false);
	let h1El = $state<HTMLHeadingElement | null>(null);

	$effect(() => {
		if (h1El) {
			h1Bottom = h1El.getBoundingClientRect().bottom + window.scrollY;
		}
	});

	let pastHeading = $derived((scrollY.current ?? 0) > h1Bottom - navHeight);

	$effect(() => {
		navState.pastHeading = pastHeading;
	});

	onMount(() => {
		mounted = true;
		const nav = document.querySelector('nav');
		if (nav) navHeight = nav.getBoundingClientRect().height;
	});
</script>

<!-- HERO SECTION -->
<section class="flex h-fit w-full flex-col items-start justify-start gap-1" aria-label="hero">
	{#if mounted}
		<h1 bind:this={h1El} in:flyBlur class:past={pastHeading}>Jason Coawette</h1>
	{/if}
	{#if mounted}
		<span in:flyBlur={{ delay: 80 }} class="text-start">
			Software Engineer at <BoeingLink /> &middot; Design Obsessed &middot; Subtraction First
		</span>
	{/if}
</section>

<!-- QUOTE -->
<section class="flex flex-col h-150 items-center justify-end py-24 sm:h-180 sm:justify-center">
	<div class="flex w-full flex-col items-start justify-center gap-1 sm:items-center sm:text-center">
		{#if mounted}
			<blockquote in:flyBlur={{ delay: 160 }} class="text-lg! italic">
				"Jason makes consistently sound decisions that scale."
			</blockquote>
			<p in:flyBlur={{ delay: 240 }}>&#8212; &#160; Dr. Ray Hsu</p>
		{/if}
	</div>
</section>

<style>
	h1 {
		transition:
			opacity 400ms,
			filter 400ms,
			transform 400ms;
	}

	h1.past {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(-8px);
		pointer-events: none;
	}
</style>
