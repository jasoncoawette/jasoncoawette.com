<script>
	import { X, Email, ThemeToggle } from '$lib';
</script>

<footer
	class="
	flex h-fit w-full max-w-3xl flex-row items-center justify-between gap-y-2 px-4 pb-16
"
>
	<span class="text-sm! text-tertiary-fg! select-none!">© 2026 Jason Coawette</span>

	<div class="flex w-fit flex-row items-center justify-center gap-1">
		<ThemeToggle />
		<a
			href="https://x.com/jasoncoawette"
			class="inline-flex p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
		>
			<X size={16} />
		</a>
		<a
			href="mailto:jason.coawette@gmail.com"
			class="inline-flex p-2 text-tertiary-fg! transition-colors duration-400 ease-out hover:text-primary-fg!"
		>
			<Email size={18} />
		</a>
	</div>
</footer>
