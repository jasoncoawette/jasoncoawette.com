<script lang="ts">
	import type { EntryLink } from '$lib/data/experience';
	import { playCloseCue, playOpenCue } from '$lib/state/sound.svelte';

	let {
		links,
		fallbackIcon,
		noun = 'projects'
	}: {
		links: EntryLink[];
		/** Sites with no favicon of their own borrow the org's mark. */
		fallbackIcon?: string;
		/** What this entry's links are. Awards are not projects. */
		noun?: string;
	} = $props();

	let open = $state(false);

	/** One link is not a deck — there is nothing to shuffle open. */
	const stacked = $derived(links.length > 1);

	/** Two peeking layers is the most that still reads as a stack. */
	const peeks = $derived(Math.min(links.length - 1, 2));

	/** Opening borrows the gate's rise; folding back up gets its mirror. */
	function shuffle(next: boolean) {
		if (next) playOpenCue();
		else playCloseCue();
		open = next;
	}

	/**
	 * The deck swaps one child for a much taller one, which would otherwise
	 * snap the whole column below it down in a single frame. This animates the
	 * outer box between the two heights so the page opens downward instead.
	 *
	 * The observer watches the inner body, never the box being animated —
	 * watching the latter feeds every animated frame back in as a fresh resize
	 * and the run tears itself apart. Overflow is clipped only while it runs;
	 * at rest the closed stack's peeking layers sit outside the box.
	 */
	function growSmoothly(node: HTMLElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const body = node.querySelector<HTMLElement>('.deck-body');
		if (!body) return;

		let previous = body.offsetHeight;
		let running: Animation | null = null;

		const observer = new ResizeObserver(() => {
			const next = body.offsetHeight;
			if (next === previous) return;
			const from = previous;
			previous = next;

			running?.cancel();
			node.style.overflow = 'hidden';
			const anim = node.animate([{ height: `${from}px` }, { height: `${next}px` }], {
				duration: 340,
				easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
			});
			running = anim;
			anim.finished
				.catch(() => {})
				.finally(() => {
					// A newer run may already own the clip; only the last clears it.
					if (running === anim) node.style.overflow = '';
				});
		});

		observer.observe(body);
		return () => {
			observer.disconnect();
			running?.cancel();
		};
	}
