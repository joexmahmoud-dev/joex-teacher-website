"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { IconAlert, IconRefresh, IconSearch, IconStar } from "@/components/ui/icons";

/* ── Button ────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "white" | "light" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  icon?: ReactNode;
  href?: string;
  children?: ReactNode;
}

type ButtonProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "btn",
    `btn--${variant}`,
    size === "lg" && "btn--lg",
    size === "sm" && "btn--sm",
    block && "btn--block",
    className
  );

  const content = (
    <>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : icon}
      {children}
    </>
  );

  const { href, ...restAttrs } = rest;

  if (href) {
    return (
      <a href={href} className={classes} {...restAttrs}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...restAttrs}>
      {content}
    </button>
  );
}

/* ── Badge ─────────────────────────────────────────────────────────────── */

type BadgeTone = "green" | "gold" | "red" | "blue" | "gray" | "outline" | "dark" | "demo";

export function Badge({
  tone = "gray",
  className,
  children,
  ...rest
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("badge", `badge--${tone}`, className)} {...rest}>
      {children}
    </span>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

export function Card({
  hover = false,
  inset = false,
  className,
  children,
  ...rest
}: {
  hover?: boolean;
  inset?: boolean;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("card", hover && "card--hover", inset && "card--inset", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

/* ── Avatar ────────────────────────────────────────────────────────────── */

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: "md" | "lg";
  className?: string;
}) {
  const letter = name.trim().charAt(0) || "?";
  return (
    <span className={cn("avatar", size === "lg" && "avatar--lg", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} />
      ) : (
        letter
      )}
    </span>
  );
}

/* ── Rating stars ──────────────────────────────────────────────────────── */

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("rating", className)} role="img" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} style={{ opacity: i <= value ? 1 : 0.25 }} />
      ))}
    </span>
  );
}

/* ── Section heading ───────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("section-head", center && "section-head--center", className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {lead ? <p className="section-head__lead text-muted">{lead}</p> : null}
    </div>
  );
}

/* ── Demo badge ────────────────────────────────────────────────────────── */

export function DemoBadge({ label, className }: { label: string; className?: string }) {
  return (
    <Badge tone="demo" className={className}>
      {label}
    </Badge>
  );
}

/* ── Empty / error states ──────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="state">
      <span className="state__icon">{icon ?? <IconSearch />}</span>
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {action ? <div className="state__action">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = "Retry",
}: {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="state" role="alert">
      <span className="state__icon">
        <IconAlert />
      </span>
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {onRetry ? (
        <div className="state__action">
          <Button variant="outline" onClick={onRetry} icon={<IconRefresh />}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
