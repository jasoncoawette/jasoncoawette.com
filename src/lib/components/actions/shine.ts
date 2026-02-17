export function shine(node: HTMLElement) {
	function onMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - rect.left}px`);
		node.style.setProperty('--my', `${e.clientY - rect.top}px`);
	}

	function onEnter() {
		node.style.setProperty('--shine-opacity', '1');
	}

	function onLeave() {
		node.style.setProperty('--shine-opacity', '0');
	}

	node.addEventListener('mousemove', onMove);
	node.addEventListener('mouseenter', onEnter);
	node.addEventListener('mouseleave', onLeave);

}
