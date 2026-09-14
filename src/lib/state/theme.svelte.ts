import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const KEY = 'jc-theme';

/**
 * Dark is the default and carries no attribute — only an explicit switch to
 * light is recorded. The system preference is deliberately ignored: this site
 * is designed dark, and light is an opt-in.
 *
 * The initial value is read from the DOM rather than storage, so it always
 * agrees with whatever the blocking script in app.html already painted.
 */
function initial(): Theme {
	if (!browser) return 'dark';
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export const themeState = $state({ value: initial() });

export function setTheme(next: Theme) {
	themeState.value = next;
	if (!browser) return;

	const root = document.documentElement;

	// Swap every colour in one step. Without this, a few dozen properties ease
	// at their own rates and the flip reads as a smear rather than a switch.
	root.classList.add('is-recolouring');

	if (next === 'light') root.dataset.theme = 'light';
	else delete root.dataset.theme;
	root.style.colorScheme = next;

	try {
		localStorage.setItem(KEY, next);
	} catch {
		// Private mode or blocked storage: the theme still applies for this visit.
	}

	requestAnimationFrame(() => {
		requestAnimationFrame(() => root.classList.remove('is-recolouring'));
	});
}

export function toggleTheme(): Theme {
	const next: Theme = themeState.value === 'dark' ? 'light' : 'dark';
	setTheme(next);
	return next;
}
