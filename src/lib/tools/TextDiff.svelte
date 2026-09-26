<script lang="ts">
	import { textDiff } from './textDiff';
	import type { DiffRow, DiffKind, DiffSegment, TextDiffResult } from './textDiff';
	let textInput1: string = '';
	let textInput2: string = '';
	let diffOutput: DiffRow[] | null = null;
	let endedWithNewlineOldText: boolean = false;
	let endedWithNewlineNewText: boolean = false;
	let leftPane: HTMLDivElement;
	let rightPane: HTMLDivElement;
	let scrollLock = false;
	function syncScroll(source: HTMLDivElement, target: HTMLDivElement) {
		if (scrollLock) return;
		scrollLock = true;
		target.scrollLeft = source.scrollLeft;
		scrollLock = false;
	}
	function compareTexts() {
		const result: TextDiffResult = textDiff(textInput1, textInput2);
		diffOutput = result.diffOutput;
		endedWithNewlineOldText = result.endedWithNewlineOldText;
		endedWithNewlineNewText = result.endedWithNewlineNewText;
	}
	function rowClass(kind: DiffKind) {
		if (kind === 'equal') return 'text-gray-500';
		if (kind === 'remove') return 'bg-red-100 text-red-900';
		return 'bg-green-100 text-green-900';
	}
	function segmentClass(segment: DiffSegment, side: 'left' | 'right') {
		if (!segment.highlight) return '';
		return side === 'left' ? 'bg-red-200' : 'bg-green-200';
	}
</script>

<div class="text-diff-tool">
	<div class="controls flex flex-col gap-4 md:flex-row">
		<textarea
			placeholder="Paste the first text here"
			bind:value={textInput1}
			rows="6"
		></textarea>
		<textarea
			placeholder="Paste the second text here"
			bind:value={textInput2}
			rows="6"
		></textarea>
	</div>

	<div class="button-group">
		<button onclick={compareTexts}>
			Compare Texts
		</button>
	</div>
	<div class="flex h-[32rem] flex-col overflow-hidden rounded border border-gray-300 font-mono text-sm">
		<div class="flex shrink-0 select-none border-b border-gray-300 bg-gray-50 text-xs text-gray-600">
			<div class="w-1/2 border-r border-gray-300 px-2 py-1">Left</div>
			<div class="w-1/2 px-2 py-1">Right</div>
		</div>
		<div class="min-h-0 flex-1 overflow-y-auto">
			<div class="flex min-h-full items-start">
				<div
					class="w-1/2 min-w-0 overflow-x-auto overflow-y-clip border-r border-gray-300"
					bind:this={leftPane}
					onscroll={() => syncScroll(leftPane, rightPane)}
				>
					{#each diffOutput ?? [] as row}
						{@render line('left', row)}
					{/each}
				</div>
				<div
					class="w-1/2 min-w-0 overflow-x-auto overflow-y-clip"
					bind:this={rightPane}
					onscroll={() => syncScroll(rightPane, leftPane)}
				>
					{#each diffOutput ?? [] as row}
						{@render line('right', row)}
					{/each}
				</div>
			</div>
		</div>
	</div>
	
	{#snippet line(side: 'left' | 'right', row: DiffRow)}
		{@const lineNo = side === 'left' ? row.leftLine : row.rightLine}
		{@const show = side === 'left' ? row.kind !== 'add' : row.kind !== 'remove'}
		<div class="flex min-h-6 leading-6 {show ? rowClass(row.kind) : ''}">
			<span class="sticky left-0 z-10 w-10 shrink-0 select-none border-r border-black/10 bg-inherit pr-2 text-right text-gray-500 tabular-nums">
				{show && lineNo != null ? lineNo + 1 : ''}
			</span>
			<span class="whitespace-pre">
				{#if show}
					{#each row.segments as segment}
						<span class={segmentClass(segment, side)}>{segment.text}</span>
					{/each}
				{/if}
			</span>
		</div>
	{/snippet}
 
	
	<!-- show a message only if flags differ -->
	<div class="w-full text-xs text-gray-500 flex flex-row gap-1">
		<div class="w-1/2">
			{#if endedWithNewlineOldText !== endedWithNewlineNewText && diffOutput && !endedWithNewlineOldText}
				Left-hand text does not end with a newline
			{/if}
		</div>
		<div class="w-1/2">
			{#if endedWithNewlineOldText !== endedWithNewlineNewText && diffOutput && !endedWithNewlineNewText}
			Right-hand text does not end with a newline
			{/if}
		</div>
	</div>

</div>
