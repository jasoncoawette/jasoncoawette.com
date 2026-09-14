<script lang="ts">
	import { Gate, PowerSwitch, RailPath, TimelineEntry } from '$lib';
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
		<p class="intro-role">Designing and building beautiful software</p>
		<p class="folio-lede">Every linked project below is live. I'd rather show than tell.</p>
		<p class="folio-sub">
			Communication matters as much as technical ability: listen first, explain simply, and help
			technical and nontechnical people understand each other.
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
			<blockquote>"Jason consistently makes sound decisions that scale."</blockquote>
			<p>&#8212; &#160; Dr. Ray Hsu</p>
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

	.folio-outro blockquote {
		font-size: 17px !important;
		font-style: italic;
		color: var(--color-folio-body) !important;
	}

	.folio-outro p {
		font-size: 14px !important;
		color: var(--color-folio-mute) !important;
	}
</style>
