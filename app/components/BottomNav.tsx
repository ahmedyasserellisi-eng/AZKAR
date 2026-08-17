"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, HomeIcon, SettingsIcon, StarIcon } from "./Icons";

const items = [
  { href: "/", label: "الرئيسية", Icon: HomeIcon },
  { href: "/azkar/morning", label: "الأذكار", Icon: BookIcon },
  { href: "/favorites", label: "المفضلة", Icon: StarIcon },
  { href: "/settings", label: "الإعدادات", Icon: SettingsIcon }
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/reading/")) return null;
  return <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-[var(--surface)]/95 backdrop-blur-md" style={{ borderColor: "var(--border)" }}><div className="mx-auto flex w-full max-w-[720px] items-center justify-around px-2 py-2">{items.map(({ href, label, Icon }) => { const active = pathname === href || (href !== "/" && pathname.startsWith(href)); return <Link key={href} href={href} className={`focus-ring flex min-w-17 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs transition ${active ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}><Icon size={21} /><span className={active ? "font-semibold" : ""}>{label}</span></Link>; })}</div></nav>;
}
