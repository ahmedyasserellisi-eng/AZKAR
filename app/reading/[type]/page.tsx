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
  setProgress,
} from "@/lib/storage";
import type { AzkarType } from "@/lib/types";

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

    // لو كل الأذكار مكتملة، نعرض آخر ذكر.
    return firstIncompleteIndex === -1
      ? Math.max(items.length - 1, 0)
      : firstIncompleteIndex;
  });

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
      setDoneMessage(true);
      return;
    }

    // الانتقال للذكر التالي بعد إتمام التكرارات المطلوبة.
    setIndex(index + 1);
    setCount(0);
    setShowVirtue(false);
  }

  function previous() {
    if (index > 0) {
      const previousIndex = index - 1;

      setIndex(previousIndex);

      const previousItem = items[previousIndex];
      const progress = getProgress();

      setCount(
        Math.min(
          progress[previousItem.id] ?? 0,
          previousItem.repetitions
        )
      );

      setShowVirtue(false);
    }
  }

  /**
   * تكبير مؤقت أثناء القراءة فقط.
   * لا يغيّر الحجم المحفوظ في الإعدادات.
   */
  function increaseFont() {
    setScale((current) =>
      Math.min(
        MAX_SCALE,
        Number((current + STEP).toFixed(2))
      )
    );
  }

  function restartReading() {
    setIndex(0);
    setDoneMessage(false);
    setCount(0);
    setShowVirtue(false);
    setScale(getFontScale());
  }

  const readingFontSize = BASE_FONT_SIZE * scale;
  const canIncreaseFont = scale < MAX_SCALE;

  // نعرض التكرار الحالي بشكل صحيح،
  // ولا نسمح بظهور رقم أكبر من المطلوب.
  const displayedCount = Math.min(
    count + 1,
    item.repetitions
  );

  if (doneMessage) {
    return (
      <div className="container-mobile flex min-h-[80vh] flex-col items-center justify-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg shadow-black/10">
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

        <p className="mt-3 max-w-sm leading-8 text-[var(--muted)]">
          الحمد لله الذي أعانك على ذكره.
        </p>

        <div className="mt-7 flex w-full max-w-sm gap-3">
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
    );
  }

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

          {/* تكبير مؤقت */}
          <button
            onClick={increaseFont}
            disabled={!canIncreaseFont}
            className="focus-ring rounded-2xl border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              borderColor: "var(--border)",
            }}
            aria-label="تكبير النص أثناء القراءة"
          >
            A+
          </button>
        </div>

        {/* Progress */}
        <div
          className="mb-8 h-1.5 overflow-hidden rounded-full progress-track"
          aria-label="التقدم"
        >
          <div
            className="progress-fill h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        {/* Dhikr Card */}
        <article className="card min-h-[58vh] p-6 sm:p-10">
          {/* Meta */}
          <div className="mb-8 flex items-center justify-between">
            <span className="rounded-full soft px-3 py-1 text-xs text-[var(--muted)]">
              التكرار{" "}
              <span dir="ltr">
                {displayedCount} / {item.repetitions}
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

          {/* Main Text */}
          <p
            style={{
              fontSize: `${readingFontSize}px`,
            }}
            className="whitespace-pre-line leading-[2.25] tracking-[0.01em]"
          >
            {item.text}
          </p>

          {/* Source + Virtue */}
          <div
            className="mt-10 border-t pt-5"
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
                      borderColor: "var(--border)",
                      background: "var(--surface)",
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

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {/* Previous */}
          <button
            onClick={previous}
            disabled={index === 0}
            className="focus-ring rounded-2xl border p-4 text-[var(--muted)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              borderColor: "var(--border)",
            }}
            aria-label="السابق"
          >
            <ArrowRight />
          </button>

          {/* Done / Next */}
          <button
            onClick={markDone}
            className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-4 font-semibold text-white shadow-lg shadow-black/5 transition hover:opacity-95 active:scale-[0.99]"
          >
            <CheckIcon />

            {count + 1 >= item.repetitions
              ? "تم"
              : "تم — التالي"}
          </button>

          {/* List */}
          <Link
            href={`/azkar/${type}`}
            className="focus-ring rounded-2xl border p-4 text-[var(--muted)] transition hover:bg-[var(--surface-soft)]"
            style={{
              borderColor: "var(--border)",
            }}
            aria-label="قائمة الأذكار"
          >
            <ArrowLeft />
          </Link>
        </div>
      </div>
    </div>
  );
}