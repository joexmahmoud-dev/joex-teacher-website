"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState, createContext } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { IconCheckCircle, IconAlert, IconInfo, IconClose, IconChevronDown } from "@/components/ui/icons";

/* ── Modal ─────────────────────────────────────────────────────────────── */

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className={cn("modal", className)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="modal__head">
            <h3 className="modal__title">{title}</h3>
            <button className="modal__close" onClick={onClose} aria-label="Close">
              <IconClose />
            </button>
          </div>
        ) : null}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

/* ── Tabs ──────────────────────────────────────────────────────────────── */

export interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("tabs", className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={value === item.id}
          className="tab"
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── Accordion ─────────────────────────────────────────────────────────── */

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  meta?: ReactNode;
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string[] }) {
  const [open, setOpen] = useState<string[]>(defaultOpen ?? []);
  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div className="accordion" data-open={isOpen} key={item.id}>
            <button
              className="accordion__head"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <IconChevronDown className="accordion__icon" />
            </button>
            <div className="accordion__body">
              <div className="accordion__inner">
                <div className="accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Toasts ────────────────────────────────────────────────────────────── */

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const ToastContext = createContext<{ toast: (type: ToastType, message: string) => void }>({
  toast: () => undefined,
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={cn("toast", `toast--${t.type}`)}>
            {t.type === "success" ? <IconCheckCircle /> : t.type === "error" ? <IconAlert /> : <IconInfo />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
