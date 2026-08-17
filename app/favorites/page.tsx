"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, StarIcon } from "../components/Icons";
import { getFavorites } from "@/lib/storage";
import { adhkar } from "@/lib/adhkar";
import type { Dhikr } from "@/lib/types";

export default function FavoritesPage() {
  const [items, setItems] = useState<Dhikr[]>([]);
  useEffect(() => { const ids = getFavorites(); setItems(Object.values(adhkar).flat().filter(item => ids.includes(item.id))); }, []);
  return <div className="container-mobile pt-8 sm:pt-12"><div className="mb-7 flex items-center justify-between"><div><h1 className="text-3xl font-bold">المفضلة ⭐</h1><p className="mt-2 text-sm text-[var(--muted)]">الأذكار التي حفظتها على جهازك</p></div></div>{items.length === 0 ? <div className="card p-10 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full soft text-[var(--muted)]"><StarIcon size={24} /></div><h2 className="text-lg font-semibold">لم تحفظ أي ذكر بعد</h2><p className="mt-2 leading-7 text-[var(--muted)]">اضغط على النجمة أثناء القراءة ليظهر الذكر هنا.</p><Link href="/azkar/morning" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 font-semibold text-white">ابدأ القراءة <ArrowLeft /></Link></div> : <div className="space-y-3">{items.map(item => <Link key={item.id} href={`/reading/${item.type}?start=${item.order - 1}`} className="card block p-4"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-[var(--primary)]">{item.type === "morning" ? "أذكار الصباح" : "أذكار المساء"}</span><span className="text-xs text-[var(--muted)]">×{item.repetitions}</span></div><p className="line-clamp-3 leading-8">{item.text}</p></Link>)}</div>}</div>;
}
