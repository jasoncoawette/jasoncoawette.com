<script lang="ts">
	import { gateState } from '$lib/state/gate.svelte';
	import { primeAudio, startAudio } from '$lib/state/sound.svelte';
	import { shine } from '$lib';
	import portrait from '$lib/assets/jason.webp';

	/**
	 * Three beats, and the sound is cut to them: the ring sweeps the border on
	 * while the cue's three notes rise, the ring seals on the last one, then the
	 * portal opens through the viewer. The page behind starts revealing at the
	 * top of the pull rather than at the end of it — that overlap is the whole
	 * trick, because a fade that begins after the zoom reads as two moves.
	 */
	const RING_MS = 720;
	const SEAL_MS = 90;
	const PULL_MS = 780;

	type Phase = 'idle' | 'sealing' | 'pulling' | 'done';

	let phase = $state<Phase>('idle');
	let loaded = $state(false);

	/** Send focus to the only control on the screen as soon as it exists. */
	const autofocus = (node: HTMLElement) => node.focus();

	/** A cached portrait can finish decoding before the load handler is bound. */
	const trackDecode = (node: Element) => {
		if ((node as HTMLImageElement).complete) loaded = true;
	};

	function release() {
		document.documentElement.classList.remove('is-covered');
		document.documentElement.classList.add('is-entering');
		gateState.entered = true;
	}

	function finish() {
		document.documentElement.classList.remove('is-entering');
		phase = 'done';
	}

	function enter() {
		if (phase !== 'idle') return;

		// Synchronous, still inside the gesture tick: this is what actually
		// unlocks Web Audio. Everything after it may safely be async.
		primeAudio();
		startAudio();

		// No sweep and no travel to sit through: hand the page over at once.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			phase = 'pulling';
			release();
			setTimeout(finish, 200);
			return;
		}

		phase = 'sealing';
		setTimeout(() => {
			phase = 'pulling';
			release();
			setTimeout(finish, PULL_MS);
		}, RING_MS + SEAL_MS);
	}
</script>

