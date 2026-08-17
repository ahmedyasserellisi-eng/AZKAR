"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckIcon, StarIcon } from "../../components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import { getFavorites, getFontScale, getProgress, setFavorites, setFontScale, setProgress } from "@/lib/storage";
import type { AzkarType } from "@/lib/types";

export default function ReadingPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const type = params.type as AzkarType;
  const items = getAdhkar(type === "evening" ? "evening" : "morning");
  const initial = Math.max(0, Math.min(items.length - 1, Number(search.get("start") ?? 0)));
  const [index, setIndex] = useState(initial);
  const [count, setCount] = useState(0);
  const [favorites, setFavs] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [doneMessage, setDoneMessage] = useState(false);
  const item = items[index];
  const completedUnits = useMemo(() => { const p = getProgress(); return items.reduce((sum, x) => sum + Math.min(p[x.id] ?? 0, x.repetitions), 0); }, [items, doneMessage, index]);
  const totalUnits = useMemo(() => items.reduce((sum, x) => sum + x.repetitions, 0), [items]);
  const percent = Math.round((completedUnits / totalUnits) * 100);

  useEffect(() => {
    const savedScale = getFontScale();
    setFavs(getFavorites());
    setScale(savedScale);
    document.documentElement.style.setProperty("--azkar-font-scale", String(savedScale));
    const p = getProgress();
    setCount(Math.min(p[item.id] ?? 0, item.repetitions));
  }, [item]);

  if (!item) return null;

  function toggleFavorite() {
    const next = favorites.includes(item.id) ? favorites.filter(id => id !== item.id) : [...favorites, item.id];
    setFavs(next); setFavorites(next);
  }

  function markDone() {
    const nextCount = count + 1;
    const p = getProgress();
    p[item.id] = Math.min(nextCount, item.repetitions);
    setProgress(p);
    if (nextCount < item.repetitions) { setCount(nextCount); return; }
    if (index === items.length - 1) { setDoneMessage(true); return; }
    setIndex(index + 1); setCount(0);
  }

  function previous() { if (index > 0) setIndex(index - 1); }

  function increaseFont() {
    const next = Math.min(1.25, Number((scale + 0.05).toFixed(2)));
    if (next === scale) return;
    setScale(next);
    setFontScale(next);
    document.documentElement.style.setProperty("--azkar-font-scale", String(next));
  }

  if (doneMessage) return <div className="container-mobile flex min-h-[80vh] flex-col items-center justify-center text-center"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white"><CheckIcon size={34} /></div><p className="mb-2 text-sm text-[var(--muted)]">ما شاء الله 🤍</p><h1 className="text-3xl font-bold">أتممت أذكار {type === "morning" ? "الصباح" : "المساء"}</h1><p className="mt-3 max-w-sm leading-8 text-[var(--muted)]">الحمد لله الذي أعانك على ذكره.</p><div className="mt-7 flex w-full max-w-sm gap-3"><Link href="/" className="focus-ring flex-1 rounded-2xl border px-4 py-3 text-center" style={{ borderColor: "var(--border)" }}>الرئيسية</Link><button onClick={() => { setIndex(0); setDoneMessage(false); setCount(0); }} className="focus-ring flex-1 rounded-2xl bg-[var(--primary)] px-4 py-3 font-semibold text-white">مرة أخرى</button></div></div>;

  return <div className="min-h-screen bg-[var(--background)]">
    <div className="container-mobile pt-5">
      <div className="mb-5 flex items-center justify-between"><button onClick={() => router.back()} className="focus-ring rounded-2xl p-2 text-[var(--muted)]"><ArrowLeft /></button><div className="text-center"><div className="text-sm text-[var(--muted)]">أذكار {type === "morning" ? "الصباح" : "المساء"}</div><div className="mt-1 font-semibold">{index + 1} / {items.length}</div></div><button onClick={increaseFont} className="focus-ring rounded-2xl border px-3 py-2 text-sm disabled:opacity-40" style={{ borderColor: "var(--border)" }} disabled={scale >= 1.25} aria-label="تكبير النص أثناء القراءة">A+</button></div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full progress-track"><div className="progress-fill h-full rounded-full" style={{ width: `${percent}%` }} /></div>
      <article className="card min-h-[58vh] p-6 sm:p-10"><div className="mb-8 flex items-center justify-between"><span className="rounded-full soft px-3 py-1 text-xs text-[var(--muted)]">التكرار {count + 1} / {item.repetitions}</span><button onClick={toggleFavorite} className={`focus-ring rounded-full p-2 ${favorites.includes(item.id) ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} aria-label="حفظ في المفضلة"><StarIcon filled={favorites.includes(item.id)} /></button></div><p style={{ fontSize: `calc(23px * var(--azkar-font-scale, ${scale}))` }} className="leading-[2.25] tracking-[0.01em]">{item.text}</p><div className="mt-10 border-t pt-5 text-sm leading-7 text-[var(--muted)]" style={{ borderColor: "var(--border)" }}><span className="font-semibold text-[var(--foreground)]">المصدر:</span> {item.source}</div></article>
      <div className="mt-5 flex items-center justify-between gap-3"><button onClick={previous} disabled={index === 0} className="focus-ring rounded-2xl border p-4 text-[var(--muted)] disabled:opacity-35" style={{ borderColor: "var(--border)" }} aria-label="السابق"><ArrowRight /></button><button onClick={markDone} className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-4 font-semibold text-white shadow-lg shadow-black/5"><CheckIcon /> {count + 1 >= item.repetitions ? "تم" : "تم — التالي"}</button><Link href={`/azkar/${type}`} className="focus-ring rounded-2xl border p-4 text-[var(--muted)]" style={{ borderColor: "var(--border)" }} aria-label="قائمة الأذكار"><ArrowLeft /></Link></div>
    </div>
  </div>;
}
