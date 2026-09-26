import { diffLines, diffWordsWithSpace } from 'diff';

type DiffKind = 'equal' | 'add' | 'remove';

type DiffSegment = { text: string; highlight: boolean };

type DiffRow = {
  kind: DiffKind;
  leftLine?: number;
  rightLine?: number;
  segments: DiffSegment[];
};

type TextDiffResult = {
  diffOutput: DiffRow[];
  endedWithNewlineOldText: boolean;
  endedWithNewlineNewText: boolean;
};

export type { DiffKind, DiffSegment, DiffRow, TextDiffResult };

export function textDiff(textInputOld: string, textInputNew: string): TextDiffResult {
  let rightNo = 0;
  let leftNo = 0;
  const diffOutput: DiffRow[] = [];

  const normaliseInput = (text: string) => {
    let normalisedText = text.replace(/\r\n/g, '\n'); // all CRLF → LF
    const endedWithNewline = normalisedText.endsWith('\n');
    return { normalisedText, endedWithNewline };
  }

  const { 
    normalisedText: normalisedTextOld, 
    endedWithNewline: endedWithNewlineOldText 
  } = normaliseInput(textInputOld);
  const { 
    normalisedText: normalisedTextNew, 
    endedWithNewline: endedWithNewlineNewText 
  } = normaliseInput(textInputNew);

  const lineParts = diffLines(
    normalisedTextOld, 
    normalisedTextNew, 
    { ignoreNewlineAtEof: true },
  );

  // Add the diff lines to the output
  for (const part of lineParts) {
    const lines = part.value.replace(/\n$/, '').split('\n');
    for (const line of lines) {
      if (part.added) {
        diffOutput.push({ kind: 'add', rightLine: rightNo, segments: [{ text: line, highlight: true }] });
        rightNo++;
      } else if (part.removed) {
        diffOutput.push({ kind: 'remove', leftLine: leftNo, segments: [{ text: line, highlight: true }] });
        leftNo++;
      } else {
        diffOutput.push({ kind: 'equal', leftLine: leftNo, rightLine: rightNo, segments: [{ text: line, highlight: false }] });
        leftNo++;
        rightNo++;
      }
    }
  }

  // find hunks
  let i = 0;
  while (i < diffOutput.length) {
    // find remove block
    if (diffOutput[i].kind !== 'remove') {
      i++;
      continue;
    }
    const removeStart = i;
    while (i < diffOutput.length && diffOutput[i].kind === 'remove') {
      i++;
    }
    const removeEnd = i;

    // find add block
    let j = removeEnd;
    const addStart = j;
    while (j < diffOutput.length && diffOutput[j].kind === 'add') {
      j++;
    }
    const addEnd = j;

    // no add-blocks after remove-block, skip word highlight
    if (addStart === addEnd) {
      continue;
    }

    // pair remove[k] with add[k]
    const pairCount = Math.min(removeEnd - removeStart, addEnd - addStart);
    for (let k = 0; k < pairCount; k++) {
      const a = diffOutput[removeStart + k];
      const b = diffOutput[addStart + k];
      const { newSegments, oldSegments } = highlightPair(a, b);
      a.segments = oldSegments;
      b.segments = newSegments;
    }

    // move past this hunk
    i = addEnd;

  }

  return { diffOutput, endedWithNewlineOldText, endedWithNewlineNewText };

}

function highlightPair(a: DiffRow, b: DiffRow): { newSegments: DiffSegment[]; oldSegments: DiffSegment[] } {
  const oldText = a.segments.map(p => p.text).join('');
  const newText = b.segments.map(p => p.text).join('');
  if (oldText === newText) {
    return { 
      newSegments: [{ text: newText, highlight: false }],
      oldSegments: [{ text: oldText, highlight: false }] 
    };
  }
  const wordParts = diffWordsWithSpace(oldText, newText);
  const newSegments = wordParts.filter(p => !p.removed).map(p => ({ text: p.value, highlight: !!p.added }));
  const oldSegments = wordParts.filter(p => !p.added).map(p => ({ text: p.value, highlight: !!p.removed }));
  return { newSegments, oldSegments };
}
