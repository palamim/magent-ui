export interface FileDiff {
  path: string;
  status: 'modified' | 'created' | 'deleted';
  hunks: string; // the diff body for this file (the +/- lines)
}

export const parseDiff = (raw: string): FileDiff[] => {
  if (!raw.trim()) return [];

  // each file section starts with "diff --git a/… b/…"
  const sections = raw.split(/^diff --git /m).filter(Boolean);

  return sections.map((section) => {
    const body = 'diff --git ' + section;

    // path from the "+++ b/path" line (or "--- a/path" for deletions)
    const plusMatch = body.match(/^\+\+\+ b\/(.+)$/m);
    const minusMatch = body.match(/^--- a\/(.+)$/m);
    const path = plusMatch?.[1] ?? minusMatch?.[1] ?? 'unknown';

    // status from the new-file / deleted-file markers
    const status: FileDiff['status'] = body.includes('new file mode')
      ? 'created'
      : body.includes('deleted file mode')
        ? 'deleted'
        : 'modified';

    return { path, status, hunks: body };
  });
};
