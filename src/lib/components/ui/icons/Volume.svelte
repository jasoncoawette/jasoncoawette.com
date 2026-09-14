<script>
	let { color = 'currentColor', size = 24, strokeWidth = 2, class: className = '' } = $props();

	/**
	 * Bumped to replay the cascade. It also runs once on mount, which is the
	 * whole animation for a toggle: flipping the preference swaps this
	 * component in, and the waves arrive as the acknowledgement.
	 */
	let run = $state(0);

	// Inner wave first, outer second — the arcs arrive in the order sound leaves.
	const waves = ['M15.54 8.46a5 5 0 0 1 0 7.07', 'M19.07 4.93a10 10 0 0 1 0 14.14'];
</script>

<div class={className} aria-label="sound on" role="img" onmouseenter={() => run++}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="volume-icon"
	>
		<path d="M11 5 6 9H2v6h4l5 4V5Z" />
		<!-- Re-keyed rather than class-toggled: a fresh node restarts the
		     stagger cleanly, with no off-frame to schedule. -->
		{#key run}
			{#each waves as d, index (d)}
				<path {d} class="wave" style="--index: {index + 1}" />
			{/each}
		{/key}
	</svg>
</div>

<style>
	div {
		display: inline-block;
	}

	.volume-icon {
		overflow: visible;
	}

	.wave {
		opacity: 0;
		animation: waveIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: calc(0.06s + var(--index) * 0.12s);
	}

	@keyframes waveIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wave {
			opacity: 1;
			animation: none;
		}
	}
</style>
