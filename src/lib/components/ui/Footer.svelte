<script lang="ts">
	import { X, Email } from '$lib';
	import { soundState, toggleSound } from '$lib/state/sound.svelte';
</script>

<footer
	class="flex h-fit w-full max-w-3xl flex-row items-center justify-between gap-y-2 px-4 pb-32 sm:pb-24"
>
	<span class="text-sm! text-tertiary-fg! select-none!">© 2026 Jason Coawette</span>

	<div class="flex w-fit flex-row items-center justify-center gap-1">
		<!-- Sound is never the only signal, so this is a plain, persistent preference. -->
		<button
			class="sound-pref"
			type="button"
			role="switch"
			aria-checked={soundState.enabled}
			onclick={() => toggleSound()}
		>
			Sound {soundState.enabled ? 'On' : 'Off'}
		</button>
		<a
			href="https://x.com/jasoncoawette"
			class="inline-flex p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
			aria-label="X"
		>
			<X size={16} />
		</a>
		<a
			href="mailto:jason.coawette@gmail.com"
			class="inline-flex p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
			aria-label="Email"
		>
			<Email size={18} />
		</a>
	</div>
</footer>

<style>
	.sound-pref {
		padding: 2px 8px;
		margin-right: 4px;
		border-radius: 999px;
		background: none;
		border: 0;
		font-family: var(--folio-mono);
		font-size: 10px;
		font-weight: 500;
		line-height: 1.8;
		letter-spacing: 1.6px;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--color-folio-mute);
		transition:
			color 160ms var(--ease-out),
			background-color 160ms var(--ease-out);
	}

	.sound-pref:hover {
		color: var(--color-folio-ink);
		background: var(--surface-chip);
	}
</style>
