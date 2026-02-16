<script>
	import { X, Email, ThemeToggle } from '$lib';
</script>

<footer
	class="
	flex h-fit w-full max-w-3xl flex-col items-start gap-y-2
	sm:px-4 pb-16 sm:flex-row sm:items-center sm:justify-between lg:pb-64
"
>
	<span class="order-2 sm:order-1 text-sm!">© 2026 Jason Coawette</span>
	
	<div class="order-1 sm:order-2 flex flex-row gap-1 items-center justify-center w-fit">
		<ThemeToggle />
		<a href="https://x.com/jasoncoawette" class="inline-flex text-tertiary-fg! btn-icon hover:text-primary-fg! transition-colors duration-400 ease-out">
			<X size={16}/>
		</a>
		<a href="mailto:jason.coawette@gmail.com" class="inline-flex text-tertiary-fg! btn-icon hover:text-primary-fg! transition-colors duration-400 ease-out">
			<Email size={18}/>
		</a>
	</div>
</footer>
