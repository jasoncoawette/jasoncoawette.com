import { browser } from '$app/environment';
import type { CueName, PackName, UISFXPlayer } from 'uisfx';

const KEY = 'jc-sound';

/** Chrome and the switch speak the site's own voice: dry and almost invisible. */
const UI_PACK: PackName = 'minimal';
const UI_CUES: CueName[] = ['start', 'select'];

/** The gate's one cue: a three-note rise that runs under the ring sweep. */
const ENTER_CUE: CueName = 'start';

/**
 * The rail's tick comes from a different pack, so it needs its own player —
 * uisfx resolves a pack per player, not per cue.
 */
const TRAIL_PACK: PackName = 'zen';
const TICK_CUE: CueName = 'long-press';

function storedEnabled(): boolean {
	if (!browser) return true;
	try {
		return localStorage.getItem(KEY) !== 'off';
	} catch {
		return true;
	}
}

export const soundState = $state({ enabled: storedEnabled(), ready: false });

let context: AudioContext | null = null;

type Voice = {
	pack: PackName;
	volume: number;
	cues: CueName[];
	/** Floor on retriggers, so a fast scroll cannot machine-gun the cue. */
	cooldownMs?: number;
	player: UISFXPlayer | null;
	booting: Promise<UISFXPlayer | null> | null;
};

const ui: Voice = { pack: UI_PACK, volume: 0.7, cues: UI_CUES, player: null, booting: null };
const trail: Voice = {
	pack: TRAIL_PACK,
	volume: 0.42,
	cues: [TICK_CUE],
	cooldownMs: 70,
	player: null,
	booting: null
};
const voices = [ui, trail];

/**
 * Must be called *synchronously* inside a real pointer/keyboard handler, before
 * any await. The uisfx module is imported lazily (it must never run during SSR),
 * so there is no way to get a play() call into the gesture tick itself — the
 * documented alternative is to create and resume our own AudioContext here and
 * hand it to createUISFX. Once resumed under a gesture it stays unlocked, so
 * playback after the dynamic import is still allowed.
 */
export function primeAudio() {
	if (!browser || context) return;
	const Ctor =
		window.AudioContext ??
		(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
	if (!Ctor) return;
	try {
		context = new Ctor();
		void context.resume();
	} catch {
		context = null;
	}
}

async function ensurePlayer(voice: Voice): Promise<UISFXPlayer | null> {
	if (!browser) return null;
	if (voice.player) return voice.player;
	if (voice.booting) return voice.booting;

	voice.booting = (async () => {
		try {
			const { createUISFX } = await import('uisfx');
			const player = createUISFX({
				pack: voice.pack,
				volume: voice.volume,
				enabled: soundState.enabled,
				...(voice.cooldownMs ? { cooldownMs: voice.cooldownMs } : {}),
				...(context ? { context } : {})
			});
			voice.player = player;
			await player.unlock();
			soundState.ready = true;
			// Not awaited: a cold cue should still fire, just a touch later.
			void player.preload(voice.cues);
			return player;
		} catch {
			// No Web Audio, blocked, or the chunk failed to load. Sound is
			// decoration here — every cue has a visible counterpart — so this
			// stays silent rather than surfacing.
			return null;
		} finally {
			voice.booting = null;
		}
	})();

	return voice.booting;
}

function fire(voice: Voice, cue: CueName) {
	if (!browser || !soundState.enabled) return;
	if (voice.player) {
		voice.player.play(cue);
		return;
	}
	void ensurePlayer(voice).then((p) => p?.play(cue));
}

/**
 * Fire-and-forget. Returns nothing: every cue on this site accompanies a visible
 * change, so a dropped cue is never a missing signal.
 */
export function playCue(cue: CueName) {
	fire(ui, cue);
}

/** One small acknowledgement per tick the rail crosses, either direction. */
export function playTick() {
	fire(trail, TICK_CUE);
}

/** Called from the gate's Enter click, after primeAudio() in the same handler. */
export function startAudio() {
	if (!browser) return;
	void ensurePlayer(ui).then((p) => {
		if (soundState.enabled) p?.play(ENTER_CUE);
	});
	// Warmed here rather than on the first mark, which would otherwise pay
	// for the fetch and arrive after the rail had already passed it.
	void ensurePlayer(trail);
}

export function setSoundEnabled(enabled: boolean) {
	soundState.enabled = enabled;
	if (!browser) return;
	for (const voice of voices) {
		if (!enabled) voice.player?.stopAll();
		voice.player?.setEnabled(enabled);
	}
	try {
		localStorage.setItem(KEY, enabled ? 'on' : 'off');
	} catch {
		// Blocked storage: the preference still holds for this visit.
	}
}

export function toggleSound(): boolean {
	const next = !soundState.enabled;
	setSoundEnabled(next);
	return next;
}
