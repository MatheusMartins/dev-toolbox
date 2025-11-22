<script>
	import { page } from '$app/stores';
	import { tools } from '../../data';
	import JsonExplorer from '$lib/tools/JsonExplorer.svelte';
	import CsvJsonConverter from '$lib/tools/CsvJsonConverter.svelte';
    import ColumnToCsv from '$lib/tools/ColumnToCsv.svelte';

	const currentTool = $derived(tools.find((t) => t.slug === $page.params.slug));
</script>

{#if currentTool}
	{#if currentTool.slug === 'json-explorer'}
		<JsonExplorer />
	{:else if currentTool.slug === 'csv-json-converter'}
		<CsvJsonConverter />
    {:else if currentTool.slug === 'column-to-csv'}
        <ColumnToCsv />
    {:else}
        <div class="error">Tool component not found</div>
	{/if}
{:else}
	<div class="error">Tool not found</div>
{/if}

<style>
	.error {
		padding: 2rem;
		color: #c00;
		font-size: 1.2rem;
	}
</style>
