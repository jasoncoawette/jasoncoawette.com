export const viewport = $state({ isMobile: false });

export function initViewport() {
	const mq = window.matchMedia('(max-width: 768px)');
	viewport.isMobile = mq.matches;
	mq.addEventListener('change', (e) => {
		viewport.isMobile = e.matches;
	});
}
