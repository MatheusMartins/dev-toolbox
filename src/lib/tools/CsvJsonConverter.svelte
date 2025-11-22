<script lang="ts">
	let csvInput: string = '';
	let jsonInput: string = '';
	let mode: 'csv-to-json' | 'json-to-csv' = 'csv-to-json';
	let error: string = '';

	function csvToJson() {
		try {
			error = '';
			const lines = csvInput.trim().split('\n');
			if (lines.length === 0) {
				error = 'No data to convert';
				return;
			}

			const headers = lines[0].split(',').map((h) => h.trim());
			const result: Record<string, unknown>[] = [];

			for (let i = 1; i < lines.length; i++) {
				const obj: Record<string, string> = {};
				const values = lines[i].split(',').map((v) => v.trim());
				headers.forEach((header, index) => {
					obj[header] = values[index] || '';
				});
				result.push(obj);
			}

			jsonInput = JSON.stringify(result, null, 2);
		} catch (e) {
			error = `Conversion error: ${(e as Error).message}`;
		}
	}

	function jsonToCsv() {
		try {
			error = '';
			const data = JSON.parse(jsonInput);

			if (!Array.isArray(data)) {
				error = 'JSON must be an array of objects';
				return;
			}

			if (data.length === 0) {
				error = 'Array is empty';
				return;
			}

			const headers = Object.keys(data[0]);
			const rows = [headers.join(',')];

			data.forEach((row: Record<string, unknown>) => {
				const values = headers.map((h) => String(row[h] || ''));
				rows.push(values.join(','));
			});

			csvInput = rows.join('\n');
		} catch (e) {
			error = `Conversion error: ${(e as Error).message}`;
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<div class="converter">
	<div class="mode-selector">
		<label>
			<input type="radio" bind:group={mode} value="csv-to-json" />
			CSV to JSON
		</label>
		<label>
			<input type="radio" bind:group={mode} value="json-to-csv" />
			JSON to CSV
		</label>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#if mode === 'csv-to-json'}
		<div class="section">
			<h3>CSV Input</h3>
			<textarea bind:value={csvInput} placeholder="Paste CSV data here..." rows="6"></textarea>
			<button on:click={csvToJson}>Convert to JSON</button>
		</div>
		{#if jsonInput}
			<div class="section">
				<h3>JSON Output</h3>
				<textarea bind:value={jsonInput} readonly rows="6"></textarea>
				<button on:click={() => copyToClipboard(jsonInput)}>Copy JSON</button>
			</div>
		{/if}
	{:else}
		<div class="section">
			<h3>JSON Input</h3>
			<textarea bind:value={jsonInput} placeholder="Paste JSON array here..." rows="6"></textarea>
			<button on:click={jsonToCsv}>Convert to CSV</button>
		</div>
		{#if csvInput}
			<div class="section">
				<h3>CSV Output</h3>
				<textarea bind:value={csvInput} readonly rows="6"></textarea>
				<button on:click={() => copyToClipboard(csvInput)}>Copy CSV</button>
			</div>
		{/if}
	{/if}
</div>
