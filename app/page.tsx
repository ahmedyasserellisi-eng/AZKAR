"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookIcon,
  MoonIcon,
  SettingsIcon,
  StarIcon,
  SunIcon,
  CheckIcon,
} from "./components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import { getProgress } from "@/lib/storage";

type AzkarType = "morning" | "evening";

function totalDone(type: AzkarType) {
  const items = getAdhkar(type);
  const progress = getProgress();

  return items.reduce(
    (sum, item) =>
      sum +
      Math.min(
        progress[item.id] ?? 0,
        item.repetitions
      ),
    0
  );
}

function getStatus(
  done: number,
  total: number
) {
  if (done >= total && total > 0) {
    return {
      label: "مكتمل",
      isComplete: true,
    };
  }

  if (done > 0 && total > 0) {
    return {
      label: "استكمال",
      isComplete: false,
    };
  }

  return {
    label: "ابدأ الآن",
    isComplete: false,
  };
}

export default function Home() {
  const [morningDone, setMorningDone] = useState(0);
  const [eveningDone, setEveningDone] = useState(0);

  useEffect(() => {
    setMorningDone(totalDone("morning"));
    setEveningDone(totalDone("evening"));
  }, []);

  const morning = getAdhkar("morning");
  const evening = getAdhkar("evening");

  const morningTotal = useMemo(
    () =>
      morning.reduce(
        (sum, item) => sum + item.repetitions,
        0
      ),
    [morning]
  );

  const eveningTotal = useMemo(
    () =>
      evening.reduce(
        (sum, item) => sum + item.repetitions,
        0
      ),
    [evening]
  );

  const morningPct =
    morningTotal > 0
      ? Math.min(
          100,
          Math.round(
            (morningDone / morningTotal) * 100
          )
        )
      : 0;

  const eveningPct =
    eveningTotal > 0
      ? Math.min(
          100,
          Math.round(
            (eveningDone / eveningTotal) * 100
          )
        )
      : 0;

  const morningStatus = getStatus(
    morningDone,
    morningTotal
  );

  const eveningStatus = getStatus(
    eveningDone,
    eveningTotal
  );

  return (
    <div className="container-mobile pb-8 pt-8 sm:pb-12 sm:pt-12">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-sm text-[var(--muted)]">
            <span>السلام عليكم</span>
            <span aria-hidden="true">🌿</span>
          </p>

          <h1 className="text-3xl font-bold leading-[1.35] tracking-tight sm:text-4xl">
            خذ دقائق من يومك
            <br />
            مع ذكر الله
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
            وردك اليومي بين يديك، بهدوء وبأقل عدد ممكن من
            الخطوات.
          </p>
        </div>

        <Link
          href="/settings"
          className="focus-ring shrink-0 rounded-2xl border p-3 text-[var(--muted)] transition hover:bg-[var(--surface-soft)]"
          style={{ borderColor: "var(--border)" }}
          aria-label="الإعدادات"
        >
          <SettingsIcon />
        </Link>
      </header>

      {/* Daily wird */}
      <section className="mb-8 card overflow-hidden p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm text-[var(--muted)]">
              وردك اليومي
            </p>

            <h2 className="text-xl font-semibold">
              ابدأ من حيث أنت
            </h2>
          </div>

          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl soft text-[var(--primary)]"
            aria-hidden="true"
          >
            <BookIcon size={23} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Morning */}
          <Link
            href="/reading/morning"
            className="focus-ring group rounded-3xl bg-[var(--primary)] p-5 text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
          >
            <div className="mb-7 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <SunIcon size={22} />
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                الصباح
              </span>
            </div>

            <div className="mb-2 text-xl font-semibold">
              أذكار الصباح
            </div>

            <div className="mb-5 text-sm text-white/75">
              {morning.length} أذكار{" "}
              <span aria-hidden="true">·</span>{" "}
              {morningTotal} تكرار
            </div>

            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/90 transition-all duration-500"
                style={{
                  width: `${morningPct}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {morningStatus.isComplete ? (
                  <span className="flex items-center gap-2">
                    <CheckIcon size={16} />
                    مكتمل
                  </span>
                ) : morningPct > 0 ? (
                  <>
                    استكمال{" "}
                    <span dir="ltr">
                      {morningPct}%
                    </span>
                  </>
                ) : (
                  "ابدأ الآن"
                )}
              </span>

              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <ArrowRight size={19} />
              </span>
            </div>
          </Link>

          {/* Evening */}
          <Link
            href="/reading/evening"
            className="focus-ring group rounded-3xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-soft)]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mb-7 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl soft text-[var(--primary)]">
                <MoonIcon size={22} />
              </div>

              <span className="rounded-full soft px-3 py-1 text-xs text-[var(--muted)]">
                المساء
              </span>
            </div>

            <div className="mb-2 text-xl font-semibold">
              أذكار المساء
            </div>

            <div className="mb-5 text-sm text-[var(--muted)]">
              {evening.length} أذكار{" "}
              <span aria-hidden="true">·</span>{" "}
              {eveningTotal} تكرار
            </div>

            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{
                  width: `${eveningPct}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[var(--primary)]">
              <span className="text-sm font-semibold">
                {eveningStatus.isComplete ? (
                  <span className="flex items-center gap-2">
                    <CheckIcon size={16} />
                    مكتمل
                  </span>
                ) : eveningPct > 0 ? (
                  <>
                    استكمال{" "}
                    <span dir="ltr">
                      {eveningPct}%
                    </span>
                  </>
                ) : (
                  "ابدأ الآن"
                )}
              </span>

              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl soft transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <ArrowRight size={19} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Quick access */}
      <section className="mb-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              وصول سريع
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              أهم ما تحتاجه في خطوة واحدة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/azkar/morning"
            className="focus-ring card group p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-soft)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl soft text-[var(--primary)]">
              <SunIcon size={20} />
            </div>

            <div className="mt-4 font-semibold">
              كل الأذكار
            </div>

            <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
              استعرض ورد الصباح والمساء
            </div>

            <div className="mt-4 text-[var(--primary)]">
              <ArrowRight size={17} />
            </div>
          </Link>

          <Link
            href="/favorites"
            className="focus-ring card group p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-soft)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl soft text-[var(--primary)]">
              <StarIcon size={20} />
            </div>

            <div className="mt-4 font-semibold">
              المفضلة
            </div>

            <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
              ارجع لأذكارك المحفوظة
            </div>

            <div className="mt-4 text-[var(--primary)]">
              <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="card overflow-hidden p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl soft text-[var(--primary)]">
            <BookIcon size={20} />
          </div>

          <div>
            <p className="mb-1 text-sm text-[var(--muted)]">
              فكرة أذكار
            </p>

            <p className="leading-8">
              تجربة هادئة تساعدك على قراءة أذكارك بسهولة،
              مع حفظ تقدمك ومفضلاتك على جهازك بدون إنشاء
              حساب.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}