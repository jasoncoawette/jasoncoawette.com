<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';

	let scrolled = $derived((scrollY.current ?? 0) > 50);
</script>

<section class="h-[1000px]">
	<h1
		class="transition-opacity duration-500 ease-out"
		class:opacity-0={scrolled}
	>Jason Coawette</h1>
	<p class="mt-3">
		Design-forward software engineer building tasteful interfaces for humans and agentic AI. Recognized as a top fifteen
		tech entrepreneur at Arizona State University and a multi-year Venture Devils funding recipient.
	</p>
	<p class="mt-3">Currently, a Software Engineer at Boeing.</p>
</section>
