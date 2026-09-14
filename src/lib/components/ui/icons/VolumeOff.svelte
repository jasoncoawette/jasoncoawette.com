<script>
	let { color = 'currentColor', size = 24, strokeWidth = 2, class: className = '' } = $props();

	/** Bumped to replay the shake; also fires once on mount, when sound is cut. */
	let run = $state(0);
</script>

<div class={className} aria-label="sound off" role="img" onmouseenter={() => run++}>
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
		{#key run}
			<!-- A small shake — the gesture of a thing refusing to make a noise. -->
			<g class="mute">
				<path d="M11 5 6 9H2v6h4l5 4V5Z" />
				<line x1="22" x2="16" y1="9" y2="15" />
				<line x1="16" x2="22" y1="9" y2="15" />
			</g>
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

	.mute {
		animation: nudge 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes nudge {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-1.5px);
		}
		75% {
			transform: translateX(1.5px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mute {
			animation: none;
		}
	}
</style>
