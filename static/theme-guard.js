(function () {
	const stored = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const theme =
		stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
	if (theme === 'dark') document.documentElement.classList.add('dark');
})();
