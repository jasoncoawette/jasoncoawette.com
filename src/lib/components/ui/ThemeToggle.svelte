<script lang="ts">
	import { Sun, Moon, theme, toggleTheme } from '$lib';

	let isHovered = $state(false);
</script>

<button
	class="glass btn-icon"
	aria-label="Toggle theme"
	onclick={toggleTheme}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{#if theme.current === 'light'}
		<Moon color="var(--color-primary-fg)" {isHovered} />
	{:else}
		<Sun color="var(--color-primary-fg)" {isHovered} />
	{/if}
</button>
