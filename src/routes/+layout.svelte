<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<nav
	class="
	items-between sticky
	top-0 flex h-fit w-full
	max-w-4xl flex-row justify-start
"
>
	<h1>Jason Coawette</h1>
	<!-- Button Wrapper -->
	<!--	Button	-->
	<!--	Button  -->
</nav>
<main
	class="
	mt-3 flex h-fit w-full
	max-w-4xl flex-col items-center
	justify-start
"
>
	{@render children()}
</main>
