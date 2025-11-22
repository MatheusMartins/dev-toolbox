<script lang="ts">
	let jsonInput: string = '';
	let error: string = '';
	let jsonOutput: string = '';
</script>

<div class="column-to-csv-tool">
	<div class="controls">
		<textarea
			placeholder="Paste a column of text here"
			bind:value={jsonInput}
			rows="6"
		></textarea>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<!-- Settings: item prefix/sulfix, list prefix/sulfix -->

	<fieldset class="grid grid-cols-2 gap-4 mb-4 mt-4 p-4 border border-gray-300 rounded">
		<legend>Settings</legend>
		<p>Item Prefix: <input type="text" id="itemPrefix" /></p>
		<p>Item Suffix: <input type="text" id="itemSuffix" /></p>
		<p>List Prefix: <input type="text" id="listPrefix" /></p>
		<p>List Suffix: <input type="text" id="listSuffix" /></p>
	</fieldset>

	<div class="button-group">
		<button on:click={() => {
			const lines = jsonInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
			const itemPrefix = document.getElementById('itemPrefix')?.value || '';
			const itemSuffix = document.getElementById('itemSuffix')?.value || '';	
			for (let i = 0; i < lines.length; i++) {
				lines[i] = itemPrefix + lines[i] + itemSuffix;
			}
			const listPrefix = document.getElementById('listPrefix')?.value || '';
			const listSuffix = document.getElementById('listSuffix')?.value || '';
			jsonOutput = listPrefix + lines.join(',') + listSuffix;
		}}>
			Convert to CSV
		</button>
		<button on:click={() => {
			navigator.clipboard.writeText(jsonOutput);
		}}>
			Copy CSV
		</button>
	</div>
	{#if jsonOutput}
		<h3>CSV Output</h3>
	    <p>{jsonOutput}</p>
	{/if}
</div>
