<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		delay?: number;
		duration?: number;
		children: Snippet;
		class?: string;
	}

	let { delay = 0, duration = 400, children, class: className = '' }: Props = $props();
</script>

<div class="blur-block {className}" style:--delay="{delay}ms" style:--duration="{duration}ms">
	{@render children()}
</div>

<style>
	.blur-block {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(8px);
		animation: blur-in var(--duration) ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes blur-in {
		to {
			opacity: 1;
			filter: blur(0px);
			transform: translateY(0px);
		}
	}
</style>
