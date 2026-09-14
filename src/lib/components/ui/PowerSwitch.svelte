<script lang="ts">
	import { themeState, toggleTheme } from '$lib/state/theme.svelte';
	import { playCue } from '$lib/state/sound.svelte';

	/**
	 * A power-strip rocker, lying on its side above the name. Light is ON: the
	 * "I" half is tacked in and lit, exactly the way the switch on a surge
	 * protector reads.
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
		margin-bottom: 18px;
		padding: 0;
		border: 0;
		background: none;
		border-radius: 15px;
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
		--lamp-hi: #c9291b;
		--lamp-lo: #7d1309;
		--lamp-shade: rgba(74, 6, 2, 0.62);
		/* The recess the lit half drops into is part of the lamp, not the shell. */
		--lamp-well: #4a0702;
		--lamp-glow: rgba(196, 38, 24, 0.42);
		--lamp-glyph: rgba(30, 3, 1, 0.85);

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
		/* A lamp bleeding onto a pale shell is a smudge, not a glow. */
		--lamp-glow: rgba(150, 20, 10, 0.18);
		--lamp-shade: rgba(88, 8, 2, 0.45);
		--lamp-well: #6b1008;

		--well-shadow: rgba(0, 0, 0, 0.26);
		--sink-side: rgba(0, 0, 0, 0.2);
		--sink-top: rgba(0, 0, 0, 0.1);
		--seam: rgba(0, 0, 0, 0.32);
		--seam-glow: rgba(0, 0, 0, 0.3);
	}

	.ps:active {
		transform: scale(0.97);
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
			0 0 24px -4px var(--lamp-glow);
	}

	/* ---- Rocker ---------------------------------------- */
	.ps-rocker {
		position: absolute;
		inset: 6px;
		transform-style: preserve-3d;
		/* Negative = "O" tacked in. Positive = "I" tacked in. */
		transform: rotateY(-19deg);
		transition: transform 280ms cubic-bezier(0.22, 1.32, 0.36, 1);
	}

	.ps.is-on .ps-rocker {
		transform: rotateY(19deg);
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

	/* At rest the "O" half is the sunk one: the housing shades it, and the
	   hinge wall to its right casts back across it. */
	.ps-off {
		left: 0;
		transform-origin: right center;
		transform: rotateY(-20deg);
		border-radius: 8px 0 0 8px;
		background: linear-gradient(to bottom, var(--face-in-near), var(--face-in-far));
		box-shadow:
			inset -3px 0 6px var(--sink-side),
			inset 0 1px 0 var(--sink-top);
	}

	/* Raised: lit from above, rim along the top edge. */
	.ps-on {
		right: 0;
		transform-origin: left center;
		transform: rotateY(20deg);
		border-radius: 0 8px 8px 0;
		background: linear-gradient(to bottom, var(--face-out-near), var(--face-out-far));
		box-shadow: inset 0 1px 0 var(--rim);
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
		box-shadow: -5px 0 9px -1px var(--seam-glow);
		pointer-events: none;
	}

	/* ---- Thrown: "I" sunk and lit ---------------------- */
	/* The wire is made on this side, so the lit half is the one lying flat in
	   the well and the dead half stands proud of it. */
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
		box-shadow: 5px 0 9px -1px var(--seam-glow);
	}

	.ps.is-on .ps-on {
		/* Darker at the far (right) edge, brighter toward the hinge, and sat
		   under the overhang of the half that is now standing up. */
		background: linear-gradient(to left, var(--lamp-lo), var(--lamp-hi));
		box-shadow:
			inset 5px 0 10px var(--lamp-shade),
			inset 0 2px 5px var(--lamp-shade);
	}

	.ps.is-on .ps-off {
		background: linear-gradient(to bottom, var(--face-out-near), var(--face-out-far));
		box-shadow: inset 0 1px 0 var(--rim);
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

	.ps-on .ps-glyph {
		color: var(--glyph-out);
	}

	.ps.is-on .ps-off .ps-glyph {
		color: var(--glyph-out);
	}

	.ps.is-on .ps-on .ps-glyph {
		color: var(--lamp-glyph);
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
