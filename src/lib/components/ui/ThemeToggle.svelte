<script lang="ts">
	import { Sun, Moon, theme, themeToggle } from '$lib';
</script>

<button
	class="p-2 text-tertiary-fg transition-colors duration-400 ease-out hover:text-primary-fg!"
	aria-label="Toggle theme"
	use:themeToggle
>
	{#if $theme === 'light'}
		<Moon size={19} />
	{:else}
		<Sun size={19} />
	{/if}
</button>
