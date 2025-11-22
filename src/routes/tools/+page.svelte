<script lang="ts">
	import { tools } from '../data';
</script>

<div class="container">
	<h1>Tools</h1>
	<div class="tools-grid">
		{#each tools as tool (tool.slug)}
			<a href="/tools/{tool.slug}" class="tool-card">
				<h2>{tool.title}</h2>
				<p>{tool.description}</p>
			</a>
		{/each}
	</div>
</div>
