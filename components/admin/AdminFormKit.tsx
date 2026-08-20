"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import { Button } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { IconTrash, IconUpload } from "@/components/ui/icons";
import { useToast } from "@/components/ui/overlay";

/** Save + Cancel bar used by every admin form. */
export function SaveBar({
  dict,
  onSave,
  onCancel,
  saving,
  disabled,
}: {
  dict: Dictionary;
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
  disabled?: boolean;
}) {
  const a = dict.admin;
  return (
    <div className="exam-nav" style={{ borderBlockStart: "1px solid var(--c-line)", paddingBlockStart: "var(--sp-5)", marginBlockStart: "var(--sp-6)" }}>
      {onCancel ? <Button variant="ghost" onClick={onCancel}>{a.cancel}</Button> : <span />}
      <Button onClick={onSave} loading={saving} disabled={disabled}>
        {a.save}
      </Button>
    </div>
  );
}

/** Delete button with confirmation modal — performs the DB delete itself. */
export function DeleteButton({
  dict,
  table,
  id,
  onDone,
}: {
  dict: Dictionary;
  table: string;
  id: string;
  onDone?: () => void;
}) {
  const a = dict.admin;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const confirm = async () => {
    setBusy(true);
    try {
      const { deleteRow } = await import("@/lib/data/writes");
      const res = await deleteRow(table, id);
      if (!res.ok) throw new Error(res.error);
      toast("success", a.deleted);
      onDone?.();
      window.location.reload();
    } catch {
      toast("error", a.deleteFailed);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button className="icon-btn icon-btn--danger" onClick={() => setOpen(true)} aria-label={a.delete}>
        <IconTrash />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={a.delete}>
        <p className="text-muted" style={{ marginBlockEnd: "var(--sp-5)" }}>{a.deleteConfirm}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setOpen(false)}>{a.cancel}</Button>
          <Button variant="danger" onClick={confirm} loading={busy}>{a.delete}</Button>
        </div>
      </Modal>
    </>
  );
}

/** File upload — sends to Supabase Storage when configured. */
export function FileUpload({
  dict,
  label,
  value,
  onChange,
  accept = "application/pdf,image/*,.doc,.docx,.ppt,.pptx",
  bucket = "materials",
  preview = false,
}: {
  dict: Dictionary;
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  bucket?: "materials" | "course-images" | "avatars";
  preview?: boolean;
}) {
  const a = dict.admin;
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const { uploadFile } = await import("@/lib/data/admin");
      const res = await uploadFile(bucket, file);
      if (res.ok) {
        onChange(res.url);
        toast("success", a.saved);
      } else {
        toast("error", res.error === "preview_mode" ? a.previewNotice : a.uploadFailed);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <span className="field__label">{label}</span>
      <div
        className="dropzone"
        data-drag={busy}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <IconUpload />
        <span className="text-muted" style={{ fontSize: "var(--fs-sm)", fontWeight: 700 }}>
          {a.materialFields.uploadNew}
        </span>
        {busy ? <span className="btn__spinner" /> : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {value ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {preview && !value.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "var(--r-sm)" }} />
          ) : null}
          <a href={value} target="_blank" rel="noopener noreferrer" className="link-underline" style={{ fontSize: "var(--fs-sm)", wordBreak: "break-all" }}>
            {value}
          </a>
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>{dict.common.delete}</Button>
        </div>
      ) : null}
    </div>
  );
}
