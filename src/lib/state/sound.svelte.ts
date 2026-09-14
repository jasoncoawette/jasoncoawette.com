import { browser } from '$app/environment';
import type { CueName, UISFXPlayer } from 'uisfx';

const KEY = 'jc-sound';

/** The only cues this site uses. Preloaded so the switch never lags its throw. */
const USED_CUES: CueName[] = ['unlock', 'toggle-on', 'toggle-off'];

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
let player: UISFXPlayer | null = null;
let booting: Promise<UISFXPlayer | null> | null = null;

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

async function ensurePlayer(): Promise<UISFXPlayer | null> {
	if (!browser) return null;
	if (player) return player;
	if (booting) return booting;

	booting = (async () => {
		try {
			const { createUISFX } = await import('uisfx');
			player = createUISFX({
				pack: 'minimal',
				volume: 0.7,
				enabled: soundState.enabled,
				...(context ? { context } : {})
			});
			await player.unlock();
			soundState.ready = true;
			// Not awaited: a cold cue should still fire, just a touch later.
			void player.preload(USED_CUES);
			return player;
		} catch {
			// No Web Audio, blocked, or the chunk failed to load. Sound is
			// decoration here — every cue has a visible counterpart — so this
			// stays silent rather than surfacing.
			return null;
		} finally {
			booting = null;
		}
	})();

	return booting;
}

/**
 * Fire-and-forget. Returns nothing: every cue on this site accompanies a visible
 * change, so a dropped cue is never a missing signal.
 */
export function playCue(cue: CueName) {
	if (!browser || !soundState.enabled) return;
	if (player) {
		player.play(cue);
		return;
	}
	void ensurePlayer().then((p) => p?.play(cue));
}

/** Called from the gate's Enter click, after primeAudio() in the same handler. */
export function startAudio() {
	if (!browser) return;
	void ensurePlayer().then((p) => {
		if (soundState.enabled) p?.play('unlock');
	});
}

export function setSoundEnabled(enabled: boolean) {
	soundState.enabled = enabled;
	if (!browser) return;
	if (!enabled) player?.stopAll();
	player?.setEnabled(enabled);
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
