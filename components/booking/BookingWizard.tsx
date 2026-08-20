"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/lib/db/types";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { Button, Card, Badge } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";
import { IconArrow, IconCheckCircle, IconWhatsApp } from "@/components/ui/icons";
import { whatsappLink, cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/db/config";

interface BookingState {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  grade: string;
  notes: string;
}

const empty: BookingState = {
  service: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  grade: "",
  notes: "",
};

const TIME_SLOTS = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingWizard({
  locale,
  dict,
  config,
}: {
  locale: Locale;
  dict: Dictionary;
  config: SiteConfig;
}) {
  const t = dict.booking;
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BookingState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (key: keyof BookingState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    const list: { iso: string; label: string; short: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 5) continue; // Friday — Egyptian weekend
      const label = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(d);
      const short = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
        weekday: "short",
        day: "numeric",
      }).format(d);
      list.push({ iso: localDateString(d), label, short });
    }
    return list;
  }, [locale, today]);

  const availableTimes = useMemo(() => {
    const now = new Date();
    const nowStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (form.date === localDateString(now)) {
      return TIME_SLOTS.filter((slot) => slot > nowStr);
    }
    return TIME_SLOTS;
  }, [form.date]);

  const serviceLabel = (id: string) => t.services.find((s) => s.id === id)?.label ?? id;

  const validateStep = (): boolean => {
    const next: Record<string, string> = {};
    if (step === 0 && !form.service) next.service = t.errors.service;
    if (step === 1 && !form.date) next.date = t.errors.date;
    if (step === 2 && !form.time) next.time = t.errors.time;
    if (step === 3) {
      if (!form.name.trim()) next.name = t.errors.name;
      if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) next.phone = t.errors.phone;
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = t.errors.email;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirm = async () => {
    if (!form.service || !form.date || !form.time || !form.name || !form.phone) return;
    setSending(true);
    try {
      const { createBooking } = await import("@/lib/data/writes");
      const result = await createBooking({
        service: form.service,
        booking_date: form.date,
        booking_time: form.time,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        grade: form.grade.trim() || null,
        notes: form.notes.trim() || null,
      });
      if (result.ok) {
        setPreview(Boolean(result.preview));
        setDone(true);
        toast("success", t.successTitle);
      } else {
        toast("error", t.errors.phone);
      }
    } catch {
      toast("error", t.errors.phone);
    } finally {
      setSending(false);
    }
  };

  const waMessage = () => {
    const service = serviceLabel(form.service);
    return [
      dict.whatsapp.booking,
      "",
      `${t.serviceLabel}: ${service}`,
      `${t.dateLabel}: ${form.date}`,
      `${t.timeLabel}: ${form.time}`,
      `${t.contactLabel}: ${form.name} — ${form.phone}`,
    ].join("\n");
  };

  /* ── Success state ─────────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="state">
        <span className="state__icon" style={{ color: "var(--c-success)" }}>
          <IconCheckCircle />
        </span>
        <h3>{t.successTitle}</h3>
        <p>{t.successMsg}</p>
        {preview ? <Badge tone="demo">{t.previewNotice}</Badge> : null}
        <div className="state__action" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            href={whatsappLink(config.whatsapp, waMessage())}
            variant="accent"
            target="_blank"
            rel="noopener noreferrer"
            icon={<IconWhatsApp />}
          >
            {t.successWhatsapp}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setForm(empty);
              setDone(false);
              setStep(0);
            }}
          >
            {t.makeAnother}
          </Button>
        </div>
      </div>
    );
  }

  const steps = t.steps;

  return (
    <div className="wizard">
      {/* Step indicator */}
      <div className="wizard__steps" aria-label={t.title}>
        {steps.map((label, i) => (
          <span key={label} style={{ display: "contents" }}>
            {i > 0 ? <span className="wizard__connector" aria-hidden="true" /> : null}
            <span
              className="wizard__step"
              data-state={i < step ? "done" : i === step ? "active" : "pending"}
            >
              <span className="step-num">{i < step ? "✓" : i + 1}</span>
              {label}
            </span>
          </span>
        ))}
      </div>

      <Card className="dash-card">
        {/* Step 1 — service */}
        {step === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h2 className="dash-card__title">{t.step1Title}</h2>
            {errors.service ? <span className="field__error">{errors.service}</span> : null}
            {t.services.map((s) => (
              <button
                key={s.id}
                className="option"
                aria-pressed={form.service === s.id}
                onClick={() => set("service")(s.id)}
              >
                <span className="option__key">{s.id === "private" ? "١" : s.id === "group" ? "٢" : s.id === "exam-prep" ? "٣" : "٤"}</span>
                <span>
                  <strong>{s.label}</strong>
                  <br />
                  <small className="text-faint">{s.hint}</small>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Step 2 — date */}
        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h2 className="dash-card__title">{t.step2Title}</h2>
            {errors.date ? <span className="field__error">{errors.date}</span> : null}
            <div className="time-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(7.5rem, 1fr))" }}>
              {days.map((d) => (
                <button
                  key={d.iso}
                  className="time-slot"
                  aria-pressed={form.date === d.iso}
                  onClick={() => {
                    set("date")(d.iso);
                    set("time")("");
                  }}
                  style={{ paddingBlock: "0.85rem" }}
                >
                  <span style={{ display: "block", fontSize: "var(--fs-sm)" }}>{d.label}</span>
                  <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)", marginBlockStart: "0.2rem" }}>{d.short}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Step 3 — time */}
        {step === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h2 className="dash-card__title">{t.step3Title}</h2>
            {errors.time ? <span className="field__error">{errors.time}</span> : null}
            <div className="time-grid">
              {availableTimes.map((slot) => (
                <button
                  key={slot}
                  className="time-slot"
                  aria-pressed={form.time === slot}
                  onClick={() => set("time")(slot)}
                  dir="ltr"
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="field__hint">{t.timezoneHint}</p>
          </div>
        ) : null}

        {/* Step 4 — details */}
        {step === 3 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 className="dash-card__title" style={{ marginBlockEnd: "var(--sp-5)" }}>{t.step4Title}</h2>
            <Field label={t.name} required error={errors.name} htmlFor="b-name">
              <Input id="b-name" value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder={t.namePlaceholder} />
            </Field>
            <Field label={t.phone} required error={errors.phone} htmlFor="b-phone">
              <Input id="b-phone" dir="ltr" value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder={t.phonePlaceholder} />
            </Field>
            <Field label={t.email} error={errors.email} htmlFor="b-email">
              <Input id="b-email" type="email" dir="ltr" value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder={t.emailPlaceholder} />
            </Field>
            <Field label={t.grade} htmlFor="b-grade">
              <Input id="b-grade" value={form.grade} onChange={(e) => set("grade")(e.target.value)} />
            </Field>
            <Field label={t.notes} htmlFor="b-notes">
              <Textarea id="b-notes" value={form.notes} onChange={(e) => set("notes")(e.target.value)} placeholder={t.notesPlaceholder} />
            </Field>
          </div>
        ) : null}

        {/* Step 5 — confirm */}
        {step === 4 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h2 className="dash-card__title">{t.confirmTitle}</h2>
            <p className="text-muted">{t.confirmSummary}</p>
            <div className="card card--inset" style={{ padding: "var(--sp-5)" }}>
              {[
                [t.serviceLabel, serviceLabel(form.service)],
                [t.dateLabel, form.date],
                [t.timeLabel, form.time],
                [t.contactLabel, `${form.name} · ${form.phone}${form.email ? ` · ${form.email}` : ""}`],
                ...(form.notes ? [[t.notes, form.notes] as [string, string]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", paddingBlock: "0.5rem", borderBlockEnd: "1px solid var(--c-line)" }}>
                  <span className="text-faint">{k}</span>
                  <strong style={{ textAlign: "end" }}>{v}</strong>
                </div>
              ))}
            </div>
            <p className="field__hint">{t.whatsappNote}</p>
          </div>
        ) : null}

        {/* Nav buttons */}
        <div className="exam-nav" style={{ marginBlockStart: "var(--sp-6)", borderBlockStart: "1px solid var(--c-line)", paddingBlockStart: "var(--sp-5)" }}>
          {step > 0 ? (
            <Button variant="ghost" onClick={back} icon={<IconArrow style={{ transform: "scaleX(-1)" }} />}>
              {t.back}
            </Button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button onClick={next} icon={<IconArrow />}>
              {t.next}
            </Button>
          ) : (
            <Button onClick={confirm} loading={sending} variant="accent">
              {t.confirm}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
