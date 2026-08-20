"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { BookingStatus } from "@/lib/db/types";
import { useToast } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";

const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export function BookingActions({
  dict,
  id,
  status,
}: {
  dict: Dictionary;
  id: string;
  status: BookingStatus;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const update = async (next: BookingStatus) => {
    if (next === status) return;
    setBusy(next);
    try {
      const { updateBookingStatus } = await import("@/lib/data/writes");
      const res = await updateBookingStatus(id, next);
      if (res.ok) {
        toast("success", dict.admin.saved);
        window.location.reload();
      } else {
        toast("error", res.error === "preview_mode" ? dict.admin.previewNotice : dict.admin.saveFailed);
      }
    } finally {
      setBusy(null);
    }
  };

  const labels: Record<BookingStatus, string> = {
    pending: dict.admin.bookingFields.markConfirmed,
    confirmed: dict.admin.bookingFields.markCompleted,
    completed: dict.dashboard.statusCompleted,
    cancelled: dict.admin.bookingFields.markCancelled,
  };

  return (
    <div className="row-actions">
      {statuses
        .filter((s) => s !== status)
        .map((s) => (
          <button
            key={s}
            className={cn("badge", "badge--outline", "btn--sm", busy === s && "btn__spinner")}
            onClick={() => update(s)}
            disabled={busy !== null}
            title={labels[s]}
          >
            {busy === s ? "" : labels[s]}
          </button>
        ))}
    </div>
  );
}
