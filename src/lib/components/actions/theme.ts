import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function getTheme(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme') as Theme;
	if (stored === 'light' || stored === 'dark') return stored;
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const theme = writable<Theme>(getTheme());

// Subscriber updates DOM + localStorage on every change
theme.subscribe((value) => {
	if (!browser) return;
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(value);
	document.documentElement.style.colorScheme = value === 'dark' ? 'dark' : 'light';
	localStorage.setItem('theme', value);
});

// Follow system preference when no explicit choice is stored
if (browser) {
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			theme.set(e.matches ? 'dark' : 'light');
		}
	});
}

export function themeToggle(node: HTMLElement) {
	function onClick() {
		theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
	}

	node.addEventListener('click', onClick);
	return {
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}