</script>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<div class="deck" {@attach growSmoothly}>
	<div class="deck-body">
		{#if stacked && !open}
			<button
				class="stack"
				type="button"
				data-peeks={peeks}
				aria-expanded="false"
				aria-label="Show {links.length} {noun}"
				onclick={() => shuffle(true)}
			>
				<span class="card-inner">
					<span class="fan" aria-hidden="true">
						{#each links as link (link.href)}
							<span class="app-icon chip">
								<img src={link.icon ?? fallbackIcon} alt="" />
							</span>
						{/each}
					</span>
					<span class="body">
						<span class="title">{links.length} {noun}</span>
						<span class="lede">Open the stack to see each one.</span>
					</span>
				</span>
			</button>
		{:else}
			<div class="cards">
				{#each links as link, i (link.href)}
					<a
						class="card"
						style="--i: {i}"
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						onclick={playOpenCue}
					>
						<span class="app-icon chip" aria-hidden="true">
							<img src={link.icon ?? fallbackIcon} alt="" />
						</span>
						<span class="body">
							<span class="title">{link.title ?? link.label}</span>
							<span class="host">{link.label}</span>
						</span>
					</a>
				{/each}

				{#if stacked}
					<button
						class="fold"
						style="--i: {links.length}"
						type="button"
						aria-expanded="true"
						onclick={() => shuffle(false)}
					>
						Restack
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.deck {
		margin: 14px 0 0;
		/*
		 * The stacked favicons cast their own shadow rather than using
		 * --color-shadow, because the separation between two overlapping white
		 * marks depends on it. Light mode needs far less of it: the page is
		 * already pale, so the same value reads as grime.
		 */
		--chip-cast: 0.3;
	}

	:global(html[data-theme='light']) .deck {
		--chip-cast: 0.13;
	}

	/* Holds its natural height while the box around it is being animated. */
	.deck-body {
		display: flow-root;
	}

	/* ---- Shared card shell ----------------------------- */
	.stack,
	.card {
		position: relative;
		/* Hinged at the left edge, so the tilt reads as the card lifting away
		   from the column rather than sliding off it. */
		transform-origin: left center;
		display: block;
		width: 100%;
		max-width: 360px;
		padding: 0;
		border: 0;
		border-radius: 12px;
		background: none;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 220ms var(--ease-out),
			transform 220ms var(--ease-out);
	}

	.card-inner,
	.card {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.card-inner {
		position: relative;
		z-index: 2;
		padding: 8px 10px;
		border-radius: 12px;
		--card-surface: var(--surface-card-rest);
		background: var(--card-surface);
		box-shadow: 0 6px 16px -10px var(--color-shadow);
		transition: background-color 220ms var(--ease-out);
	}

	.card {
		padding: 8px 10px;
	}

	/* The whole point of the layered look: a slightly darker well opens up
	   under the pointer rather than a hard outline. */
	.card:hover,
	.card:focus-visible {
		background: var(--surface-card-hover);
		transform: rotate(-0.5deg) translateX(2px);
	}

	.stack:hover .card-inner {
		--card-surface: var(--surface-card-hover);
	}

	.deck .stack:hover {
		transform: rotate(-0.5deg) translateY(-1px);
	}

	.stack:focus-visible,
	.card:focus-visible,
	.fold:focus-visible {
		outline: 1px solid var(--color-folio-blue);
		outline-offset: 3px;
	}

	/* ---- The peeking layers ---------------------------- */
	.stack::before,
	.stack::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0;
		height: 12px;
		border-radius: 12px;
		background: var(--surface-card-rest);
		transform: translate(-50%, var(--drop));
		transition: transform 220ms var(--ease-out);
	}

	/* Nearest layer first, so the stack reads back-to-front. */
	.stack::after {
		--drop: 4px;
		z-index: 1;
		width: calc(100% - 14px);
		opacity: 0.85;
	}

	.stack::before {
		--drop: 8px;
		z-index: 0;
		width: calc(100% - 28px);
		opacity: 0.6;
	}

	.stack[data-peeks='1']::before {
		display: none;
	}

	.stack:hover::after {
		transform: translate(-50%, calc(var(--drop) + 2px));
	}

	.stack:hover::before {
		transform: translate(-50%, calc(var(--drop) + 4px));
	}

	/* ---- Overlapped favicons on the closed stack ------- */
	.fan {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.fan .chip + .chip {
		margin-left: -8px;
	}

	.chip {
		--icon-px: 28px;
		border: 0;
	}

	/*
	 * Bigger on the closed stack, and each one ringed in the card's own colour
	 * so the overlap reads as separate cards rather than one smeared shape.
	 * The ring is a shadow, not a border, so it follows the squircle corner and
	 * costs the icon no interior space. It carries its own black rather than
	 * --color-shadow: in light mode that token is far too faint to hold two
	 * white favicons apart, and the cast is the only thing separating them. It
	 * also has to clear the ring, which is painted over it.
	 */
	.fan .chip {
		--icon-px: 28px;
		/*
		 * Explicit, because the rotate below would otherwise promote the back
		 * chip into the positioned-paint phase and float it over its
		 * neighbours — taking the cast shadow that separates them with it.
		 */
		position: relative;
		z-index: 1;
		box-shadow:
			-5px 2px 7px -2px oklch(0 0 0 / var(--chip-cast)),
			0 6px 14px -7px oklch(0 0 0 / var(--chip-cast));
		transition: transform 260ms var(--ease-out);
	}

	/* The one at the back sits off-square, the way a dropped stack settles. */
	.fan .chip:first-child {
		z-index: 0;
		transform: rotate(-6deg);
	}

	/* Under the pointer the stack spreads, each card swinging further out than
	   the one in front of it. */
	.stack:hover .fan .chip:first-child {
		transform: rotate(-12deg) translateX(-3px);
	}

	.stack:hover .fan .chip:nth-child(2) {
		transform: rotate(4deg) translateX(2px);
	}

	.stack:hover .fan .chip:nth-child(3) {
		transform: rotate(10deg) translateX(5px);
	}

	/* ---- Card text ------------------------------------- */
	.body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
	}

	.title {
		max-width: 100%;
		font-weight: 500;
		font-size: 14px;
		line-height: 1.4;
		letter-spacing: -0.12px;
		color: var(--color-folio-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/*
	 * The stack's own second line is a sentence, not a hostname, so it reads in
	 * the body face at regular weight rather than the mono caption the opened
	 * cards carry under their titles.
	 */
	.lede {
		max-width: 100%;
		font-size: 12.5px;
		font-weight: 400;
		line-height: 1.5;
		letter-spacing: -0.1px;
		color: var(--color-folio-mute);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.host {
		max-width: 100%;
		font-family: var(--folio-mono);
		font-size: 10px;
		line-height: 1.5;
		letter-spacing: 0.6px;
		color: var(--color-folio-mute);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ---- Opened deck ----------------------------------- */
	.cards {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
	}

	.cards .card,
	.fold {
		animation: cardIn 300ms var(--ease-out) both;
		animation-delay: calc(var(--i) * 45ms);
	}

	.fold {
		margin-top: 6px;
		padding: 5px 12px;
		border: 0;
		border-radius: 999px;
		background: var(--surface-card-rest);
		font-family: var(--folio-mono);
		font-size: 10px;
		line-height: 1.5;
		letter-spacing: 0.9px;
		text-transform: uppercase;
		color: var(--color-folio-mute);
		cursor: pointer;
		transition:
			background-color 200ms var(--ease-out),
			color 200ms var(--ease-out),
			transform 200ms var(--ease-out);
	}

	.fold:hover {
		background: var(--surface-card-hover);
		color: var(--color-folio-ink);
		transform: translateY(-1px);
	}

	@keyframes cardIn {
		from {
			opacity: 0;
			filter: blur(3px);
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cards .card,
		.fold {
			animation-duration: 1ms;
			animation-delay: 0ms;
		}

		.card:hover,
		.card:focus-visible,
		.deck .stack:hover,
		.stack:hover .fan .chip {
			transform: none;
		}
	}
</style>
