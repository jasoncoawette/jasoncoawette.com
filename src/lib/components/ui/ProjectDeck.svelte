<script lang="ts">
	import type { EntryLink } from '$lib/data/experience';

	let {
		links,
		fallbackIcon,
		label
	}: {
		links: EntryLink[];
		/** Sites with no favicon of their own borrow the org's mark. */
		fallbackIcon?: string;
		/** Names the deck for screen readers, e.g. "Stratus Ventures". */
		label: string;
	} = $props();

	let open = $state(false);

	/** One link is not a deck — there is nothing to shuffle open. */
	const stacked = $derived(links.length > 1);

	/** Two peeking layers is the most that still reads as a stack. */
	const peeks = $derived(Math.min(links.length - 1, 2));
</script>

<svelte:window
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<div class="deck">
	{#if stacked && !open}
		<button
			class="stack"
			type="button"
			data-peeks={peeks}
			aria-expanded="false"
			aria-label="Show {links.length} {label} projects"
			onclick={() => (open = true)}
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
					<span class="title">{links.length} projects</span>
					<span class="host">Open the stack</span>
				</span>
			</span>
		</button>
	{:else}
		<div class="cards">
			{#each links as link, i (link.href)}
				<a class="card" style="--i: {i}" href={link.href} target="_blank" rel="noopener noreferrer">
					<span class="app-icon chip" aria-hidden="true">
						<img src={link.icon ?? fallbackIcon} alt="" />
					</span>
					<span class="body">
						<span class="title-row">
							<span class="title">{link.title ?? link.label}</span>
							<span class="ne" aria-hidden="true">&nearrow;</span>
						</span>
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
					onclick={() => (open = false)}
				>
					Stack
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.deck {
		margin: 14px 0 0;
	}

	/* ---- Shared card shell ----------------------------- */
	.stack,
	.card {
		position: relative;
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
	}

	.stack:hover .card-inner {
		--card-surface: var(--surface-card-hover);
	}

	.deck .stack:hover {
		transform: translateY(-1px);
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
		--icon-px: 22px;
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
		--icon-px: 26px;
		/*
		 * Explicit, because the rotate below would otherwise promote the back
		 * chip into the positioned-paint phase and float it over its
		 * neighbours — taking the cast shadow that separates them with it.
		 */
		position: relative;
		z-index: 1;
		box-shadow:
			0 0 0 3px var(--card-surface),
			-5px 2px 7px -2px oklch(0 0 0 / 0.26),
			0 6px 14px -7px oklch(0 0 0 / 0.28);
		transition: box-shadow 220ms var(--ease-out);
	}

	/* The one at the back sits off-square, the way a dropped stack settles. */
	.fan .chip:first-child {
		z-index: 0;
		transform: rotate(-6deg);
	}

	/* ---- Card text ------------------------------------- */
	.body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
	}

	.title-row {
		display: flex;
		align-items: baseline;
		max-width: 100%;
	}

	.ne {
		margin-left: 4px;
		flex-shrink: 0;
		font-size: 11px;
		line-height: 1;
		color: var(--color-secondary-fg);
	}

	.title {
		max-width: 100%;
		font-weight: 500;
		font-size: 13px;
		line-height: 1.4;
		letter-spacing: -0.12px;
		color: var(--color-folio-ink);
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
		margin-top: 2px;
		padding: 2px 4px;
		border: 0;
		background: none;
		font-family: var(--folio-mono);
		font-size: 10px;
		line-height: 1.5;
		letter-spacing: 0.6px;
		text-transform: uppercase;
		color: var(--color-folio-rule);
		cursor: pointer;
		border-radius: 4px;
		transition: color 200ms var(--ease-out);
	}

	.fold:hover {
		color: var(--color-folio-mute);
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
	}
</style>
