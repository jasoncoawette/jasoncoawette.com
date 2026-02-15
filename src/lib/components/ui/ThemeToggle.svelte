<script lang="ts">
	import { Sun, Moon, theme, toggleTheme, shine } from '$lib';
</script>

<button
	class="glass btn-icon"
	use:shine
	aria-label="Toggle theme"
	onclick={toggleTheme}
>
	{#if theme.current === 'light'}
		<Moon color="var(--color-primary-fg)" />
	{:else}
		<Sun color="var(--color-primary-fg)" />
	{/if}
</button>
