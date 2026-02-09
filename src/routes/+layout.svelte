<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<nav class="
	sticky top-0
	flex flex-row justify-center items-between
	w-full max-w-4xl h-fit
">
	<h1>Jason Coawette</h1>
	<!-- Button Wrapper -->
	<!--	Button	-->
	<!--	Button  -->
</nav>
<main>
	{@render children()}
</main>
