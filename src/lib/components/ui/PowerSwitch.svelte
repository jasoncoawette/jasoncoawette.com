<script lang="ts">
	import { themeState, toggleTheme } from '$lib/state/theme.svelte';
	import { playCue } from '$lib/state/sound.svelte';

	/**
	 * A power-strip rocker. Light is ON: the "I" half is pressed in and lit,
	 * exactly the way the switch on a surge protector reads.
	 */
	const on = $derived(themeState.value === 'light');

	function flip() {
		const next = toggleTheme();
		playCue(next === 'light' ? 'toggle-on' : 'toggle-off');
	}
</script>

<button
	class="ps"
	class:is-on={on}
	type="button"
	role="switch"
	aria-checked={on}
	aria-label="Light mode"
	onclick={flip}
>
	<span class="ps-body">
		<span class="ps-rocker">
			<span class="ps-face ps-up"><span class="ps-glyph">I</span></span>
			<span class="ps-face ps-down"><span class="ps-glyph">O</span></span>
		</span>
	</span>
</button>

<style>
	.ps {
		position: fixed;
		right: 20px;
		bottom: 20px;
		/* Above the layout's bottom progressive blur, which sits at 10. */
		z-index: 40;
		display: block;
		width: 48px;
		height: 72px;
		padding: 0;
		border: 0;
		background: none;
		border-radius: 11px;
		-webkit-tap-highlight-color: transparent;

		/* Plastic, in two lighting states: a face angled out toward the room,
		   and a face angled back into the housing. */
		--face-out-near: #5a5a65;
		--face-out-far: #34343c;
		--face-in-near: #2e2e36;
		--face-in-far: #17171b;
		--rim: rgba(255, 255, 255, 0.16);
		--shell-hi: #45454d;
		--shell-lo: #212125;
		--shell-edge: rgba(0, 0, 0, 0.7);
		--shell-edge-hi: rgba(255, 255, 255, 0.16);
		--well: #08080a;
		--glyph-out: rgba(255, 255, 255, 0.5);
		--glyph-in: rgba(255, 255, 255, 0.22);
		--drop: rgba(0, 0, 0, 0.6);
		--lamp-hi: #ffa855;
		--lamp-lo: #c4500d;
		--lamp-glow: rgba(255, 150, 70, 0.55);
	}

	:global(html[data-theme='light']) .ps {
		--face-out-near: #fdfcfb;
		--face-out-far: #dbd7d3;
		--face-in-near: #c9c5c1;
		--face-in-far: #a09c98;
		--rim: rgba(255, 255, 255, 0.85);
		--shell-hi: #f0eeec;
		--shell-lo: #c6c3bf;
		--shell-edge: rgba(0, 0, 0, 0.22);
		--shell-edge-hi: rgba(255, 255, 255, 0.95);
		--well: #9b9793;
		--glyph-out: rgba(0, 0, 0, 0.5);
		--glyph-in: rgba(0, 0, 0, 0.3);
		--drop: rgba(0, 0, 0, 0.24);
	}

	.ps:active {
		transform: scale(0.97);
	}

	.ps:focus-visible {
		outline: 1px solid var(--color-folio-blue);
		outline-offset: 4px;
		border-radius: 12px;
	}

	/* ---- Housing --------------------------------------- */
	.ps-body {
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: linear-gradient(162deg, var(--shell-hi), var(--shell-lo));
		box-shadow:
			inset 0 1px 0 0 var(--shell-edge-hi),
			inset 0 0 0 1px var(--shell-edge),
			0 6px 16px -5px var(--drop);
		/* Short focal length: the whole point is visible foreshortening. */
		perspective: 130px;
		perspective-origin: 50% 50%;
		transition: box-shadow 300ms var(--ease-out);
	}

	/* The well the rocker sits down inside. */
	.ps-body::before {
		content: '';
		position: absolute;
		inset: 5px;
		border-radius: 6px;
		background: var(--well);
		box-shadow:
			inset 0 3px 6px rgba(0, 0, 0, 0.7),
			inset 0 -1px 0 var(--shell-edge-hi);
	}

	.ps.is-on .ps-body {
		box-shadow:
			inset 0 1px 0 0 var(--shell-edge-hi),
			inset 0 0 0 1px var(--shell-edge),
			0 6px 16px -5px var(--drop),
			0 0 24px -4px var(--lamp-glow);
	}

	/* ---- Rocker ---------------------------------------- */
	.ps-rocker {
		position: absolute;
		inset: 6px;
		transform-style: preserve-3d;
		/* Negative = "O" pressed in. Positive = "I" pressed in. */
		transform: rotateX(-16deg);
		transition: transform 280ms cubic-bezier(0.22, 1.32, 0.36, 1);
	}

	.ps.is-on .ps-rocker {
		transform: rotateX(16deg);
	}

	/*
	 * Two planes hinged in the middle rather than one flat pill. The tent angle
	 * is large enough that the sunk half visibly shortens under perspective —
	 * that foreshortening, not the shading, is what sells the see-saw.
	 */
	.ps-face {
		position: absolute;
		left: 0;
		right: 0;
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 300ms var(--ease-out),
			box-shadow 300ms var(--ease-out);
	}

	.ps-up {
		top: 0;
		transform-origin: bottom center;
		transform: rotateX(20deg);
		border-radius: 4px 4px 0 0;
		background: linear-gradient(to top, var(--face-out-far), var(--face-out-near));
		box-shadow: inset 0 1px 0 var(--rim);
	}

	.ps-down {
		bottom: 0;
		transform-origin: top center;
		transform: rotateX(-20deg);
		border-radius: 0 0 4px 4px;
		background: linear-gradient(to bottom, var(--face-in-near), var(--face-in-far));
		box-shadow:
			inset 0 2px 5px rgba(0, 0, 0, 0.5),
			inset 0 -1px 0 var(--rim);
	}

	/* The fold. A single dark seam at the hinge does more for the illusion
	   than any amount of gradient work on the faces. */
	.ps-rocker::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		margin-top: -0.5px;
		background: rgba(0, 0, 0, 0.8);
		box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.55);
		pointer-events: none;
	}

	/* ---- Thrown: "I" sunk and lit ---------------------- */
	.ps.is-on .ps-up {
		/* Darker at the far (top) edge, brighter toward the hinge. */
		background: linear-gradient(to bottom, var(--lamp-lo), var(--lamp-hi));
		box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.5);
	}

	.ps.is-on .ps-down {
		background: linear-gradient(to bottom, var(--face-out-far), var(--face-out-near));
		box-shadow: inset 0 -1px 0 var(--rim);
	}

	/* ---- Glyphs ---------------------------------------- */
	.ps-glyph {
		font-family: var(--folio-mono);
		font-size: 12px;
		font-weight: 600;
		line-height: 1;
		color: var(--glyph-in);
		transition: color 300ms var(--ease-out);
		user-select: none;
	}

	.ps-up .ps-glyph {
		color: var(--glyph-out);
	}

	.ps.is-on .ps-up .ps-glyph {
		color: rgba(60, 20, 0, 0.75);
	}

	.ps.is-on .ps-down .ps-glyph {
		color: var(--glyph-out);
	}

	@media (prefers-reduced-motion: reduce) {
		.ps-rocker,
		.ps-face,
		.ps-body,
		.ps-glyph {
			transition-duration: 1ms;
		}
	}
</style>
