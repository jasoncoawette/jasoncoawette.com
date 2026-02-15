import type { EasingFunction, TransitionConfig } from 'svelte/transition';

interface FlyBlurParams {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	y?: number;
	amount?: number;
	opacity?: number;
}

export function flyBlur(
	node: Element,
	{
		delay = 0,
		duration = 400,
		easing = (t: number) => t,
		y = 8,
		amount = 4,
		opacity = 0
	}: FlyBlurParams = {},
	{ direction }: { direction: 'in' | 'out' | 'both' }
): TransitionConfig {
	const style = getComputedStyle(node);
	const currentOpacity = +style.opacity;
	const od = currentOpacity - opacity;
	const effectiveY = direction === 'out' ? -y : y;

	return {
		delay,
		duration,
		easing,
		css: (t) => {
			const u = 1 - t;
			return `
				opacity: ${opacity + od * t};
				filter: blur(${u * amount}px);
				transform: translateY(${u * effectiveY}px);
			`;
		}
	};
}
