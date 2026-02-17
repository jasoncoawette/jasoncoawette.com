<script lang="ts">
	import { caseStudies } from '$lib/content/case-studies';
</script>

<svelte:head>
	<title>Case Studies</title>
</svelte:head>

<section class="flex h-full w-full flex-col items-start justify-start pt-6 pb-32 sm:pt-0">
	<h1 id="page-title">Case Studies</h1>
	<ul class="mt-8 flex h-200 sm:h-100 w-full flex-col items-start justify-end sm:justify-center sm:flex-row gap-8 sm:gap-16">
		{#each caseStudies as { slug, title } (slug)}
			<li class="glass-ghost btn-text cursor-pointer">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href='/case-studies/[slug]' class="cursor-pointer">{title}</a>
			</li>
		{/each}
	</ul>

</section>
