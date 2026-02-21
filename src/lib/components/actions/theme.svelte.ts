export const theme = $state({ current: 'light' as 'light' | 'dark' });

const themeColor = { light: '#ebebeb', dark: '#353535' };

function syncMeta(t: 'light' | 'dark') {
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor[t]);
}

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	syncMeta(theme.current);
}

export function toggleTheme() {
	const next = theme.current === 'light' ? 'dark' : 'light';

	function apply() {
		theme.current = next;
		localStorage.setItem('theme', next);
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(next);
		syncMeta(next);
	}

	if (document.startViewTransition) {
		document.startViewTransition(apply);
	} else {
		apply();
	}
}
