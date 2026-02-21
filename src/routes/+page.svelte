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
<section class="flex h-fit w-full flex-col items-start justify-start gap-2" aria-label="hero">
	{#if mounted}
		<h1 bind:this={h1El} in:flyBlur class:past={pastHeading}>Jason Coawette</h1>
	{/if}
	{#if mounted}
		<span in:flyBlur={{ delay: 80 }} class="text-start">
			<span class="whitespace-nowrap">Software engineer at <BoeingLink /></span>
			<span class="whitespace-nowrap">&middot; Design obsessed</span>
			<span class="whitespace-nowrap">&middot; Subtraction first</span>
		</span>
	{/if}
</section>

<!-- QUOTE -->
<section class="flex h-150 flex-col items-center justify-end py-32 sm:h-200 sm:justify-center">
	<div class="flex w-full flex-col items-start justify-center gap-2 sm:items-center sm:text-center">
		{#if mounted}
			<blockquote in:flyBlur={{ delay: 160 }} class="italic sm:text-lg!">
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
