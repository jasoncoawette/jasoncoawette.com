<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { flyBlur } from '$lib';
	import { getCaseStudy } from '$lib/content/case-studies';

	let mounted = $state(false);
	onMount(() => { mounted = true; });

	let study = $derived(getCaseStudy(page.params.slug));
	let title = $derived(study?.title ?? page.params.slug);
</script>

<svelte:head>
	<title>{title} — Case Study</title>
</svelte:head>

<div class="flex h-full w-full flex-col items-start justify-start pt-6 pb-32 sm:pt-0">
	{#if mounted}
		<h1 id="page-title" in:flyBlur={{ y: 8, amount: 4, duration: 400 }}>{title}</h1>
	{/if}
</div>
