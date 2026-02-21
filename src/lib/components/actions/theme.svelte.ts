export const theme = $state({ current: 'light' as 'light' | 'dark' });

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme() {
	theme.current = theme.current === 'light' ? 'dark' : 'light';
	localStorage.setItem('theme', theme.current);
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(theme.current);
}
