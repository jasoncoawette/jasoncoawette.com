export const theme = $state({ current: 'light' as 'light' | 'dark' });

function syncMeta() {
	document.querySelector('meta[name="theme-color"]')?.setAttribute(
		'content',
		theme.current === 'dark' ? '#353535' : '#ebebeb'
	);
}

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	// Remove the inline style set by the flash-guard script so CSS takes over permanently
	document.documentElement.style.removeProperty('background-color');
	syncMeta();
}

export function toggleTheme() {
	const next = theme.current === 'light' ? 'dark' : 'light';
	theme.current = next;
	localStorage.setItem('theme', next);
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(next);
	syncMeta();
}
