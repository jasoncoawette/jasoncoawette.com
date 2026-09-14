<script lang="ts">
	/** Phoenix does not observe DST, so this stays honest year round. */
	const format = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		timeZone: 'America/Phoenix'
	});

	// Null until mounted: the server has no business guessing the time, and an
	// SSR'd value would only be wrong by the time it reached anyone.
	let now = $state<Date | null>(null);
	const clock = $derived(now ? format.format(now) : '');

	$effect(() => {
		now = new Date();
		const id = setInterval(() => (now = new Date()), 10_000);
		return () => clearInterval(id);
	});
</script>

<aside class="ident">
	<span class="ident-rail" aria-hidden="true"></span>
	<div class="ident-lines">
		<p class="ident-name">Jason Coawette</p>
		<p>Phoenix, AZ</p>
		<p aria-hidden="true">33.45&deg; N, 112.07&deg; W</p>
		<p class="sr-only">33.45 degrees north, 112.07 degrees west</p>
		<p>{clock}</p>
	</div>
</aside>

<style>
	.ident {
		position: fixed;
		top: 96px;
		left: clamp(24px, calc((100vw - var(--folio-col-w)) / 2 - 306px), 72px);
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 22px;
		pointer-events: none;
	}

	/* A field of dots rather than a line — it reads as texture, not as a second rail. */
	.ident-rail {
		align-self: stretch;
		width: 8px;
		flex-shrink: 0;
		background-image: radial-gradient(
			circle at 0.8px 0.8px,
			var(--color-folio-rule) 0.8px,
			transparent 0.9px
		);
		background-size: 3.2px 3.6px;
	}

	.ident-lines {
		padding: 12px 0;
	}

	.ident-lines p {
		font-family: var(--folio-mono);
		font-weight: 500;
		font-size: 11px !important;
		line-height: 1.8 !important;
		letter-spacing: 1.84px;
		text-transform: uppercase;
		color: var(--color-folio-mute) !important;
		white-space: nowrap;
	}

	.ident-name {
		color: var(--color-folio-ink) !important;
	}

	/* Below this the fixed column starts colliding with the content. */
	@media (max-width: 1180px) {
		.ident {
			display: none;
		}
	}
</style>
