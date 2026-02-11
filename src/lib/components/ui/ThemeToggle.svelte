<script lang="ts">
	import { Sun, Moon, theme, toggleTheme } from '$lib';

	let isHovered = $state(false);
</script>

<button
	class="
      flex h-fit w-fit cursor-pointer items-center justify-center p-1"
	aria-label="Toggle theme"
	onclick={toggleTheme}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{#if theme.current === 'light'}
		<Sun size={18} color="var(--color-primary-fg)" {isHovered} />
	{:else}
		<Moon size={18} color="var(--color-primary-fg)" {isHovered} />
	{/if}
</button>
