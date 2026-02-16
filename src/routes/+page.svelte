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
	let _scrolled = $state(false);
	let introComplete = $state(false);
	let scrolled = $derived(introComplete && _scrolled);
	let hasScrolledOnce = $state(false);
	let isReturningVisitor = $state(false);
	let showSkip = $derived(!introComplete && isReturningVisitor);
	let skipped = $state(false);
	let animKey = $state(0);

	$effect(() => {
		if (scrolled) hasScrolledOnce = true;
	});

	// Normal timing
	const CHAR_DELAY = 30;
	const DURATION = 400;
	// Compressed timing for skip
	const SKIP_CD = 8;
	const SKIP_DUR = 200;

	const cd = $derived(skipped ? SKIP_CD : CHAR_DELAY);
	const dur = $derived(skipped ? SKIP_DUR : DURATION);
	const end = (delay: number, len: number) => delay + (len - 1) * cd + dur;

	const h1Text = 'Jason Coawette';
	const p1aText =
		'Is a design-obsessed software engineer building tasteful interfaces for humans and agentic AI.';
	const p1bText = 'Recognized as a top fifteen tech entrepreneur at Arizona State University.';
	const p2Text = 'Currently, a Software Engineer at Boeing.';

	const p1aDelay = $derived(end(0, h1Text.length));
	const p1bDelay = $derived(end(p1aDelay, p1aText.length));
	const p2Delay = $derived(end(p1bDelay, p1bText.length));
	const restDelay = $derived(end(p2Delay, p2Text.length));

	function skipIntro() {
		skipped = true;
		animKey++;
		introComplete = true;
		document.documentElement.style.overflow = '';
		localStorage.setItem('intro-seen', '1');
	}

	$effect(() => {
		const y = scrollY.current ?? 0;
		if (!_scrolled && y > threshold) {
			_scrolled = true;
		} else if (_scrolled && y < threshold - hysteresis) {
			_scrolled = false;
		}
	});

	onMount(() => {
		isReturningVisitor = localStorage.getItem('intro-seen') === '1';

		// Reset to top on every load/reload to ensure full animation is visible
		window.scrollTo({ top: 0, behavior: 'smooth' });
		document.documentElement.style.overflow = 'hidden';

		const e = (d: number, n: number) => d + (n - 1) * CHAR_DELAY + DURATION;
		const introTime = e(e(e(e(0, h1Text.length), p1aText.length), p1bText.length), p2Text.length) + 3 * 100 + DURATION + DURATION;
		const timer = setTimeout(() => {
			document.documentElement.style.overflow = '';
			introComplete = true;
			localStorage.setItem('intro-seen', '1');
		}, introTime);

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
			<div class="flex h-9 w-full items-center">
				{#if !introComplete}
					<BlurText tag="h1" text={h1Text} delay={0} />
				{:else if !scrolled}
					<div
						in:flyBlur={{ y: 8, amount: 4, duration: hasScrolledOnce ? 400 : 0 }}
						out:flyBlur={{ y: 8, amount: 4, duration: 400 }}
					>
						<h1>{h1Text}</h1>
					</div>
				{/if}
				{#if showSkip}
					<button class="skip-intro" onclick={skipIntro}>
						<p>skip &rarr;</p>
					</button>
				{/if}
			</div>

			{#key animKey}
				<BlurText tag="p" text={p1aText} delay={skipped ? 0 : p1aDelay} charDelay={cd} duration={dur} class="mt-3" />
				<BlurText tag="p" text={p1bText} delay={skipped ? end(0, p1aText.length) : p1bDelay} charDelay={cd} duration={dur} />
				<BlurText tag="p" text={p2Text} delay={skipped ? end(end(0, p1aText.length), p1bText.length) : p2Delay} charDelay={cd} duration={dur} class="mt-3" />
			{/key}
		</section>

		<!--CASE STUDY SHOWCASE-->
		<section
			class="
		items-cetner flex h-fit w-full flex-col items-start gap-y-16 py-8 sm:flex-row sm:justify-between sm:gap-y-32 sm:py-16
	"
		>
			<div class="flex flex-col items-start justify-start gap-2">
				{#key animKey}
					{#each cases as name, i (name)}
						<BlurBlock delay={skipped ? end(end(end(0, p1aText.length), p1bText.length), p2Text.length) + i * 50 : restDelay + i * 100}>
							<button
								class="glass-ghost btn-text"
								class:active={activeIndex >= i}
								bind:this={caseButtons[i]}
							>
								{name}
							</button>
						</BlurBlock>
					{/each}
				{/key}
			</div>

			{#key animKey}
				<BlurBlock
					delay={skipped ? end(end(end(0, p1aText.length), p1bText.length), p2Text.length) + cases.length * 50 : restDelay + cases.length * 100}
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
			{/key}
		</section>
	</div>
{/key}

<style>
	.skip-intro {
		margin-left: auto;
		cursor: pointer;
		background: none;
		border: none;
		color: inherit;
		padding: 0;
		opacity: 0;
		animation: fade-in 400ms ease forwards;
		animation-delay: 800ms;
	}

	.skip-intro p {
		font-size: 0.875rem;
		opacity: 0.4;
		transition: opacity 150ms ease;
	}

	.skip-intro:hover p {
		opacity: 0.8;
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}
</style>
