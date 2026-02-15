<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [color]
	 * @property {number} [size]
	 * @property {number} [strokeWidth]
	 * @property {boolean} [isHovered]
	 * @property {string} [class]
	 */

	/** @type {Props} */
	let {
		color = 'currentColor',
		size = undefined,
		strokeWidth = 2,
		isHovered = false,
		class: className = ''
	} = $props();

	function handleMouseEnter() {
		if (isHovered) return;
		isHovered = true;

		setTimeout(() => {
			isHovered = false;
		}, 300);
	}
</script>

<div class={className} aria-label="chevron-left" role="img" onmouseenter={handleMouseEnter}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		style:width={size ? undefined : 'var(--icon-size)'}
		style:height={size ? undefined : 'var(--icon-size)'}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		class="chevron-icon"
		class:animate={isHovered}
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
</div>

<style>
	div {
		display: inline-block;
	}

	.chevron-icon {
		overflow: visible;
	}

	.chevron-icon.animate path {
		transform: translateX(-3px);
	}

	path {
		transition: all 0.2s ease-in;
	}
</style>
