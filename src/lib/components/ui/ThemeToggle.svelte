<script lang="ts">
	import { Sun, Moon, theme, toggleTheme } from '$lib';
</script>

<button
	class="glass btn-icon"
	aria-label="Toggle theme"
	onclick={toggleTheme}
>
	{#if theme.current === 'light'}
		<Moon color="var(--color-primary-fg)" />
	{:else}
		<Sun color="var(--color-primary-fg)" />
	{/if}
</button>
