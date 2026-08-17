import type { AzkarType, ProgressState } from "./types";

export const STORAGE_KEYS = {
  progress: "azkar-progress-v1",
  favorites: "azkar-favorites-v1",
  fontScale: "azkar-font-scale-v1",
  theme: "azkar-theme-v1"
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

export function getProgress(): ProgressState { return readJson(STORAGE_KEYS.progress, {}); }
export function setProgress(state: ProgressState) { localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state)); }

export function getFavorites(): string[] { return readJson(STORAGE_KEYS.favorites, []); }
export function setFavorites(ids: string[]) { localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids)); }

export function getTheme(): "system" | "light" | "dark" { return readJson(STORAGE_KEYS.theme, "system"); }
export function setTheme(theme: "system" | "light" | "dark") { localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme)); }

export function getFontScale(): number { return readJson(STORAGE_KEYS.fontScale, 1); }
export function setFontScale(scale: number) { localStorage.setItem(STORAGE_KEYS.fontScale, JSON.stringify(scale)); }

export function getCompletedCount(type: AzkarType, ids: string[]) {
  const state = getProgress();
  return ids.reduce((sum, id) => sum + (state[id] ?? 0), 0);
}
