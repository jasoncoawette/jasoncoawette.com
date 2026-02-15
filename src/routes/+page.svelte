<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';
	import { flyBlur } from '$lib';

	const mobile = new MediaQuery('max-width: 640px', true);
	let threshold = $derived(mobile.current ? 60 : 120);
	let scrolled = $state(false);

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!scrolled && y > threshold) {
			scrolled = true;
		} else if (scrolled && y < threshold - 20) {
			scrolled = false;
		}
	});
</script>

<section class="h-500">
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
</section>
