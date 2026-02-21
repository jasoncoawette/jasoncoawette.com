export const theme = $state({ current: 'light' as 'light' | 'dark' });

function syncMeta() {
	document.querySelector('meta[name="theme-color"]')?.setAttribute(
		'content',
		theme.current === 'dark' ? '#353535' : '#ebebeb'
	);
}

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	// Flash guard already set colorScheme + backgroundColor correctly — leave them alone
	syncMeta();
}

export function toggleTheme() {
	const next = theme.current === 'light' ? 'dark' : 'light';
	const isDark = next === 'dark';
	theme.current = next;
	localStorage.setItem('theme', next);
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(next);
	// Update both inline styles directly — color-scheme is the browser-level canvas signal
	document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
	document.documentElement.style.backgroundColor = isDark ? 'oklch(20.5% 0 0)' : 'oklch(92.2% 0 0)';
	syncMeta();
}
