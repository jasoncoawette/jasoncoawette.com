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

	const words = $derived.by(() => {
		const result: { word: string; startIndex: number }[] = [];
		let idx = 0;
		for (const segment of text.split(' ')) {
			if (idx > 0) {
				// space between words — its own inline element so wrapping happens here
				result.push({ word: ' ', startIndex: idx });
				idx += 1;
			}
			result.push({ word: segment, startIndex: idx });
			idx += segment.length;
		}
		return result;
	});
</script>

<svelte:element this={tag} class="blur-text {className}">
	{#each words as { word, startIndex } (startIndex)}
		{#if word === ' '}
			<span
				class="blur-char blur-space"
				style:--delay="{delay + startIndex * charDelay}ms"
				style:--duration="{duration}ms">&nbsp;</span
			>
		{:else}
			<span class="blur-word"
				>{#each word.split('') as char, j (j)}<span
						class="blur-char"
						style:--delay="{delay + (startIndex + j) * charDelay}ms"
						style:--duration="{duration}ms">{char}</span
					>{/each}</span
			>
		{/if}
	{/each}
</svelte:element>

<style>
	.blur-text {
		overflow: hidden;
	}

	.blur-word {
		display: inline-block;
		white-space: nowrap;
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
