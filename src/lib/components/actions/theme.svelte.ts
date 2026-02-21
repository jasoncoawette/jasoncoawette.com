export const theme = $state({ current: 'light' as 'light' | 'dark' });

function syncMeta() {
	const bg = getComputedStyle(document.documentElement)
		.getPropertyValue('--color-primary-bg')
		.trim();
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
	document.documentElement.style.backgroundColor = bg;
}

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	syncMeta();
}

export function toggleTheme() {
	const next = theme.current === 'light' ? 'dark' : 'light';

	function apply() {
		theme.current = next;
		localStorage.setItem('theme', next);
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(next);
		syncMeta();
	}

	if (document.startViewTransition) {
		document.startViewTransition(apply);
	} else {
		apply();
	}
}
