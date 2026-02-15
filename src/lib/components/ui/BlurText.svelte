<script lang="ts">
	interface Props {
		text: string;
		delay?: number;
		charDelay?: number;
		duration?: number;
		tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote';
		class?: string;
	}

	let {
		text,
		delay = 0,
		charDelay = 30,
		duration = 400,
		tag = 'p',
		class: className = ''
	}: Props = $props();

	const chars = $derived(text.split(''));
</script>

<svelte:element this={tag} class="blur-text {className}">
	{#each chars as char, i (i)}
		<span
			class="blur-char"
			style:--delay="{delay + i * charDelay}ms"
			style:--duration="{duration}ms"
		>{char === ' ' ? '\u00A0' : char}</span>
	{/each}
</svelte:element>

<style>
	.blur-text {
		overflow: hidden;
	}

	.blur-char {
		display: inline-block;
		opacity: 0;
		filter: blur(4px);
		transform: translateY(8px);
		animation: blur-in var(--duration) ease forwards;
		animation-delay: var(--delay);
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		line-height: inherit;
	}

	@keyframes blur-in {
		to {
			opacity: 1;
			filter: blur(0px);
			transform: translateY(0px);
		}
	}
</style>
