"use client";

import { useEffect, useState } from "react";
import { BookIcon, MoonIcon, SettingsIcon, SunIcon } from "../components/Icons";
import { getFontScale, getTheme, setFontScale, setTheme } from "@/lib/storage";

type Theme = "system" | "light" | "dark";

export default function SettingsPage() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [scale, setScale] = useState(1);
  useEffect(() => { setThemeState(getTheme()); setScale(getFontScale()); }, []);
  function applyTheme(next: Theme) { setThemeState(next); setTheme(next); const dark = next === "dark" || (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches); document.documentElement.classList.toggle("dark", dark); }
  function applyScale(next: number) { const clamped = Math.min(1.25, Math.max(0.9, Number(next.toFixed(2)))); setScale(clamped); setFontScale(clamped); }
  return <div className="container-mobile pt-8 sm:pt-12"><div className="mb-8"><div className="mb-2 flex items-center gap-3"><SettingsIcon size={24} /><h1 className="text-3xl font-bold">الإعدادات</h1></div><p className="text-sm text-[var(--muted)]">خلي تجربة القراءة على مزاجك.</p></div><div className="space-y-4">
    <section className="card p-5"><h2 className="mb-4 font-semibold">المظهر</h2><div className="grid grid-cols-3 gap-2">{(["system", "light", "dark"] as Theme[]).map(t => <button key={t} onClick={() => applyTheme(t)} className={`focus-ring rounded-2xl border px-3 py-3 text-sm ${theme === t ? "border-[var(--primary)] bg-[var(--surface-soft)] text-[var(--primary)]" : ""}`} style={{ borderColor: theme === t ? "var(--primary)" : "var(--border)" }}>{t === "system" ? "النظام" : t === "light" ? <span className="inline-flex items-center gap-2"><SunIcon size={17} />فاتح</span> : <span className="inline-flex items-center gap-2"><MoonIcon size={17} />داكن</span>}</button>)}</div></section>
    <section className="card p-5"><h2 className="mb-4 font-semibold">حجم النص</h2><div className="flex items-center gap-3"><button onClick={() => applyScale(scale - 0.05)} className="focus-ring rounded-2xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>A−</button><div className="h-2 flex-1 overflow-hidden rounded-full progress-track"><div className="progress-fill h-full rounded-full" style={{ width: `${((scale - 0.9) / 0.35) * 100}%` }} /></div><button onClick={() => applyScale(scale + 0.05)} className="focus-ring rounded-2xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>A+</button></div><p className="mt-3 text-center text-xs text-[var(--muted)]">{Math.round(scale * 100)}%</p></section>
    <section className="card p-5"><div className="flex items-start gap-3"><div className="rounded-2xl soft p-3 text-[var(--primary)]"><BookIcon /></div><div><h2 className="font-semibold">عن أذكار</h2><p className="mt-1 leading-7 text-[var(--muted)]">نسخة أولى خفيفة وسريعة، تحفظ تقدمك ومفضلاتك على جهازك بدون حساب.</p><p className="mt-4 text-xs text-[var(--muted)]">الإصدار 0.1.0</p></div></div></section>
  </div></div>;
}
