"use client";

import { useEffect, useRef, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { formatNumber } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Reveal (scroll entrance) ──────────────────────────────────────────── */

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "none";
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref}
      className={cn(
        "reveal",
        variant === "left" && "reveal--left",
        variant === "right" && "reveal--right",
        visible && "is-visible",
        className
      )}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Comp>
  );
}

/* ── CountUp (animated number, runs once) ──────────────────────────────── */

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  locale,
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  locale: Locale;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = clamp((now - t0) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(display, locale)}
      {suffix}
    </span>
  );
}

/* ── Progress bar ──────────────────────────────────────────────────────── */

export function ProgressBar({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(clamp(value, 0, 100)), 60);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className={cn("progress", className)} style={style} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__bar" style={{ width: `${width}%` }} />
    </div>
  );
}

/* ── Progress ring (SVG) ───────────────────────────────────────────────── */

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const [offset, setOffset] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference - (clamp(value, 0, 100) / 100) * circumference), 120);
    return () => clearTimeout(t);
  }, [value, circumference]);

  return (
    <div className={cn("progress-ring", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="progress-ring__track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" />
        <circle
          className="progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="visually-hidden"
        role="img"
        aria-label={label ?? `${value}%`}
      >
        {label ?? `${value}%`}
      </span>
    </div>
  );
}
