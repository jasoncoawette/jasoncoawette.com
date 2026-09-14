<script lang="ts">
	import { gateState } from '$lib/state/gate.svelte';
	import { playArrival, playTick } from '$lib/state/sound.svelte';

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
	/**
	 * The curve leaves the column's centre line under the chevron, turns left,
	 * runs across and drops onto the rail. Built rather than hard-coded: the
	 * horizontal span is half the column, so it has to be measured.
	 */
	const CORNER = 36;
	/** Straight drop out of the chevron before the first turn. */
	const DROP = 34;
	/** What the server renders with, until the client measures the real one. */
	const DEFAULT_W = 44;
	const DEFAULT_H = 110;
	/** Above this the rail hangs off the side, so the curve stays a short hook. */
	const WIDE = '(min-width: 861px)';
	const WIDE_W = 44;

	function curvePath(w: number, h: number) {
		const r = Math.max(10, Math.min(CORNER, (w - 1) / 2, (h - DROP) / 2));
		const x1 = (w - 0.5).toFixed(2);
		const x2 = (w - 0.5 - r).toFixed(2);
		const x3 = (0.5 + r).toFixed(2);
		return (
			`M${x1} 0V${DROP}` +
			`A${r} ${r} 0 0 1 ${x2} ${DROP + r}` +
			`H${x3}` +
			`A${r} ${r} 0 0 0 0.5 ${DROP + 2 * r}` +
			`V${h}`
		);
	}

	const CURVE = curvePath(DEFAULT_W, DEFAULT_H);
	/** Per-frame approach rate. Low enough that the line trails the scroll. */
	const LERP = 0.12;
	const SETTLED = 2e-4;
	/** Floor between cues, so a flung scroll reads as a run and not a burst. */
	const CUE_GAP = 90;
	/** Arrival latches on at the top figure and only lets go below the lower
	 *  one, so hovering on the threshold cannot retrigger the chime. */
	const ARRIVE_ON = 0.995;
	const ARRIVE_OFF = 0.9;
	/** Deepest that run is allowed to get before the rest are dropped. */
	const CUE_QUEUE = 4;
	/** Matches dotPulse: the entry the line has just left keeps its underline
	 *  until the ring on the next dot has finished expanding past it. */
	const PULSE_HOLD = 720;
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

		const tip = node.querySelector<SVGSVGElement>('.path-tip');
		const cta = track.querySelector<HTMLElement>('.outro-cta');
		let arrived = false;

		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const wide = window.matchMedia(WIDE);

		const curveSvg = node.querySelector<SVGSVGElement>('.path-curve');
		if (!curveSvg) return;
		const curvePaths = [...node.querySelectorAll<SVGPathElement>('.path-curve path')];

		let curveLen = 118;
		let curveH = DEFAULT_H;
		let railH = 0;
		let pathTop = 0;
		let marks: { el: Element; y: number; on: boolean; entry: Element | null }[] = [];
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
		// Deepest entry the line has reached: the one wearing the underline.
		let active: Element | null = null;
		let holdTimer: ReturnType<typeof setTimeout> | undefined;

		// Survives the re-measures that resizes and entry reveals trigger.
		const passed = new WeakSet<Element>();

		const scrollProgress = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			return max <= 0 ? 1 : clamp(window.scrollY / max);
		};

		const measure = () => {
			// On narrow screens the curve leaves the column's centre line, so its
			// span is the track's half-width less however far left of the column
			// this whole path sits. Wide screens keep the short side hook.
			curveH = parseFloat(getComputedStyle(curveSvg).height) || DEFAULT_H;
			const offset = parseFloat(getComputedStyle(node).left) || 0;
			const width = wide.matches ? WIDE_W : Math.max(64, track.clientWidth / 2 - offset);

			node.style.setProperty('--curve-w', `${width.toFixed(2)}px`);
			curveSvg.setAttribute('viewBox', `0 0 ${width.toFixed(2)} ${curveH.toFixed(2)}`);
			const d = curvePath(width, curveH);
			for (const path of curvePaths) path.setAttribute('d', d);

			curveLen = lit.getTotalLength() || 118;
			railH = rail.offsetHeight;
			pathTop = node.getBoundingClientRect().top + window.scrollY;

			marks = [...track.querySelectorAll('.tl-dot')].map((el) => {
				const box = el.getBoundingClientRect();
				return {
					el,
					y: box.top + box.height / 2 + window.scrollY,
					on: passed.has(el),
					// The dot hangs off .tl-head, so the entry is one step further out.
					entry: el.closest('.tl-entry')
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

		/**
		 * The line drives the same underline the pointer does. The deepest lit dot
		 * owns it; the entry above keeps its own until the new dot's ring has run,
		 * so the two overlap for a beat rather than swapping on the frame.
		 */
		const hand = () => {
			let next: Element | null = null;
			// Lit dots are a prefix of the list either way the page is scrolled,
			// so the last one still on is the one the line is standing at.
			for (let i = marks.length - 1; i >= 0; i--) {
				if (!marks[i].on) continue;
				next = marks[i].entry;
				break;
			}
			if (next === active) return;

			active = next;
			next?.classList.add('is-lit');

			// One rescheduled sweep rather than a timer per entry: a flung scroll
			// leaves only the deepest lit, and the hold runs from the last crossing.
			clearTimeout(holdTimer);
			const drop = () => {
				for (const mark of marks) {
					if (mark.entry && mark.entry !== active) mark.entry.classList.remove('is-lit');
				}
			};
			// Nothing to hand over from on the first frame, and reduced motion has
			// no ring to wait on.
			if (!armed || still) drop();
			else holdTimer = setTimeout(drop, PULSE_HOLD);
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

			const tipY = pathTop + curveH * curveP + railH * railP;
			let crossed = false;
			for (const mark of marks) {
				const on = mark.y <= tipY;
				if (on === mark.on) continue;
				crossed = true;
				mark.on = on;
				mark.el.classList.toggle('is-lit', on);
				if (on) passed.add(mark.el);
				else passed.delete(mark.el);
				// Lighting and unlighting both count: scrolling back up crosses
				// the same ticks, and they should answer either way.
				if (armed && queued < CUE_QUEUE) queued++;
			}

			if (crossed) hand();

			// Everything scrolled through: the last arrow and the button light
			// together, and the one resolving cue on the page fires.
			if (!arrived && railP >= ARRIVE_ON) {
				arrived = true;
				tip?.classList.add('is-lit');
				cta?.classList.add('is-lit');
				if (armed) playArrival();
			} else if (arrived && railP < ARRIVE_OFF) {
				arrived = false;
				tip?.classList.remove('is-lit');
				cta?.classList.remove('is-lit');
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
		wide.addEventListener('change', onResize);
		track.addEventListener('animationend', onReveal);
		const observer = new ResizeObserver(onResize);
		observer.observe(document.body);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			wide.removeEventListener('change', onResize);
			track.removeEventListener('animationend', onReveal);
			observer.disconnect();
			if (frame) cancelAnimationFrame(frame);
			clearTimeout(holdTimer);
			for (const mark of marks) mark.entry?.classList.remove('is-lit');
		};
	}
</script>

<div class="folio-path" aria-hidden="true" {@attach drawOnScroll}>
	<span class="path-chevron">
		<svg viewBox="0 0 16 17" fill="none">
			<path class="cv cv-1" d="M2.5 3 8 8.5 13.5 3" />
			<path class="cv cv-2" d="M2.5 8.5 8 14 13.5 8.5" />
		</svg>
	</span>

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
