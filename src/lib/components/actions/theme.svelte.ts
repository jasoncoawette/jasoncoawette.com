export const theme = $state({ current: 'light' as 'light' | 'dark' });

export function isDark() {
	return theme.current === 'dark';
}

export function initTheme() {
	// Sync state with what the blocking script in app.html already applied
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme() {
	const apply = () => {
		theme.current = theme.current === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme.current);
		document.documentElement.classList.toggle('dark', theme.current === 'dark');
	};

	if (document.startViewTransition) {
		// Freeze backdrop-filter layers during transition to prevent flicker.
		// backdrop-filter does a live compositor read — during a view transition
		// the backing content is in an unstable intermediate state, causing
		// the 6 blur layers to momentarily sample garbage.
		document.documentElement.classList.add('theme-transitioning');
		const transition = document.startViewTransition(apply);
		transition.finished.then(() => {
			document.documentElement.classList.remove('theme-transitioning');
		});
	} else {
		apply();
	}
}
