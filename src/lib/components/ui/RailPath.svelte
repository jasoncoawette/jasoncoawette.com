<script lang="ts">
	import { gateState } from '$lib/state/gate.svelte';
	import { playTick } from '$lib/state/sound.svelte';

	/**
	 * The scroll-drawn rail. Must be rendered as a direct child of `.folio-track`:
	 * it takes that parent as its measuring frame, reads every `.tl-dot` inside it,
	 * and terminates on the centre of a `.folio-outro` sibling if one exists.
	 *
	 * An S-curve drops in from the upper right and lands on a dotted vertical
	 * rail. Scroll progress fills the curve first, then the rail; each dot lights
	 * as the drawn head reaches it, and sounds as it does — on the way back up
	 * too, since the line crossing a tick is the same event in reverse.
	 */
	const CURVE = 'M43 0V7.3A39 39 0 0 1 21.71 42.05A39 39 0 0 0 0.5 76.75V110';
	const CURVE_H = 110;
	/** Per-frame approach rate. Low enough that the line trails the scroll. */
	const LERP = 0.12;
	const SETTLED = 2e-4;
	/** Floor between cues, so a flung scroll reads as a run and not a burst. */
	const CUE_GAP = 90;
	/** Deepest that run is allowed to get before the rest are dropped. */
	const CUE_QUEUE = 4;
	const REVEALS = ['itemReveal', 'itemRevealReduced'];

	const clamp = (n: number) => Math.min(1, Math.max(0, n));

	function drawOnScroll(node: HTMLElement) {
		// While the gate is up the document is locked to a single viewport, so
		// every measurement below would be wrong. Re-runs when it lifts.
		if (!gateState.entered) return;

		const lit = node.querySelector<SVGPathElement>('.pc-lit');
		const rail = node.querySelector<HTMLElement>('.path-rail');
		const track = node.parentElement;
		if (!lit || !rail || !track) return;

		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let curveLen = 118;
		let railH = 0;
		let pathTop = 0;
		let marks: { el: Element; y: number; on: boolean }[] = [];
		let current = 0;
		let target = 0;
		let frame = 0;
		// The first frame only records where the head already is — landing
		// mid-page on a reload should not replay the whole path at once.
		let armed = false;
		let lastCue = 0;
		// Crossings that have not sounded yet. The line catches up faster than
		// the ear wants, so they are spent one at a time rather than dropped.
		let queued = 0;

		// Survives the re-measures that resizes and entry reveals trigger.
		const passed = new WeakSet<Element>();

		const scrollProgress = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			return max <= 0 ? 1 : clamp(window.scrollY / max);
		};

		const measure = () => {
			curveLen = lit.getTotalLength() || 118;
			railH = rail.offsetHeight;
			pathTop = node.getBoundingClientRect().top + window.scrollY;

			marks = [...track.querySelectorAll('.tl-dot')].map((el) => {
				const box = el.getBoundingClientRect();
				return {
					el,
					y: box.top + box.height / 2 + window.scrollY,
					on: passed.has(el)
				};
			});

			// End the rail on the outro's centre line rather than at the raw
			// bottom of the track, so it reads as arriving somewhere.
			const outro = track.querySelector('.folio-outro');
			if (outro) {
				const box = outro.getBoundingClientRect();
				const bounds = track.getBoundingClientRect();
				node.style.setProperty(
					'--rail-tail',
					`${(bounds.bottom - (box.top + box.height / 2)).toFixed(1)}px`
				);
			}
		};

		const tick = () => {
			frame = 0;

			const delta = target - current;
			current = Math.abs(delta) < SETTLED ? target : current + delta * LERP;

			// The curve and the rail are one continuous run of line: spend the
			// curve's own arc length first, then whatever is left on the rail.
			const travel = current * (curveLen + railH);
			const curveP = clamp(travel / curveLen);
			const railP = railH ? clamp((travel - curveLen) / railH) : 0;

			node.style.setProperty('--curve-p', curveP.toFixed(4));
			node.style.setProperty('--rail-p', railP.toFixed(4));

			const tipY = pathTop + CURVE_H * curveP + railH * railP;
			for (const mark of marks) {
				const on = mark.y <= tipY;
				if (on === mark.on) continue;
				mark.on = on;
				mark.el.classList.toggle('is-lit', on);
				if (on) passed.add(mark.el);
				else passed.delete(mark.el);
				// Lighting and unlighting both count: scrolling back up crosses
				// the same ticks, and they should answer either way.
				if (armed && queued < CUE_QUEUE) queued++;
			}

			const now = performance.now();
			if (queued > 0 && now - lastCue >= CUE_GAP) {
				lastCue = now;
				queued--;
				playTick();
			}

			armed = true;

			// Keep the frames coming while the run is still draining, even once
			// the line itself has settled.
			if (current !== target || queued > 0) frame = requestAnimationFrame(tick);
		};

		const onScroll = () => {
			target = scrollProgress();
			if (still) current = target;
			if (!frame) frame = requestAnimationFrame(tick);
		};

		const onResize = () => {
			measure();
			onScroll();
		};

		const onReveal = (event: AnimationEvent) => {
			// Entries settling changes the document height under us.
			if (REVEALS.includes(event.animationName)) onResize();
		};

		measure();
		current = scrollProgress();
		onScroll();

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		track.addEventListener('animationend', onReveal);
		const observer = new ResizeObserver(onResize);
		observer.observe(document.body);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			track.removeEventListener('animationend', onReveal);
			observer.disconnect();
			if (frame) cancelAnimationFrame(frame);
		};
	}
</script>

<div class="folio-path" aria-hidden="true" {@attach drawOnScroll}>
	<svg class="path-curve" viewBox="0 0 44 110" fill="none">
		<path class="pc-dots" d={CURVE} />
		<!-- pathLength="1" normalises the arc, so one custom property draws it. -->
		<path class="pc-lit" d={CURVE} pathLength="1" />
	</svg>

	<div class="path-rail"><div class="path-lit"></div></div>

	<svg class="path-tip" viewBox="0 0 7 3" fill="none">
		<path d="M0.5 0.5 3.5 2.5 6.5 0.5" />
	</svg>
</div>
