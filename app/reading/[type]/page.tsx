"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  StarIcon,
} from "../../components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import {
  getFavorites,
  getFontScale,
  getProgress,
  setFavorites,
  setFontScale,
  setProgress,
} from "@/lib/storage";
import type { AzkarType } from "@/lib/types";

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.25;
const STEP = 0.05;
const BASE_FONT_SIZE = 23;

export default function ReadingPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const search = useSearchParams();

  const type = params.type as AzkarType;

  const items = getAdhkar(
    type === "evening" ? "evening" : "morning"
  );

  const requestedStart = Number(search.get("start"));

  const hasRequestedStart =
    Number.isInteger(requestedStart) &&
    requestedStart >= 0 &&
    requestedStart < items.length;

  const [index, setIndex] = useState(() => {
    if (hasRequestedStart) {
      return requestedStart;
    }

    const progress = getProgress();

    const firstIncompleteIndex = items.findIndex(
      (currentItem) =>
        (progress[currentItem.id] ?? 0) <
        currentItem.repetitions
    );

    return firstIncompleteIndex === -1
      ? Math.max(items.length - 1, 0)
      : firstIncompleteIndex;
  });

  // عدد المرات المنجزة فعليًا للذكر الحالي.
  const [count, setCount] = useState(0);

  const [favorites, setFavs] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [doneMessage, setDoneMessage] = useState(false);
  const [showVirtue, setShowVirtue] = useState(false);

  const item = items[index];

  const completedUnits = useMemo(() => {
    const progress = getProgress();

    return items.reduce(
      (sum, currentItem) =>
        sum +
        Math.min(
          progress[currentItem.id] ?? 0,
          currentItem.repetitions
        ),
      0
    );
  }, [items, doneMessage, index]);

  const totalUnits = useMemo(
    () =>
      items.reduce(
        (sum, currentItem) =>
          sum + currentItem.repetitions,
        0
      ),
    [items]
  );

  const percent =
    totalUnits > 0
      ? Math.min(
          100,
          Math.round(
            (completedUnits / totalUnits) * 100
          )
        )
      : 0;

  useEffect(() => {
    if (!item) return;

    const savedScale = getFontScale();
    const progress = getProgress();

    setFavs(getFavorites());
    setScale(savedScale);
    setShowVirtue(false);

    const completed = Math.min(
      progress[item.id] ?? 0,
      item.repetitions
    );

    setCount(completed);
  }, [item]);

  if (!item) return null;

  function toggleFavorite() {
    const next = favorites.includes(item.id)
      ? favorites.filter((id) => id !== item.id)
      : [...favorites, item.id];

    setFavs(next);
    setFavorites(next);
  }

  /**
   * تسجيل ضغطة واحدة فقط.
   *
   * مثال:
   * 0/3 → 1/3 → 2/3 → 3/3
   *
   * وبعد إتمام العدد المطلوب ينتقل للذكر التالي.
   */
  function markDone() {
    const nextCount = Math.min(
      count + 1,
      item.repetitions
    );

    const progress = getProgress();

    progress[item.id] = nextCount;
    setProgress(progress);

    if (nextCount < item.repetitions) {
      setCount(nextCount);
      return;
    }

    if (index === items.length - 1) {
      setCount(nextCount);
      setDoneMessage(true);
      return;
    }

    setIndex(index + 1);
    setCount(0);
    setShowVirtue(false);
  }

  /**
   * الرجوع للذكر السابق.
   */
  function previous() {
    if (index === 0) return;

    const previousIndex = index - 1;
    const previousItem = items[previousIndex];
    const progress = getProgress();

    setIndex(previousIndex);

    setCount(
      Math.min(
        progress[previousItem.id] ?? 0,
        previousItem.repetitions
      )
    );

    setShowVirtue(false);
  }

  /**
   * الانتقال للذكر التالي بدون تسجيله كمكتمل.
   */
  function next() {
    if (index >= items.length - 1) return;

    const nextIndex = index + 1;
    const nextItem = items[nextIndex];
    const progress = getProgress();

    setIndex(nextIndex);

    setCount(
      Math.min(
        progress[nextItem.id] ?? 0,
        nextItem.repetitions
      )
    );

    setShowVirtue(false);
  }

  /**
   * تكبير مؤقت أثناء القراءة.
   * لا يغير قيمة الإعدادات المحفوظة.
   */
  function increaseFont() {
    setScale((current) => {
      const next = Math.min(
        MAX_SCALE,
        Number((current + STEP).toFixed(2))
      );

      return next;
    });
  }

  /**
   * تصغير مؤقت أثناء القراءة.
   * لا يغير قيمة الإعدادات المحفوظة.
   */
  function decreaseFont() {
    setScale((current) => {
      const next = Math.max(
        MIN_SCALE,
        Number((current - STEP).toFixed(2))
      );

      return next;
    });
  }

  function restartReading() {
    setIndex(0);
    setDoneMessage(false);
    setCount(0);
    setShowVirtue(false);
    setScale(getFontScale());
  }

  const readingFontSize =
    BASE_FONT_SIZE * scale;

  const canIncreaseFont = scale < MAX_SCALE;
  const canDecreaseFont = scale > MIN_SCALE;

  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-mobile pb-8 pt-5">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="focus-ring rounded-2xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface-soft)]"
            aria-label="رجوع"
          >
            <ArrowLeft />
          </button>

          <div className="text-center">
            <div className="text-sm text-[var(--muted)]">
              أذكار{" "}
              {type === "morning"
                ? "الصباح"
                : "المساء"}
            </div>

            <div
              className="mt-1 font-semibold"
              dir="ltr"
            >
              {index + 1} / {items.length}
            </div>
          </div>

          {/* Font controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={decreaseFont}
              disabled={!canDecreaseFont}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                borderColor: "var(--border)",
              }}
              aria-label="تصغير النص"
            >
              A−
            </button>

            <button
              onClick={increaseFont}
              disabled={!canIncreaseFont}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                borderColor: "var(--border)",
              }}
              aria-label="تكبير النص"
            >
              A+
            </button>
          </div>
        </div>

        {/* Progress */}
        <div
          className="mb-6 h-1.5 overflow-hidden rounded-full progress-track"
          aria-label="التقدم"
        >
          <div
            className="progress-fill h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        {/* Reading Card */}
        <article className="card overflow-hidden p-5 sm:p-8">

          {/* Meta */}
          <div className="mb-5 flex h-10 items-center justify-between">
            <span className="rounded-full soft px-3 py-1.5 text-xs text-[var(--muted)]">
              التكرار{" "}
              <span dir="ltr">
                {count} / {item.repetitions}
              </span>
            </span>

            <button
              onClick={toggleFavorite}
              className={`focus-ring rounded-full p-2 transition ${
                favorites.includes(item.id)
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted)]"
              }`}
              aria-label="حفظ في المفضلة"
              aria-pressed={favorites.includes(item.id)}
            >
              <StarIcon
                filled={favorites.includes(item.id)}
              />
            </button>
          </div>

          {/* ثابت الحجم والمكان */}
          <div className="flex h-[48vh] min-h-[360px] max-h-[520px] items-start overflow-y-auto rounded-2xl px-1">
            <div className="flex min-h-full w-full items-center">
              <p
                style={{
                  fontSize: `${readingFontSize}px`,
                }}
                className="w-full whitespace-pre-line text-center leading-[2.25] tracking-[0.01em]"
              >
                {item.text}
              </p>
            </div>
          </div>

          {/* Source + Virtue */}
          <div
            className="mt-5 border-t pt-5"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div className="text-sm leading-7 text-[var(--muted)]">
              <span className="font-semibold text-[var(--foreground)]">
                المصدر:
              </span>{" "}
              {item.source}
            </div>

            {item.virtue && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowVirtue(
                      (current) => !current
                    )
                  }
                  className="focus-ring flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-right transition hover:bg-[var(--surface-soft)]"
                  style={{
                    borderColor: "var(--border)",
                    background:
                      "var(--surface-soft)",
                  }}
                  aria-expanded={showVirtue}
                  aria-controls="dhikr-virtue"
                >
                  <span className="flex items-center gap-2 font-semibold text-[var(--primary)]">
                    <span
                      aria-hidden="true"
                      className="text-base"
                    >
                      ✨
                    </span>

                    <span>فضل الذكر</span>
                  </span>

                  <span
                    className={`text-[var(--muted)] transition-transform duration-200 ${
                      showVirtue
                        ? "rotate-180"
                        : ""
                    }`}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </button>

                {showVirtue && (
                  <div
                    id="dhikr-virtue"
                    className="mt-2 rounded-2xl border p-4"
                    style={{
                      borderColor:
                        "var(--border)",
                      background:
                        "var(--surface)",
                    }}
                  >
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {item.virtue}
                    </p>

                    {item.virtueSource && (
                      <div className="mt-3 border-t pt-3 text-xs leading-6 text-[var(--muted)]">
                        <span className="font-semibold text-[var(--foreground)]">
                          مصدر الفضل:
                        </span>{" "}
                        {item.virtueSource}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </article>

        {/* Bottom navigation */}
        <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3">

          {/* < السابق */}
          <button
            type="button"
            onClick={previous}
            disabled={isFirst}
            className="focus-ring flex h-14 min-w-[104px] items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              borderColor: "var(--border)",
            }}
            aria-label="الذكر السابق"
          >
            <ArrowLeft size={19} />
            <span>السابق</span>
          </button>

          {/* تم */}
          <button
            type="button"
            onClick={markDone}
            className="focus-ring flex h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 font-semibold text-white shadow-lg shadow-black/5 transition hover:opacity-95 active:scale-[0.99]"
          >
            <CheckIcon />

            <span>تم</span>
          </button>

          {/* التالي > */}
          <button
            type="button"
            onClick={next}
            disabled={isLast}
            className="focus-ring flex h-14 min-w-[104px] items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              borderColor: "var(--border)",
            }}
            aria-label="الذكر التالي"
          >
            <span>التالي</span>
            <ArrowRight size={19} />
          </button>
        </div>
      </div>

      {/* Completion Screen */}
      {doneMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/95 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg shadow-black/10">
              <CheckIcon size={34} />
            </div>

            <p className="mb-2 text-sm text-[var(--muted)]">
              ما شاء الله 🤍
            </p>

            <h1 className="text-3xl font-bold leading-tight">
              أتممت أذكار{" "}
              {type === "morning"
                ? "الصباح"
                : "المساء"}
            </h1>

            <p className="mt-3 leading-8 text-[var(--muted)]">
              الحمد لله الذي أعانك على ذكره.
            </p>

            <div className="mt-7 flex gap-3">
              <Link
                href="/"
                className="focus-ring flex-1 rounded-2xl border px-4 py-3 text-center transition hover:bg-[var(--surface-soft)]"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                الرئيسية
              </Link>

              <button
                onClick={restartReading}
                className="focus-ring flex-1 rounded-2xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:opacity-95"
              >
                مرة أخرى
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}