<script lang="ts">
	import { themeState, toggleTheme } from '$lib/state/theme.svelte';
	import { playCue } from '$lib/state/sound.svelte';

	/**
	 * A power-strip rocker, lying on its side above the name. Light is ON: the
	 * "I" half is pressed down flat and lit, exactly the way the switch on a
	 * surge protector reads.
	 */
	const on = $derived(themeState.value === 'light');

	function flip() {
		toggleTheme();
		// One cue in both directions: the rocker is the thing that says which
		// way it went, and a pair of cues only argued with it.
		playCue('select');
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
			<span class="ps-face ps-off"><span class="ps-glyph">O</span></span>
			<span class="ps-face ps-on"><span class="ps-glyph">I</span></span>
		</span>
	</span>
</button>

<style>
	.ps {
		position: relative;
		display: block;
		width: 62px;
		height: 42px;
		margin: 0 0 18px;
		padding: 0;
		border: 0;
		background: none;
		border-radius: 15px;
		-webkit-tap-highlight-color: transparent;

		/* Red plastic, in two lighting states: a face angled out toward the
		   room, and a face angled back into the housing. Both halves are the
		   same moulding; only the lamp behind one of them ever changes. */
		--face-out-near: #6e2a22;
		--face-out-far: #491610;
		--face-in-near: #34100c;
		--face-in-far: #1d0705;
		--rim: rgba(255, 255, 255, 0.16);
		--throw: transform 280ms cubic-bezier(0.22, 1.32, 0.36, 1);
		--lamp-fade: opacity 320ms var(--ease-out);
		--shell-hi: #45454d;
		--shell-lo: #212125;
		--shell-edge: rgba(0, 0, 0, 0.7);
		--shell-edge-hi: rgba(255, 255, 255, 0.16);
		--well: #08080a;
		--glyph-out: rgba(255, 226, 219, 0.55);
		--glyph-in: rgba(255, 214, 206, 0.22);
		--drop: rgba(0, 0, 0, 0.6);
		--lamp-hi: #c9291b;
		--lamp-lo: #7d1309;
		--lamp-shade: rgba(74, 6, 2, 0.62);
		/* The recess the lit half drops into is part of the lamp, not the shell. */
		--lamp-well: #4a0702;
		--lamp-glow: rgba(196, 38, 24, 0.42);
		--lamp-glyph: rgba(30, 3, 1, 0.85);
		/* The light the lamp throws across the switch and the surface under it.
		   Dark mode never reaches the lit state, so it is only ever declared. */
		--lamp-bloom-rgb: 255, 74, 52;
		--lamp-bloom-a: 0.3;

		/* Every shadow on the switch is themed. Left as raw black they stayed at
		   dark-mode strength on a light shell, which is what made the thrown
		   rocker read as a hole instead of a bevel. */
		--well-shadow: rgba(0, 0, 0, 0.7);
		--sink-side: rgba(0, 0, 0, 0.5);
		--sink-top: rgba(0, 0, 0, 0.35);
		--seam: rgba(0, 0, 0, 0.8);
		--seam-glow: rgba(0, 0, 0, 0.62);
	}

	:global(html[data-theme='light']) .ps {
		--face-out-near: #8d3327;
		--face-out-far: #6b1f16;
		--face-in-near: #5a1a12;
		--face-in-far: #40100b;
		--rim: rgba(255, 226, 218, 0.52);
		--shell-hi: #f0eeec;
		--shell-lo: #c6c3bf;
		--shell-edge: rgba(0, 0, 0, 0.22);
		--shell-edge-hi: rgba(255, 255, 255, 0.95);
		--well: #5c4a46;
		--glyph-out: rgba(255, 238, 233, 0.8);
		--glyph-in: rgba(255, 228, 221, 0.45);
		--drop: rgba(0, 0, 0, 0.24);
		--lamp-hi: #f4442c;
		--lamp-lo: #b41a0a;
		--lamp-glow: rgba(226, 48, 28, 0.45);
		--lamp-shade: rgba(120, 12, 3, 0.4);
		--lamp-well: #8e1508;
		--lamp-bloom-rgb: 255, 78, 54;
		--lamp-bloom-a: 0.34;

		--well-shadow: rgba(0, 0, 0, 0.26);
		--sink-side: rgba(0, 0, 0, 0.2);
		--sink-top: rgba(0, 0, 0, 0.1);
		--seam: rgba(0, 0, 0, 0.32);
		--seam-glow: rgba(0, 0, 0, 0.3);
	}

	.ps:active {
		transform: scale(0.97);
	}

	/* Lit, the lamp throws light across the whole switch and onto the surface
	   around it. Centred over the thrown half, because that is where the lamp
	   physically is, and falling off to nothing well before the edge. */
	.ps::after {
		content: '';
		position: absolute;
		inset: -20px;
		border-radius: 30px;
		pointer-events: none;
		opacity: 0;
		background: radial-gradient(
			ellipse 54% 52% at 64% 50%,
			rgba(var(--lamp-bloom-rgb), var(--lamp-bloom-a)) 0%,
			rgba(var(--lamp-bloom-rgb), 0) 76%
		);
		transition: var(--lamp-fade);
	}

	.ps.is-on::after {
		opacity: 1;
	}

	.ps:focus-visible {
		outline: 1px solid var(--color-folio-blue);
		outline-offset: 4px;
		border-radius: 16px;
	}

	/* ---- Housing --------------------------------------- */
	.ps-body {
		position: absolute;
		inset: 0;
		border-radius: 14px;
		overflow: hidden;
		background: linear-gradient(162deg, var(--shell-hi), var(--shell-lo));
		box-shadow:
			inset 0 1px 0 0 var(--shell-edge-hi),
			inset 0 0 0 1px var(--shell-edge),
			0 6px 16px -5px var(--drop);
		/* Short focal length: the whole point is visible foreshortening. */
		perspective: 150px;
		perspective-origin: 50% 50%;
		transition: box-shadow 300ms var(--ease-out);
	}

	/* The well the rocker sits down inside. */
	.ps-body::before {
		content: '';
		position: absolute;
		inset: 5px;
		border-radius: 10px;
		background: var(--well);
		box-shadow:
			inset 0 3px 6px var(--well-shadow),
			inset 0 -1px 0 var(--shell-edge-hi);
	}

	.ps.is-on .ps-body {
		box-shadow:
			inset 0 1px 0 0 var(--shell-edge-hi),
			inset 0 0 0 1px var(--shell-edge),
			0 6px 16px -5px var(--drop),
			0 0 26px -6px var(--lamp-glow);
	}

	/* ---- Rocker ---------------------------------------- */
	.ps-rocker {
		position: absolute;
		inset: 6px;
		transform-style: preserve-3d;
		/* Positive = "O" pressed flat. Negative = "I" pressed flat. */
		transform: rotateY(19deg);
		transition: var(--throw);
	}

	.ps.is-on .ps-rocker {
		transform: rotateY(-19deg);
	}

	/*
	 * Two planes hinged down the middle rather than one flat pill. The tent
	 * angle is large enough that the sunk half visibly narrows under
	 * perspective — that foreshortening, not the shading, sells the see-saw.
	 */
	.ps-face {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 300ms var(--ease-out),
			box-shadow 300ms var(--ease-out);
	}

	/* At rest the "O" half lies flat: angled out toward the room, rim along
	   the top edge, and no lamp behind it. */
	.ps-off {
		left: 0;
		transform-origin: right center;
		transform: rotateY(-20deg);
		border-radius: 8px 0 0 8px;
		background: linear-gradient(to bottom, var(--face-out-near), var(--face-out-far));
		box-shadow: inset 0 1px 0 var(--rim);
	}

	/* The "I" half is the one standing up out of the well: the housing shades
	   it, and the hinge wall to its left casts back across it. */
	.ps-on {
		right: 0;
		transform-origin: left center;
		transform: rotateY(20deg);
		border-radius: 0 8px 8px 0;
		background: linear-gradient(to bottom, var(--face-in-near), var(--face-in-far));
		box-shadow:
			inset 3px 0 6px var(--sink-side),
			inset 0 1px 0 var(--sink-top);
	}

	/* The fold. A single dark seam at the hinge does more for the illusion
	   than any amount of gradient work on the faces. */
	.ps-rocker::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		margin-left: -0.5px;
		background: var(--seam);
		box-shadow: 5px 0 9px -1px var(--seam-glow);
		pointer-events: none;
	}

	/* ---- Thrown: "I" flat and lit ---------------------- */
	/* The wire is made on this side, so the lit half is the one pressed down
	   flat and the dead half stands up out of the well. */
	.ps.is-on .ps-body::before {
		background: linear-gradient(
			to right,
			var(--well) 0%,
			var(--well) 44%,
			var(--lamp-well) 56%,
			var(--lamp-well) 100%
		);
	}

	.ps.is-on .ps-rocker::after {
		box-shadow: -5px 0 9px -1px var(--seam-glow);
	}

	.ps.is-on .ps-on {
		/* Lit from directly behind, so the face carries the lamp evenly and
		   only dips where the half standing up beside it overhangs the hinge. */
		background: linear-gradient(to bottom, var(--lamp-hi), var(--lamp-lo));
		box-shadow:
			inset 0 1px 0 var(--rim),
			inset 4px 0 9px var(--lamp-shade);
	}

	.ps.is-on .ps-off {
		background: linear-gradient(to bottom, var(--face-in-near), var(--face-in-far));
		box-shadow:
			inset -3px 0 6px var(--sink-side),
			inset 0 1px 0 var(--sink-top);
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

	.ps-off .ps-glyph {
		color: var(--glyph-out);
	}

	.ps.is-on .ps-off .ps-glyph {
		color: var(--glyph-in);
	}

	.ps.is-on .ps-on .ps-glyph {
		color: var(--lamp-glyph);
	}

	:global(html.is-recolouring) .ps-rocker {
		transition: var(--throw) !important;
	}

	:global(html.is-recolouring) .ps::after {
		transition: var(--lamp-fade) !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.ps-rocker,
		.ps-face,
		.ps-body,
		.ps-glyph,
		.ps::after,
		:global(html.is-recolouring) .ps-rocker,
		:global(html.is-recolouring) .ps::after {
			transition-duration: 1ms !important;
		}
	}
</style>
