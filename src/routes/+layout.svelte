<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<nav class="
	sticky top-0
	flex flex-row justify-start items-between
	w-full max-w-4xl h-fit
">
	<h1>Jason Coawette</h1>
	<!-- Button Wrapper -->
	<!--	Button	-->
	<!--	Button  -->
</nav>
<main class="
	flex flex-col justify-start items-center
	w-full max-w-4xl h-fit
	mt-3
">
	{@render children()}
</main>
