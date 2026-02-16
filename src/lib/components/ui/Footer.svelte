<script>
	import { X, Email, ThemeToggle } from '$lib';
</script>

<footer
	class="
	flex h-fit w-full max-w-3xl gap-y-2 px-4 pb-16 flex-row items-center justify-between lg:pb-64
"
>
	<span class="text-sm! text-tertiary-fg">© 2026 Jason Coawette</span>
	
	<div class="flex flex-row gap-1 items-center justify-center w-fit">
		<ThemeToggle />
		<a href="https://x.com/jasoncoawette" class="inline-flex p-2 text-tertiary-fg! hover:text-primary-fg! transition-colors duration-400 ease-out">
			<X size={16}/>
		</a>
		<a href="mailto:jason.coawette@gmail.com" class="inline-flex p-2 text-tertiary-fg! hover:text-primary-fg! transition-colors duration-400 ease-out">
			<Email size={18}/>
		</a>
	</div>
</footer>
