<script lang="ts">
	import { Sun, Moon, theme, toggleTheme } from '$lib';
</script>

<button class="p-2 text-tertiary-fg hover:text-priamry-fg! transition-colors duration-400 ease-out" aria-label="Toggle theme" onclick={toggleTheme}>
	{#if theme.current === 'light'}
		<Moon size={19} />
	{:else}
		<Sun size={19} />
	{/if}
</button>
