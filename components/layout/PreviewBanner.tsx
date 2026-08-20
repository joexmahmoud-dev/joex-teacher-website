"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/db/config";
import { IconClose, IconInfo } from "@/components/ui/icons";

const STORAGE_KEY = "joex-preview-dismissed";

/**
 * Visible only when Supabase is NOT configured. Reminds visitors that the
 * site is running on bundled demo seed data until the persistent database
 * is connected (see SETUP.md).
 */
export function PreviewBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured()) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    setVisible(!dismissed);
  }, []);

  if (!visible) return null;

  return (
    <div className="preview-banner" role="status">
      <IconInfo />
      <span>{message}</span>
      <button
        className="preview-banner__close"
        onClick={() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }}
        aria-label="Dismiss"
      >
        <IconClose />
      </button>
    </div>
  );
}
