<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';
	import { flyBlur } from '$lib';
	import { BlurText, BlurBlock } from '$lib/components/ui';
	import { page } from '$app/state';

	const mobile = new MediaQuery('max-width: 640px', true);
	let threshold = $derived(mobile.current ? 60 : 120);
	let hysteresis = $derived(mobile.current ? 30 : 40);
	let scrolled = $state(false);

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!scrolled && y > threshold) {
			scrolled = true;
		} else if (scrolled && y < threshold - hysteresis) {
			scrolled = false;
		}
	});

	const cases = ['Boeing', 'Clovis', 'Studygenie'];
	let caseButtons: HTMLButtonElement[] = $state([]);
	let activeIndex = $state(-1);

	$effect(() => {
		void scrollY.current;
		if (!mobile.current || caseButtons.length === 0) {
			activeIndex = -1;
			return;
		}
		const viewportMid = window.innerHeight * 0.25;
		let idx = -1;
		for (let i = 0; i < caseButtons.length; i++) {
			if (caseButtons[i].getBoundingClientRect().top < viewportMid) {
				idx = i;
			}
		}
		activeIndex = idx;
	});
</script>

{#key page.url.pathname}
<div class="flex flex-col h-full justify-start items-start gap-y-8 sm:gap-y-32 pt-8 sm:pt-0 pb-8 sm:pb-32">
	<!--TOP HEADING AND PARAGRAPH-->
	<section>
		<div class="h-9">
			{#if !scrolled}
				<h1
					transition:flyBlur={{ y: 8, amount: 4, duration: 400 }}
				>Jason Coawette</h1>
			{/if}
		</div>
		<BlurText
			tag="p"
			text="Design-forward software engineer building tasteful interfaces for humans and agentic AI. Recognized as a top fifteen tech entrepreneur at Arizona State University."
			delay={200}
			class="mt-3"
		/>
		<BlurText
			tag="p"
			text="Currently, a Software Engineer at Boeing."
			delay={400}
			class="mt-3"
		/>
	</section>

	<!--CASE STUDY SHOWCASE-->
	<section class="
		flex flex-col sm:flex-row w-full h-fit items-start items-cetner py-8 gap-y-16 sm:py-16 sm:gap-y-32 sm:justify-between
	">
		<div class="flex flex-col items-start justify-start gap-2">
			{#each cases as name, i (name)}
				<BlurBlock delay={600 + i * 100}>
					<button
						class="glass-ghost btn-text"
						class:active={activeIndex >= i}
						bind:this={caseButtons[i]}
					>
						{name}
					</button>
				</BlurBlock>
			{/each}
		</div>

		<BlurBlock delay={900} class="flex flex-col w-full max-w-sm sm:ml-auto text-start">
			<blockquote>
				<BlurText
					tag="p"
					text={'\u201CJason consistently demonstrates strong design judgment and sound architectural decisions.\u201D'}
					delay={950}
					class="italic"
				/>
				<BlurText
					tag="p"
					text="— Dr. Ray Hsu, Founder & CEO, Ada Analytics"
					delay={1150}
					class="mt-5 ml-2 text-sm! whitespace-nowrap"
				/>
			</blockquote>
		</BlurBlock>
	</section>
</div>
{/key}
