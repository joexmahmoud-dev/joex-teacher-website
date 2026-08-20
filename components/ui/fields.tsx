"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { IconAlert } from "@/components/ui/icons";

/* ── Field wrapper ─────────────────────────────────────────────────────── */

export function Field({
  label,
  required = false,
  error,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("field", className)}>
      {label ? (
        <label className="field__label" htmlFor={htmlFor}>
          {label} {required ? <span className="req">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="field__error" role="alert">
          <IconAlert />
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

/* ── Input ─────────────────────────────────────────────────────────────── */

export function Input({ className, invalid, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={cn("input", invalid && "input--invalid", className)} aria-invalid={invalid || undefined} {...rest} />;
}

/* ── Textarea ──────────────────────────────────────────────────────────── */

export function Textarea({
  className,
  invalid,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={cn("textarea", invalid && "input--invalid", className)} aria-invalid={invalid || undefined} {...rest} />;
}

/* ── Select ────────────────────────────────────────────────────────────── */

export function Select({
  className,
  invalid,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select className={cn("select", invalid && "input--invalid", className)} aria-invalid={invalid || undefined} {...rest}>
      {children}
    </select>
  );
}
