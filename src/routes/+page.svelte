<script lang="ts">
	import { Gate, PowerSwitch, RailPath, TimelineEntry, shine } from '$lib';
	import { entries } from '$lib/data/experience';
	import { gateState } from '$lib/state/gate.svelte';
	import { navState } from '$lib/navigation.svelte';

	/**
	 * Hands the nav its cue to swap in the small title, and fades the big one out.
	 * Re-runs when the gate lifts — until then the page cannot scroll, so the
	 * heading's document position is not yet meaningful.
	 */
	function trackHeading(node: HTMLElement) {
		void gateState.entered;

		const nav = document.querySelector('nav');
		const navHeight = nav ? nav.getBoundingClientRect().height : 0;
		let bottom = 0;

		const measure = () => (bottom = node.getBoundingClientRect().bottom + window.scrollY);
		const check = () => (navState.pastHeading = window.scrollY > bottom - navHeight);
		const onResize = () => {
			measure();
			check();
		};

		onResize();

		window.addEventListener('scroll', check, { passive: true });
		window.addEventListener('resize', onResize);
		const observer = new ResizeObserver(onResize);
		observer.observe(document.body);

		return () => {
			window.removeEventListener('scroll', check);
			window.removeEventListener('resize', onResize);
			observer.disconnect();
		};
	}
</script>

<Gate />

<div class="folio folio-col" class:booting={!gateState.entered}>
	<section class="folio-intro reveal" aria-label="Introduction">
		<PowerSwitch />

		<h1 class="intro-name" class:past={navState.pastHeading} {@attach trackHeading}>
			Jason Coawette
		</h1>
		<p class="intro-role">I design and build software</p>
		<p class="folio-lede">Everything below is live. Click around if you want.</p>
		<p class="folio-sub">
			I won't claim I'm the best engineer you'll meet. What I can tell you is I listen first, I say
			things in plain words, and I finish what I start.
		</p>
	</section>

	<div class="folio-track">
		<RailPath />

		<ul class="folio-timeline">
			{#each entries as entry, i (entry.id)}
				<TimelineEntry {entry} index={i} />
			{/each}
		</ul>

		<div class="folio-outro reveal" style="--reveal-delay: 540ms">
			<p class="outro-thanks font-medium">Thanks for reading. Hope this finds you well :)</p>

			<!-- Fills blue on the frame the rail finishes, so getting to the end
			     of the page is what hands over the way to get in touch. -->
			<a
				class="outro-cta glass btn-text btn-scale"
				href="mailto:jason.coawette@gmail.com"
				use:shine
			>
				Say hi, I'd love to hear from you
			</a>
		</div>
	</div>
</div>

<style>
	.folio-col {
		padding-top: 6vh;
	}

	.intro-name {
		transition:
			opacity 400ms,
			filter 400ms,
			transform 400ms;
	}

	/* The nav picks the name up as it goes; only one of them is ever visible. */
	.intro-name.past {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(-8px);
		pointer-events: none;
	}

	.intro-role {
		margin-bottom: 22px;
		font-family: var(--folio-mono);
		font-size: 11px !important;
		letter-spacing: 1.84px;
		text-transform: uppercase;
		color: var(--color-folio-mute) !important;
	}

	.folio-sub {
		margin-top: 8px;
	}

	/* Set in the same type as .tl-role — the "Recognition along the way" line —
	   so the page signs off in the voice it ran in. The bare `p` rule is
	   unlayered, so it beats Tailwind's utilities no matter the specificity;
	   every value it touches has to be claimed back here. */
	.outro-thanks {
		font-size: 16px !important;
		font-weight: 500 !important;
		line-height: 1.6 !important;
		letter-spacing: -0.12px !important;
		color: var(--color-secondary-fg) !important;
	}
</style>
