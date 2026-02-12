import type { Action } from 'svelte/action';

/**
 * Svelte action that tracks cursor position over an element and sets
 * --lg-glow-x / --lg-glow-y CSS custom properties for the radial
 * glow highlight in .liquid-glass elements.
 *
 * Usage:
 *   <div class="liquid-glass" use:liquidGlass>...</div>
 */
export const liquidGlass: Action = (node) => {
	function onMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		node.style.setProperty('--lg-glow-x', `${x}%`);
		node.style.setProperty('--lg-glow-y', `${y}%`);
	}

	function onLeave() {
		node.style.setProperty('--lg-glow-x', '50%');
		node.style.setProperty('--lg-glow-y', '50%');
	}

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
};
