"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { Field, Input } from "@/components/ui/fields";
import { Button, Badge } from "@/components/ui/primitives";
import { IconAlert } from "@/components/ui/icons";
import { isSupabaseConfigured } from "@/lib/db/config";

function useSupabase() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return { router, busy, setBusy, error, setError };
}

export function LoginForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { router, busy, setBusy, error, setError } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = dict.auth;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    setBusy(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message.includes("Invalid login") ? t.errors.invalidCredentials : t.errors.generic);
        return;
      }
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      {!isSupabaseConfigured() ? <Badge tone="demo" style={{ marginBlockEnd: "1rem" }}>{t.previewNotice}</Badge> : null}
      {error ? (
        <span className="field__error" style={{ marginBlockEnd: "0.75rem" }}>
          <IconAlert /> {error}
        </span>
      ) : null}
      <Field label={t.email} required htmlFor="l-email">
        <Input id="l-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </Field>
      <Field label={t.password} required htmlFor="l-pass">
        <Input id="l-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </Field>
      <div style={{ textAlign: "end", marginBlockEnd: "var(--sp-4)" }}>
        <a href={`/${locale}/forgot-password`} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
          {t.forgot}
        </a>
      </div>
      <Button type="submit" block loading={busy} disabled={!isSupabaseConfigured()}>
        {busy ? t.loggingIn : t.login}
      </Button>
    </form>
  );
}

export function RegisterForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { router, busy, setBusy, error, setError } = useSupabase();
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const t = dict.auth;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    setError(null);
    if (password.length < 8) {
      setError(t.errors.password);
      return;
    }
    if (password !== confirm) {
      setError(t.errors.confirm);
      return;
    }
    setBusy(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const { data, error: err } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { full_name_ar: nameAr, full_name_en: nameEn, grade, phone },
          emailRedirectTo: `${window.location.origin}/auth/callback?locale=${locale}&next=/dashboard`,
        },
      });
      if (err) {
        setError(err.message.includes("already") ? t.errors.emailInUse : t.errors.generic);
        return;
      }
      if (data.session) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      } else {
        // Email confirmation required — show the "check your email" state.
        router.push(`/${locale}/login?registered=1`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      {!isSupabaseConfigured() ? <Badge tone="demo" style={{ marginBlockEnd: "1rem" }}>{t.previewNotice}</Badge> : null}
      {error ? (
        <span className="field__error" style={{ marginBlockEnd: "0.75rem" }}>
          <IconAlert /> {error}
        </span>
      ) : null}
      <Field label={t.name} required htmlFor="r-name">
        <Input id="r-name" value={nameAr} onChange={(e) => setNameAr(e.target.value)} required autoComplete="name" />
      </Field>
      <Field label="Name (English)" htmlFor="r-name-en">
        <Input id="r-name-en" dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
      </Field>
      <Field label={t.email} required htmlFor="r-email">
        <Input id="r-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </Field>
      <Field label={t.grade} htmlFor="r-grade">
        <Input id="r-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
      </Field>
      <Field label={t.phone} htmlFor="r-phone">
        <Input id="r-phone" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <Field label={t.password} required htmlFor="r-pass">
        <Input id="r-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
      </Field>
      <Field label={t.confirmPassword} required htmlFor="r-pass2">
        <Input id="r-pass2" type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
      </Field>
      <Button type="submit" block loading={busy} disabled={!isSupabaseConfigured()}>
        {busy ? t.registering : t.register}
      </Button>
    </form>
  );
}

export function ForgotForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { busy, setBusy, error, setError } = useSupabase();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const t = dict.auth;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    setBusy(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const { error: err } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?locale=${locale}&next=/reset-password`,
      });
      if (err) setError(t.errors.generic);
      else setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="state">
        <span className="state__icon" style={{ color: "var(--c-success)" }}>✓</span>
        <h3>{t.resetSentTitle}</h3>
        <p>{t.resetSentMsg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {!isSupabaseConfigured() ? <Badge tone="demo" style={{ marginBlockEnd: "1rem" }}>{t.previewNotice}</Badge> : null}
      {error ? (
        <span className="field__error" style={{ marginBlockEnd: "0.75rem" }}>
          <IconAlert /> {error}
        </span>
      ) : null}
      <Field label={t.email} required htmlFor="f-email">
        <Input id="f-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Button type="submit" block loading={busy} disabled={!isSupabaseConfigured()}>
        {t.reset}
      </Button>
    </form>
  );
}
