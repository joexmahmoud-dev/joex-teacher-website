/** Result of a write operation from the data layer. */
export type WriteResult =
  | { ok: true; preview?: boolean; id?: string }
  | { ok: false; error: string; preview?: boolean };

export const previewBlocked = (): WriteResult => ({
  ok: false,
  error: "preview_mode",
  preview: true,
});

export const previewOk = (): WriteResult => ({ ok: true, preview: true });
