<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [color]
	 * @property {number} [size]
	 * @property {number} [strokeWidth]
	 * @property {string} [class]
	 */

	/** @type {Props} */
	let {
		color = 'currentColor',
		size = undefined,
		strokeWidth = 2,
		class: className = ''
	} = $props();
</script>

<div class={className} aria-label="back" role="img">
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
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
</div>

<style>
	div {
		display: inline-block;
	}
</style>
