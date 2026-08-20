"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";
import { IconCheckCircle, IconMessage, IconWhatsApp } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/utils";
import type { SiteConfig } from "@/lib/db/types";

export function ContactForm({
  dict,
  config,
}: {
  dict: Dictionary;
  config: SiteConfig;
}) {
  const t = dict.contact;
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.errors.email;
    if (!message.trim()) next.message = t.errors.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      const { createMessage } = await import("@/lib/data/writes");
      const result = await createMessage({ name: name.trim(), email: email.trim(), phone: phone.trim() || null, message: message.trim() });
      if (result.ok) {
        setSent(true);
        toast("success", t.successTitle);
      } else {
        toast("error", t.errorMsg);
      }
    } catch {
      toast("error", t.errorMsg);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="state">
        <span className="state__icon" style={{ color: "var(--c-success)" }}>
          <IconCheckCircle />
        </span>
        <h3>{t.successTitle}</h3>
        <p>{t.successMsg}</p>
        <div className="state__action">
          <Button
            href={whatsappLink(config.whatsapp, dict.whatsapp.hello)}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
            icon={<IconWhatsApp />}
          >
            {dict.whatsapp.contact}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Field label={t.name} required error={errors.name} htmlFor="c-name">
        <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} />
      </Field>
      <Field label={t.phone} htmlFor="c-phone">
        <Input id="c-phone" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0100 000 0000" />
      </Field>
      <Field label={t.email} required error={errors.email} htmlFor="c-email">
        <Input id="c-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} />
      </Field>
      <Field label={t.message} required error={errors.message} htmlFor="c-msg">
        <Textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.messagePlaceholder} />
      </Field>
      <div style={{ marginBlockStart: "var(--sp-2)" }}>
        <Button onClick={submit} loading={sending} block icon={<IconMessage />}>
          {sending ? t.sending : t.submit}
        </Button>
      </div>
    </div>
  );
}
