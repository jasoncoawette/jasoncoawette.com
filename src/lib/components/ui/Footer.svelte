<script lang="ts">
	import { X, Email, Volume, VolumeOff } from '$lib';
	import { soundState, toggleSound } from '$lib/state/sound.svelte';
</script>

<footer class="h-fit w-full max-w-3xl px-4 pb-32 sm:pb-24">
	<div class="folio-line flex h-fit flex-row items-center justify-between gap-y-2">
		<span class="text-sm! text-tertiary-fg! select-none!">© 2026 Jason Coawette</span>

		<div class="flex w-fit flex-row items-center justify-center gap-1">
			<!-- Sound is never the only signal, so this is a plain, persistent
			     preference. The icon swap carries its own animation. -->
			<button
				class="foot-icon"
				type="button"
				role="switch"
				aria-checked={soundState.enabled}
				aria-label={soundState.enabled ? 'Turn sound off' : 'Turn sound on'}
				onclick={() => toggleSound()}
			>
				{#if soundState.enabled}
					<Volume size={18} />
				{:else}
					<VolumeOff size={18} />
				{/if}
			</button>
			<a
				href="https://x.com/jasoncoawette"
				class="inline-flex rounded-lg p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
				aria-label="X"
			>
				<X size={16} />
			</a>
			<a
				href="mailto:jason.coawette@gmail.com"
				class="inline-flex rounded-lg p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
				aria-label="Email"
			>
				<Email size={18} />
			</a>
		</div>
	</div>
</footer>

<style>
	/* Matches the plain icon links beside it: same box, same colour travel. */
	.foot-icon {
		display: inline-flex;
		padding: 8px;
		/* Invisible at rest; it is the shape the focus ring traces. */
		border-radius: 8px;
		border: 0;
		background: none;
		color: var(--color-tertiary-fg);
		transition: color 400ms var(--ease-out);
	}

	.foot-icon:hover {
		color: var(--color-primary-fg);
	}
</style>
