<script lang="ts">
	import { Sun, Moon, theme, toggleTheme, viewport } from '$lib';

	let isHovered = $state(false);
</script>

<button
	aria-label="Toggle theme"
	onclick={toggleTheme}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{#if theme.current === 'light'}
		<Moon size={viewport.isMobile ? 24 : 20} color="var(--color-primary-fg)" {isHovered} />
	{:else}
		<Sun size={viewport.isMobile ? 24 : 20} color="var(--color-primary-fg)" {isHovered} />
	{/if}
</button>
