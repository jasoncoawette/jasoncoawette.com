<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { flyBlur } from '$lib';
	import { caseStudies } from '$lib/content/case-studies';
	import { isFirstLoad } from '$lib/first-load';
	import boeingLogo from '$lib/assets/boeing-logo.avif';

	const firstLoad = isFirstLoad();
	let mounted = $state(!firstLoad);
	onMount(() => { mounted = true; });

	const mobile = new MediaQuery('max-width: 640px', true);
	let scrolled = $state(false);

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!scrolled && y > 50) scrolled = true;
		else if (scrolled && y < 25) scrolled = false;
	});

	let caseItems: HTMLLIElement[] = $state([]);
	let activeIndex = $state(-1);

	$effect(() => {
		void scrollY.current;
		if (!mobile.current || caseItems.length === 0) {
			activeIndex = -1;
			return;
		}
		const mid = window.innerHeight * 0.4;
		let idx = -1;
		for (let i = 0; i < caseItems.length; i++) {
			const rect = caseItems[i].getBoundingClientRect();
			if (rect.top < mid && rect.bottom > 0) {
				idx = i;
			}
		}
		// Last item stays active once reached
		if (idx === -1 && activeIndex === caseStudies.length - 1) {
			return;
		}
		activeIndex = idx;
	});
</script>

<div
	class="flex h-full w-full flex-col items-start justify-start gap-y-16 pt-6 pb-32 sm:pt-0"
>
	<!--TOP HEADING AND PARAGRAPH-->
	<section class="flex w-full flex-col">
		<div id="page-title" class="flex h-9 w-full items-center">
			{#if mounted && !scrolled}
				<div
					in:flyBlur={{ y: 8, amount: 4, duration: 400 }}
					out:flyBlur={{ y: 8, amount: 4, duration: 400 }}
				>
					<h1>Jason Coawette</h1>
				</div>
			{/if}
		</div>

		{#if mounted}
			<div class="mt-1 flex flex-wrap sm:flex-row items-center justify-start w-fit h-fit gap-1.5" in:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 200 }}>
				<span class="text-base leading-relaxed font-normal tracking-normal text-secondary-fg">Software Engineer at</span>
				<a href="https://boeing.com" class="flex flex-row items-center justify-center gap-1.5">
					<img src={boeingLogo} alt="link to boeing" class="w-8 h-8 rounded-full border border-tertiary-fg/20 antialiased" />
					<span class="
							text-base leading-relaxed font-normal tracking-normal text-secondary-fg
							hover:text-tertiary-fg transition-colors duration-400 ease-out link-text
					">Boeing ↗</span>
				</a>
			</div>
		{/if}
	</section>

	<!--CASE STUDY SHOWCASE-->
	<section
		class="
			flex h-160 sm:h-100 w-full flex-col items-start justify-end sm:justify-center sm:flex-row gap-8 sm:gap-16
		"
	>
		{#if mounted}
			<!--MENU BUTTONS-->
			<ul
				class="h-fit flex flex-col items-start justify-start gap-2"
				in:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 350 }}
			>
				{#each caseStudies as { slug, title }, i (slug)}
					<li class="glass-ghost btn-text" bind:this={caseItems[i]} class:active={mobile.current && activeIndex === i}>
						
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href="/case-studies/{slug}" class="cursor-pointer">
							{title}
						</a>
					</li>
				{/each}
			</ul>

			<!--PROJECT PREVIEW-->
			<div
				class="flex w-full min-h-40 flex-col justify-center items-center"
				in:flyBlur={{ y: 8, amount: 4, duration: 400, delay: 500 }}
			>
				<blockquote class="max-w-md">
					<p class="italic">
						"Jason consistently demonstrates strong design judgment and sound architectural
						decisions"
					</p>
					<p class="mt-3 text-sm! whitespace-nowrap">
						— Dr. Ray Hsu
					</p>
				</blockquote>
			</div>
		{/if}
	</section>
</div>