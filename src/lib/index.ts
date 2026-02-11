// place files you want to import through the `$lib` alias in this folder.
// ------------- Components ------------- //
export { default as Sun } from './components/ui/icons/Sun.svelte';
export { default as Moon } from './components/ui/icons/Moon.svelte';
export { default as ThemeToggle } from './components/ui/ThemeToggle.svelte';

// ------------- Theme ------------- //
export { theme, isDark, toggleTheme, initTheme } from './theme.svelte';
