import { flushSync } from 'svelte';

export const theme = $state({ current: 'light' as 'light' | 'dark' });

const BG = { light: 'oklch(92.2% 0 0)', dark: 'oklch(20.5% 0 0)' };

function applyHtmlBg(t: 'light' | 'dark') {
	document.documentElement.style.backgroundColor = BG[t];
}

export function initTheme() {
	theme.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	applyHtmlBg(theme.current);
}

export function toggleTheme() {
	const apply = () => {
		// flushSync forces Svelte's DOM update to complete synchronously so the
		// view transition captures the correct new state in its screenshot.
		// Without it the async scheduler runs after the snapshot, corrupting state
		// on repeated toggles.
		flushSync(() => {
			theme.current = theme.current === 'light' ? 'dark' : 'light';
		});
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
			// Set html background-color as inline style after the transition completes —
			// the canvas background doesn't repaint from a CSS variable change during a
			// view transition, so we force it here for the iOS tab bar / safe-area chrome.
			applyHtmlBg(theme.current);
		});
	} else {
		apply();
		applyHtmlBg(theme.current);
	}
}
