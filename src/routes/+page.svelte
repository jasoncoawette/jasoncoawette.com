<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';
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

	const CHAR_DELAY = 30;
	const DURATION = 400;
	const blurEnd = (delay: number, len: number) => delay + (len - 1) * CHAR_DELAY + DURATION;

	const h1Text = 'Jason Coawette';
	const p1aText =
		'Design-forward software engineer building tasteful interfaces for humans and agentic AI.';
	const p1bText = 'Recognized as a top fifteen tech entrepreneur at Arizona State University.';
	const p2Text = 'Currently, a Software Engineer at Boeing.';

	const p1aDelay = blurEnd(0, h1Text.length);
	const p1bDelay = blurEnd(p1aDelay, p1aText.length);
	const p2Delay = blurEnd(p1bDelay, p1bText.length);
	const restDelay = blurEnd(p2Delay, p2Text.length);

	onMount(() => {
		document.documentElement.style.overflow = 'hidden';
		const timer = setTimeout(
			() => {
				document.documentElement.style.overflow = '';
			},
			restDelay + 3 * 100 + DURATION + DURATION
		);
		return () => {
			clearTimeout(timer);
			document.documentElement.style.overflow = '';
		};
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
	<div
		class="flex h-full w-full flex-col items-start justify-start gap-y-8 pt-8 pb-32 sm:gap-y-32 sm:pt-0"
	>
		<!--TOP HEADING AND PARAGRAPH-->
		<section class="flex w-full flex-col">
			<div class="h-9">
				{#if !scrolled}
					<div out:flyBlur={{ y: 8, amount: 4, duration: 400 }}>
						<BlurText tag="h1" text={h1Text} delay={0} />
					</div>
				{/if}
			</div>
			<BlurText tag="p" text={p1aText} delay={p1aDelay} class="mt-3" />
			<BlurText tag="p" text={p1bText} delay={p1bDelay} />
			<BlurText tag="p" text={p2Text} delay={p2Delay} class="mt-3" />
		</section>

		<!--CASE STUDY SHOWCASE-->
		<section
			class="
		items-cetner flex h-fit w-full flex-col items-start gap-y-16 py-8 sm:flex-row sm:justify-between sm:gap-y-32 sm:py-16
	"
		>
			<div class="flex flex-col items-start justify-start gap-2">
				{#each cases as name, i (name)}
					<BlurBlock delay={restDelay + i * 100}>
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

			<BlurBlock
				delay={restDelay + cases.length * 100}
				class="flex w-full max-w-sm flex-col text-start sm:ml-auto"
			>
				<blockquote>
					<p class="italic">
						"Jason consistently demonstrates strong design judgment and sound architectural
						decisions"
					</p>
					<p class="mt-5 text-sm! whitespace-nowrap">
						— Dr. Ray Hsu, Founder & CEO, Ada Analytics
					</p>
				</blockquote>
			</BlurBlock>
		</section>
	</div>
{/key}
