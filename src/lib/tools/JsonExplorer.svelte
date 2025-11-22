<script lang="ts">
	let jsonInput: string = '';
	let parsedData: unknown = null;
	let error: string = '';

	function parseJson() {
		try {
			error = '';
			parsedData = JSON.parse(jsonInput);
		} catch (e) {
			error = `Invalid JSON: ${(e as Error).message}`;
			parsedData = null;
		}
	}

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				jsonInput = (e.target?.result as string) || '';
				parseJson();
			};
			reader.readAsText(file);
		}
	}

	function formatJson() {
		try {
			const parsed = JSON.parse(jsonInput);
			jsonInput = JSON.stringify(parsed, null, 2);
			parseJson();
		} catch (e) {
			error = `Cannot format: ${(e as Error).message}`;
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	function isExpandable(value: unknown): boolean {
		return typeof value === 'object' && value !== null;
	}

	function getPreview(value: unknown): string {
		if (Array.isArray(value)) {
			return `[${value.length} items]`;
		} else if (typeof value === 'object') {
			return `{${Object.keys(value as Record<string, unknown>).length} keys}`;
		}
		return String(value);
	}
</script>

<div class="json-explorer">
	<div class="controls">
		<textarea
			placeholder="Paste JSON here or upload a file..."
			bind:value={jsonInput}
			rows="6"
		></textarea>
		<div class="button-group">
			<button on:click={parseJson}>Parse JSON</button>
			<button on:click={formatJson}>Format JSON</button>
            <button on:click={() => {
                document.getElementById('file-input')?.click();
            }}>Upload file</button>
			<input type="file" id="file-input" accept=".json" on:change={handleFileUpload} style="display:none" />
		</div>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#if parsedData !== null}
		<div class="viewer">
			<h3>Parsed Data</h3>
			<div class="tree">
				<pre>{JSON.stringify(parsedData, null, 2)}</pre>
			</div>
			<button on:click={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}>
				Copy Formatted JSON
			</button>
		</div>
	{/if}
</div>