{#if phase !== 'done'}
	<div
		class="gate"
		data-phase={phase}
		style="--ring-ms: {RING_MS}ms; --seal-ms: {SEAL_MS}ms; --pull-ms: {PULL_MS}ms"
	>
		<div class="gate-inner">
			<div class="portal">
				<svg class="portal-ring" viewBox="0 0 120 120" aria-hidden="true">
					<circle class="ring-track" cx="60" cy="60" r="57" />
					<circle class="ring-draw" cx="60" cy="60" r="57" pathLength="1" />
					<circle class="ring-head" cx="60" cy="3" r="2.4" />
				</svg>

				<div class="portal-photo">
					<img
						src={portrait}
						alt="Jason Coawette"
						width="512"
						height="512"
						class:is-loaded={loaded}
						fetchpriority="high"
						decoding="async"
						draggable="false"
						onload={() => (loaded = true)}
						{@attach trackDecode}
					/>
				</div>

				<span class="portal-bloom" aria-hidden="true"></span>
			</div>

			<p class="gate-name">Jason Coawette</p>
			<p class="gate-role">Designing and building beautiful software</p>

			<button
				class="glass btn-text btn-scale gate-btn"
				onclick={enter}
				use:shine
				{@attach autofocus}
			>
				Enter
			</button>
		</div>
	</div>
{/if}

<style>
	.gate {
		--ring-ease: cubic-bezier(0.5, 0.04, 0.22, 1);
	}

	.gate-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	/* ---- Portrait + ring ------------------------------- */
	.portal {
		position: relative;
		width: 148px;
		height: 148px;
		margin-bottom: 26px;
		animation: portalIn 640ms var(--ease-out) 60ms backwards;
	}

	.portal-ring {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.ring-track {
		fill: none;
		stroke: var(--color-folio-rule);
		stroke-width: 1;
	}

	/* Drawn, not shown: at rest the border is only the unlit track above. */
	.ring-draw {
		fill: none;
		stroke: var(--color-folio-blue);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transform: rotate(-90deg);
		transform-origin: 60px 60px;
		transform-box: view-box;
	}

	/* The tip of the stroke, carried around on the same curve so the two never
	   drift apart. */
	.ring-head {
		fill: var(--color-folio-blue);
		opacity: 0;
		transform-origin: 60px 60px;
		transform-box: view-box;
		filter: drop-shadow(0 0 5px rgba(var(--path-blue-rgb), 0.7));
	}

	.portal-photo {
		position: absolute;
		inset: 12px;
		border-radius: 999px;
		overflow: hidden;
		box-shadow:
			0 10px 30px -12px var(--color-shadow),
			inset 0 0 0 1px var(--keyline);
		/* A 20px render of the same crop, so the circle is never a hole and the
		   real file has nothing to pop against. */
		background-image: url('data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAACQBQCdASoUABQAPsFUoEynpKKiKA1Q8BgJQBOmUFGwDyUEQR/AF8Q6AWTRaZK01y/lrX+KAAD+i+Z3FiTGhMm+VRnQ12llt2CZ5VcNN/vrcmMicP3bWc5J0KlkKSuLkL+0sS0rOrrB9duVo/1eqosF8Q2pvOnKHGCaxxhAV15NnraSe4SrLm6vmceRsYjwY/bauIOGk+J3QGIkvF+kDr9jnS+9fSvP3+b3vrIGsXVmP5D72vq3Uccu2tQO42H7Ozh97ozsJbM+ms3A4lcqxCL6YAA=');
		background-size: cover;
	}

	.portal-photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 320ms ease;
	}

	.portal-photo img.is-loaded {
		opacity: 1;
	}

	/* Fires once, on the frame the ring closes. */
	.portal-bloom {
		position: absolute;
		inset: 3px;
		border: 1px solid var(--color-folio-blue);
		border-radius: 999px;
		opacity: 0;
		pointer-events: none;
	}

	/* ---- Copy ------------------------------------------ */
	.gate-name {
		font-size: 16px !important;
		font-weight: 500 !important;
		letter-spacing: -0.12px;
		color: var(--color-folio-ink) !important;
		animation: riseIn 500ms var(--ease-out) 420ms backwards;
	}

	.gate-role {
		margin-top: 2px;
		font-family: var(--folio-mono);
		font-size: 11px !important;
		letter-spacing: 1.84px;
		text-transform: uppercase;
		color: var(--color-folio-mute) !important;
		animation: riseIn 500ms var(--ease-out) 500ms backwards;
	}

	/* Filled rather than glass: focus lands here the moment the gate mounts, so
	   the control should already look like the one thing on screen to press. */
	.gate-btn {
		margin-top: 30px;
		background: linear-gradient(
			135deg,
			var(--color-folio-blue) 0%,
			oklch(from var(--color-folio-blue) calc(l - 0.07) c h) 100%
		);
		border-color: oklch(from var(--color-folio-blue) calc(l + 0.1) c h / 0.7);
		color: oklch(98.5% 0 0);
		animation: riseIn 500ms var(--ease-out) 620ms backwards;
	}

	/* The fill is the focus signal now; the global ring outside it would only
	   read as a second border. */
	.gate-btn:focus-visible {
		outline: none;
	}

	/* The glass shine is a white wash, which all but vanishes over a saturated
	   fill. A lighter tint of the button's own blue is the one that reads. The
	   far stop is the same hue at zero alpha rather than `transparent`, which
	   would fade out through black and grey the edge of the bloom. */
	.gate-btn::after {
		background: radial-gradient(
			circle 62px at var(--mx) var(--my),
			oklch(from var(--color-folio-blue) calc(l + 0.35) calc(c * 0.5) h / 0.5) 0%,
			oklch(from var(--color-folio-blue) calc(l + 0.2) c h / 0) 60%
		);
	}

	/* ---- Sealing: the border loads -------------------- */
	.gate[data-phase='sealing'] .ring-draw {
		animation: ringDraw var(--ring-ms) var(--ring-ease) forwards;
	}

	.gate[data-phase='sealing'] .ring-head {
		animation: ringHead var(--ring-ms) var(--ring-ease) forwards;
	}

	.gate[data-phase='sealing'] .portal-bloom {
		animation: bloom 420ms var(--ease-out) var(--ring-ms) forwards;
	}

	/* Leaning in a fraction before the pull takes over. */
	.gate[data-phase='sealing'] .portal {
		animation: portalCharge calc(var(--ring-ms) + var(--seal-ms)) var(--ease-out) forwards;
	}

	/* The control has done its job; the ring is the progress now. */
	.gate[data-phase='sealing'] .gate-btn {
		animation: controlAway 300ms ease forwards;
		pointer-events: none;
	}

	/* ---- Pulling: through the portal ------------------ */
	.gate[data-phase='pulling'] {
		pointer-events: none;
		animation: gateDissolve var(--pull-ms) cubic-bezier(0.42, 0, 1, 1) forwards;
	}

	.gate[data-phase='pulling'] .portal {
		animation: portalPull var(--pull-ms) cubic-bezier(0.55, 0, 0.3, 1) forwards;
	}

	.gate[data-phase='pulling'] .ring-draw {
		stroke-dashoffset: 0;
		transform: rotate(-90deg);
	}

	.gate[data-phase='pulling'] .gate-name,
	.gate[data-phase='pulling'] .gate-role {
		animation: copyAway 320ms cubic-bezier(0.42, 0, 1, 1) forwards;
	}

	/* Already gone during the sweep. Left in the exit set it would have been
	   handed a fresh animation starting from opaque, and flashed back on. */
	.gate[data-phase='pulling'] .gate-btn {
		opacity: 0;
		animation: none;
	}

	@keyframes portalIn {
		from {
			opacity: 0;
			filter: blur(10px);
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: scale(1);
		}
	}

	@keyframes ringDraw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes ringHead {
		0% {
			opacity: 0;
			transform: rotate(0deg);
		}
		12% {
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: rotate(360deg);
		}
	}

	@keyframes bloom {
		from {
			opacity: 0.55;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(1.22);
		}
	}

	@keyframes portalCharge {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.035);
		}
	}

	@keyframes portalPull {
		from {
			transform: scale(1.035);
			filter: blur(0);
		}
		to {
			transform: scale(6.5);
			filter: blur(7px);
		}
	}

	@keyframes gateDissolve {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes controlAway {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@keyframes copyAway {
		from {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
		to {
			opacity: 0;
			filter: blur(5px);
			transform: translateY(8px);
		}
	}

	@keyframes riseIn {
		from {
			opacity: 0;
			filter: blur(4px);
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}

	@media (max-width: 480px) {
		.portal {
			width: 124px;
			height: 124px;
			margin-bottom: 22px;
		}

		.portal-photo {
			inset: 10px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.portal,
		.gate-name,
		.gate-role,
		.gate-btn {
			animation-duration: 1ms;
			animation-delay: 0ms;
		}

		.portal-photo img {
			transition-duration: 1ms;
		}

		.gate[data-phase='pulling'] {
			animation-duration: 200ms;
		}

		.gate[data-phase='pulling'] .portal {
			animation: none;
		}
	}
</style>
