<script lang="ts">
	import { gateState } from '$lib/state/gate.svelte';
	import { primeAudio, startAudio } from '$lib/state/sound.svelte';
	import { shine } from '$lib';

	let leaving = $state(false);

	/** Send focus to the only control on the screen as soon as it exists. */
	const autofocus = (node: HTMLElement) => node.focus();

	function enter() {
		if (leaving) return;

		// Synchronous, still inside the gesture tick: this is what actually
		// unlocks Web Audio. Everything after it may safely be async.
		primeAudio();
		startAudio();

		leaving = true;
		document.documentElement.classList.remove('is-covered');
		setTimeout(() => (gateState.entered = true), 340);
	}
</script>

{#if !gateState.entered}
	<div class="gate" class:is-leaving={leaving}>
		<div class="gate-inner">
			<svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
				<circle class="mark-ring" cx="50" cy="50" r="38" pathLength="1" />
				<circle class="mark-node" cx="50" cy="12" r="3.2" />
				<text class="mark-text" x="50" y="50" text-anchor="middle" dominant-baseline="central"
					>JC</text
				>
			</svg>

			<p class="gate-name">Jason Coawette</p>
			<p class="gate-role">Forward Deployed Engineer</p>

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
	.gate-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.mark {
		width: 72px;
		height: 72px;
		margin-bottom: 22px;
		overflow: visible;
	}

	.mark-ring {
		fill: none;
		stroke: var(--color-folio-rule);
		stroke-width: 1;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: markDraw 900ms var(--ease-out) 80ms forwards;
	}

	.mark-node {
		fill: var(--color-folio-blue);
		opacity: 0;
		filter: drop-shadow(0 0 4px rgba(var(--path-blue-rgb), 0.6));
		animation: markNode 400ms var(--ease-out) 900ms forwards;
	}

	.mark-text {
		fill: var(--color-folio-ink);
		font-family: inherit;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: 1px;
		opacity: 0;
		animation: riseIn 500ms var(--ease-out) 320ms forwards;
	}

	.gate-name {
		font-size: 16px !important;
		font-weight: 500 !important;
		letter-spacing: -0.12px;
		color: var(--color-folio-ink) !important;
		opacity: 0;
		animation: riseIn 500ms var(--ease-out) 420ms forwards;
	}

	.gate-role {
		margin-top: 2px;
		font-family: var(--folio-mono);
		font-size: 11px !important;
		letter-spacing: 1.84px;
		text-transform: uppercase;
		color: var(--color-folio-mute) !important;
		opacity: 0;
		animation: riseIn 500ms var(--ease-out) 500ms forwards;
	}

	.gate-btn {
		margin-top: 30px;
		color: var(--color-folio-ink);
		opacity: 0;
		animation: riseIn 500ms var(--ease-out) 620ms forwards;
	}

	@keyframes markDraw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes markNode {
		to {
			opacity: 1;
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

	@media (prefers-reduced-motion: reduce) {
		.mark-ring,
		.mark-node,
		.mark-text,
		.gate-name,
		.gate-role,
		.gate-btn {
			animation-duration: 1ms;
			animation-delay: 0ms;
		}
	}
</style>
