<script lang="ts">
	import { segments, type Entry } from '$lib/data/experience';

	let { entry, index }: { entry: Entry; index: number } = $props();
</script>

<li class="tl-entry" style="--reveal-delay: {120 + index * 70}ms">
	<div class="tl-logos">
		<span class="tl-logo" aria-hidden="true">
			{#if entry.logo}
				<img src={entry.logo} alt="" />
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
				{entry.org}
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

	{#if entry.links?.length}
		<div class="tl-links">
			{#each entry.links as link (link.href)}
				<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
			{/each}
		</div>
	{/if}

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
</li>
