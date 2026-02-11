export const theme = $state({ current: 'light' as 'light' | 'dark' });

export function isDark() {
	return theme.current === 'dark';
}

export function initTheme() {
	// Sync state with what the blocking script in app.html already applied
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme() {
	theme.current = theme.current === 'light' ? 'dark' : 'light';
	localStorage.setItem('theme', theme.current);
	applyTheme();
}

function applyTheme() {
	document.documentElement.classList.toggle('dark', theme.current === 'dark');
}
