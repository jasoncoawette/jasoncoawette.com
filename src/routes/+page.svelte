<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';
	import { flyBlur, shine } from '$lib';

	const mobile = new MediaQuery('max-width: 640px', true);
	let threshold = $derived(mobile.current ? 60 : 120);
	let scrolled = $state(false);

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!scrolled && y > threshold) {
			scrolled = true;
		} else if (scrolled && y < threshold - 40) {
			scrolled = false;
		}
	});

	const cases = ['Boeing', 'Clovis', 'Studygenie'];
	let caseContainer: HTMLDivElement;
	let activeIndex = $state(-1);

	$effect(() => {
		void scrollY.current; // subscribe to scroll updates
		if (!mobile.current || !caseContainer) {
			activeIndex = -1;
			return;
		}
		const rect = caseContainer.getBoundingClientRect();
		const viewportMid = window.innerHeight * 0.6;
		if (rect.top > viewportMid) {
			activeIndex = -1;
		} else {
			const buttons = caseContainer.children;
			let idx = -1;
			for (let i = 0; i < buttons.length; i++) {
				const btn = buttons[i] as HTMLElement;
				if (btn.getBoundingClientRect().top < viewportMid) {
					idx = i;
				}
			}
			activeIndex = idx;
		}
	});
</script>

<section>
	<div class="h-9">
		{#if !scrolled}
			<h1
				out:flyBlur={{ y: 8, amount: 4, duration: 400 }}
			>Jason Coawette</h1>
		{/if}
	</div>
	<p class="mt-3">
		Design-forward software engineer building tasteful interfaces for humans and agentic AI. Recognized as a top fifteen
		tech entrepreneur at Arizona State University.
	</p>
	<p class="mt-3">Currently, a Software Engineer at Boeing.</p>

	<div class="flex flex-col items-start justify-start gap-2 mt-16" bind:this={caseContainer}>
		{#each cases as name, i}
			<button class="glass-ghost btn-text" class:stroke-active={mobile.current && activeIndex >= i}>
				{name}
			</button>
		{/each}
	</div>
</section>

<style>
	.stroke-active {
		border-color: var(--color-primary-fg);
		background: transparent;
		box-shadow: none;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
</style>
