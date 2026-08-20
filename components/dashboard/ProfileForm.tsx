"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { Profile } from "@/lib/db/types";
import { Field, Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";

export function ProfileForm({
  profile,
  email,
  dict,
}: {
  profile: Profile | null;
  email: string;
  dict: Dictionary;
}) {
  const d = dict.dashboard;
  const { toast } = useToast();
  const [nameAr, setNameAr] = useState(profile?.full_name_ar ?? "");
  const [nameEn, setNameEn] = useState(profile?.full_name_en ?? "");
  const [grade, setGrade] = useState(profile?.grade ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const { updateProfile } = await import("@/lib/data/writes");
      const res = await updateProfile({ fullNameAr: nameAr, fullNameEn: nameEn, grade, phone });
      if (res.ok) toast("success", d.saved);
      else toast("error", dict.common.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Field label={d.emailLabel} htmlFor="p-email">
        <Input id="p-email" dir="ltr" value={email} disabled />
      </Field>
      <Field label={d.fullName} htmlFor="p-name-ar">
        <Input id="p-name-ar" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
      </Field>
      <Field label="Name (English)" htmlFor="p-name-en">
        <Input id="p-name-en" dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      </Field>
      <Field label={d.grade} htmlFor="p-grade">
        <Input id="p-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
      </Field>
      <Field label={d.phone} htmlFor="p-phone">
        <Input id="p-phone" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <div style={{ marginBlockStart: "var(--sp-2)" }}>
        <Button onClick={save} loading={busy}>{d.saveProfile}</Button>
      </div>
    </div>
  );
}
