"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookIcon, MoonIcon, SettingsIcon, StarIcon, SunIcon } from "./components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import { getProgress } from "@/lib/storage";

function totalDone(type: "morning" | "evening") {
  const items = getAdhkar(type);
  const progress = getProgress();
  return items.reduce((sum, item) => sum + Math.min(progress[item.id] ?? 0, item.repetitions), 0);
}

export default function Home() {
  const [morningDone, setMorningDone] = useState(0);
  const [eveningDone, setEveningDone] = useState(0);
  useEffect(() => { setMorningDone(totalDone("morning")); setEveningDone(totalDone("evening")); }, []);
  const morning = getAdhkar("morning");
  const evening = getAdhkar("evening");
  const morningTotal = useMemo(() => morning.reduce((a, b) => a + b.repetitions, 0), [morning]);
  const eveningTotal = useMemo(() => evening.reduce((a, b) => a + b.repetitions, 0), [evening]);
  const morningPct = Math.round((morningDone / morningTotal) * 100) || 0;
  const eveningPct = Math.round((eveningDone / eveningTotal) * 100) || 0;

  return <div className="container-mobile pt-8 sm:pt-12">
    <header className="mb-7 flex items-start justify-between gap-4">
      <div><p className="mb-2 text-sm text-[var(--muted)]">السلام عليكم 🌿</p><h1 className="text-3xl font-bold tracking-tight">خذ دقائق من يومك<br />مع ذكر الله</h1></div>
      <Link href="/settings" className="focus-ring rounded-2xl border p-3 text-[var(--muted)]" style={{ borderColor: "var(--border)" }} aria-label="الإعدادات"><SettingsIcon /></Link>
    </header>

    <section className="mb-7 card overflow-hidden p-5 sm:p-6">
      <div className="mb-7 flex items-center justify-between"><div><p className="mb-1 text-sm text-[var(--muted)]">وردك اليومي</p><h2 className="text-xl font-semibold">ابدأ من حيث أنت</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl soft text-[var(--primary)]"><BookIcon size={23} /></div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/reading/morning" className="focus-ring group rounded-2xl bg-[var(--primary)] p-4 text-white transition hover:opacity-95"><div className="mb-6 flex items-center justify-between"><SunIcon /><span className="text-xs opacity-80">الصباح</span></div><div className="mb-2 text-lg font-semibold">أذكار الصباح</div><div className="mb-4 text-sm opacity-80">{morning.length} أذكار · {morningTotal} تكرار</div><div className="flex items-center justify-between text-sm font-semibold"><span>{morningPct ? `استكمال ${morningPct}%` : "ابدأ الآن"}</span><ArrowLeft size={18} /></div></Link>
        <Link href="/reading/evening" className="focus-ring group rounded-2xl border p-4 transition hover:bg-[var(--surface-soft)]" style={{ borderColor: "var(--border)" }}><div className="mb-6 flex items-center justify-between text-[var(--primary)]"><MoonIcon /><span className="text-xs text-[var(--muted)]">المساء</span></div><div className="mb-2 text-lg font-semibold">أذكار المساء</div><div className="mb-4 text-sm text-[var(--muted)]">{evening.length} أذكار · {eveningTotal} تكرار</div><div className="flex items-center justify-between text-sm font-semibold text-[var(--primary)]"><span>{eveningPct ? `استكمال ${eveningPct}%` : "ابدأ الآن"}</span><ArrowLeft size={18} /></div></Link>
      </div>
    </section>

    <section className="mb-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">وصول سريع</h2><span className="text-sm text-[var(--muted)]">أهم ما تحتاجه</span></div><div className="grid grid-cols-2 gap-3"><Link href="/azkar/morning" className="focus-ring card p-4"><SunIcon size={20} /><div className="mt-4 font-semibold">كل الأذكار</div><div className="mt-1 text-sm text-[var(--muted)]">استعرض وردك</div></Link><Link href="/favorites" className="focus-ring card p-4"><StarIcon size={20} /><div className="mt-4 font-semibold">المفضلة</div><div className="mt-1 text-sm text-[var(--muted)]">أذكارك المحفوظة</div></Link></div></section>

    <section className="card p-5"><p className="mb-1 text-sm text-[var(--muted)]">فكرة الموقع</p><p className="leading-8">تجربة هادئة تساعدك على قراءة أذكارك بسهولة، مع حفظ تقدمك على جهازك بدون إنشاء حساب.</p></section>
  </div>;
}
