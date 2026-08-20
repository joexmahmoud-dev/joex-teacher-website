/**
 * The Dictionary type is derived from the English dictionary (source of truth).
 * The Arabic dictionary is typed against it, so a missing Arabic key is a
 * compile-time error — the two languages can never drift apart silently.
 */
import type en from "./dictionaries/en";

export type Dictionary = typeof en;
