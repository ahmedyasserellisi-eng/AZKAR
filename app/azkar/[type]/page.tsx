import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MoonIcon, SunIcon } from "../../components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import type { AzkarType } from "@/lib/types";

export default async function AzkarList({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (type !== "morning" && type !== "evening") notFound();
  const kind = type as AzkarType;
  const items = getAdhkar(kind);
  const title = kind === "morning" ? "أذكار الصباح" : "أذكار المساء";
  const Icon = kind === "morning" ? SunIcon : MoonIcon;
  return <div className="container-mobile pt-8 sm:pt-12">
    <div className="mb-7 flex items-center justify-between"><Link href="/" className="focus-ring rounded-2xl border p-3 text-[var(--muted)]" style={{ borderColor: "var(--border)" }}><ArrowLeft /></Link><div className="text-center"><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-[var(--muted)]">{items.length} أذكار</p></div><div className="rounded-2xl soft p-3 text-[var(--primary)]"><Icon /></div></div>
    <Link href={`/reading/${kind}`} className="mb-5 block rounded-2xl bg-[var(--primary)] p-5 text-white"><div className="text-lg font-semibold">ابدأ الورد</div><div className="mt-1 text-sm opacity-80">اقرأ ذكرًا واحدًا في كل مرة</div></Link>
    <div className="space-y-3">{items.map((item) => <Link key={item.id} href={`/reading/${kind}?start=${item.order - 1}`} className="card block p-4"><div className="mb-2 flex items-center justify-between"><span className="text-sm text-[var(--muted)]">الذكر {item.order}</span><span className="text-xs text-[var(--muted)]">×{item.repetitions}</span></div><p className="line-clamp-2 leading-8">{item.text}</p></Link>)}</div>
  </div>;
}
