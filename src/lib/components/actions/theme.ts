import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function getTheme(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme') as Theme;
	if (stored === 'light' || stored === 'dark') return stored;
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(value: Theme) {
	document.documentElement.classList.toggle('dark', value === 'dark');
	localStorage.setItem('theme', value);
}

// Reactive state for the UI (icon switching etc.)
const _theme = writable<Theme>('light');
export const theme = { subscribe: _theme.subscribe };

if (browser) {
	const initial = getTheme();
	applyTheme(initial);
	_theme.set(initial);

	// Follow system preference when no explicit choice is stored
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			const next: Theme = e.matches ? 'dark' : 'light';
			applyTheme(next);
			_theme.set(next);
		}
	});
}

export function themeToggle(node: HTMLElement) {
	function onClick() {
		_theme.update((current) => {
			const next: Theme = current === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			return next;
		});
	}

	node.addEventListener('click', onClick);
	return {
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}
