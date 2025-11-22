<script lang="ts">
	import { page } from '$app/stores';
	import { tools } from '../../data';

	let { children } = $props();

	const currentTool = $derived(tools.find((t) => t.slug === $page.params.slug));
</script>

<div class="layout">
	<main>
		<h1>{currentTool?.title || 'Tool'}</h1>
		<p>{currentTool?.description}</p>
		<div class="tool-content">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.layout {
		padding: 1rem;
	}

	main {
		max-width: 900px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: #666;
		margin-bottom: 1.5rem;
	}

	.tool-content {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		background: #fafafa;
	}
</style>
