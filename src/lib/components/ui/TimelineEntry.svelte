<script lang="ts">
	import { segments, type Entry } from '$lib/data/experience';
	import ProjectDeck from './ProjectDeck.svelte';

	let { entry, index }: { entry: Entry; index: number } = $props();
</script>

<li class="tl-entry" style="--reveal-delay: {120 + index * 70}ms">
	<div class="tl-logos">
		<span class="app-icon" class:is-art={!!entry.logo} aria-hidden="true">
			{#if entry.logo}
				<img src={entry.logo} alt="" />
			{:else if entry.emoji}
				<span class="tl-emoji">{entry.emoji}</span>
			{:else}
				{entry.initials}
			{/if}
		</span>
	</div>

	<div class="tl-head">
		<!-- Both of these hang off .tl-head, not .tl-entry: this is the first
		     ancestor whose box starts past the entry indent, which is what
		     --rail-x is measured against. -->
		<span class="tl-dot" aria-hidden="true"></span>

		<span class="tl-when" aria-hidden="true">
			{#if entry.month}<span class="tl-month">{entry.month}</span>{/if}
			<span class="tl-year">{entry.year}</span>
		</span>

		{#if entry.href}
			<a class="tl-company" href={entry.href} target="_blank" rel="noopener noreferrer">
				<span class="link-text">{entry.org}</span>
			</a>
		{:else}
			<span class="tl-company">{entry.org}</span>
		{/if}
		{#if entry.badge}
			<span class="tl-badge">{entry.badge}</span>
		{/if}
	</div>

	<p class="tl-role">
		{entry.role}
		<span class="tl-dates">· {entry.dates}</span>
	</p>

	{#if entry.bullets.length}
		<ul class="tl-desc">
			{#each entry.bullets as bullet (bullet)}
				<li>
					{#each segments(bullet) as part, i (i)}
						{#if part.strong}<strong>{part.text}</strong>{:else}{part.text}{/if}
					{/each}
				</li>
			{/each}
		</ul>
	{/if}

	{#if entry.links?.length}
		<ProjectDeck links={entry.links} fallbackIcon={entry.logo} noun={entry.linkNoun} />
	{/if}
</li>
