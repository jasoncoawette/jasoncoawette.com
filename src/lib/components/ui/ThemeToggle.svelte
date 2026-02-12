<script lang="ts">
	import { Sun, Moon, theme, toggleTheme } from '$lib';

	let isHovered = $state(false);
</script>

<button
	class="
      liquid-glass flex h-fit
      w-fit cursor-pointer items-center
      justify-center rounded-full p-2"
	aria-label="Toggle theme"
	onclick={toggleTheme}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{#if theme.current === 'light'}
		<Moon size={18} color="var(--color-primary-fg)" {isHovered} />
	{:else}
		<Sun size={18} color="var(--color-primary-fg)" {isHovered} />
	{/if}
</button>
