"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  MoonIcon,
  SunIcon,
} from "../../components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import { getProgress } from "@/lib/storage";
import type { AzkarType, ProgressState } from "@/lib/types";

export default function AzkarList() {
  const params = useParams<{ type: string }>();
  const router = useRouter();

  const rawType = params?.type;

  const kind: AzkarType | null =
    rawType === "morning" || rawType === "evening"
      ? rawType
      : null;

  const [progress, setProgressState] =
    useState<ProgressState>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!kind) {
      router.replace("/");
      return;
    }

    const loadProgress = () => {
      setProgressState(getProgress());
    };

    loadProgress();
    setMounted(true);

    const handleFocus = () => {
      loadProgress();
    };

    const handleStorage = () => {
      loadProgress();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [kind, router]);

  const items = useMemo(
    () => (kind ? getAdhkar(kind) : []),
    [kind]
  );

  if (!kind) {
    return null;
  }

  const title =
    kind === "morning"
      ? "أذكار الصباح"
      : "أذكار المساء";

  const subtitle =
    kind === "morning"
      ? "ابدأ يومك بذكر الله"
      : "اختم يومك بذكر الله";

  const Icon =
    kind === "morning"
      ? SunIcon
      : MoonIcon;

  /**
   * لا نحسب الـProgress قبل تحميل localStorage
   * حتى لا يظهر رقم خاطئ لحظة فتح الصفحة.
   */
  const completedCount = mounted
    ? items.filter(
        (item) =>
          (progress[item.id] ?? 0) >=
          item.repetitions
      ).length
    : 0;

  const progressPercent =
    items.length > 0
      ? Math.min(
          100,
          Math.round(
            (completedCount / items.length) * 100
          )
        )
      : 0;

  /**
   * أول ذكر لم يكتمل بعد.
   */
  const firstIncompleteIndex = mounted
    ? items.findIndex(
        (item) =>
          (progress[item.id] ?? 0) <
          item.repetitions
      )
    : 0;

  const resumeIndex =
    firstIncompleteIndex === -1
      ? 0
      : firstIncompleteIndex;

  const hasProgress =
    mounted && completedCount > 0;

  const isComplete =
    mounted &&
    items.length > 0 &&
    completedCount === items.length;

  return (
    <div className="container-mobile pb-10 pt-8 sm:pt-12">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-[var(--muted)] transition hover:bg-[var(--surface-soft)]"
          style={{
            borderColor: "var(--border)",
          }}
          aria-label="العودة للرئيسية"
        >
          <ArrowLeft size={19} />
        </Link>

        <div className="min-w-0 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl soft text-[var(--primary)]">
          <Icon size={21} />
        </div>
      </header>

      {/* Progress Card */}
      <section className="card mb-5 p-5 sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">
              تقدمك في الورد
            </p>

            <p className="mt-1 text-base font-semibold">
              <span dir="ltr">
                {completedCount} / {items.length}
              </span>{" "}
              ذكر مكتمل
            </p>
          </div>

          <span
            className="text-lg font-bold text-[var(--primary)]"
            dir="ltr"
          >
            {progressPercent}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full progress-track"
          aria-label="نسبة إكمال الورد"
        >
          <div
            className="progress-fill h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">
          {!mounted
            ? "جاري تحميل تقدمك..."
            : isComplete
            ? "أحسنت، أتممت الورد كاملًا."
            : hasProgress
            ? "يمكنك الاستكمال من حيث توقفت."
            : "ابدأ وردك اليوم بخطوة واحدة."}
        </p>
      </section>

      {/* Main Action */}
      <Link
        href={`/reading/${kind}?start=${resumeIndex}`}
        className="focus-ring group mb-7 block rounded-3xl bg-[var(--primary)] p-5 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-lg font-semibold">
              {isComplete
                ? "إعادة الورد"
                : hasProgress
                ? "استكمال الورد"
                : "ابدأ الورد"}
            </p>

            <p className="mt-1 text-sm leading-6 text-white/75">
              {isComplete
                ? "ابدأ من أول ذكر"
                : hasProgress
                ? "ابدأ من أول ذكر غير مكتمل"
                : "اقرأ ذكرًا واحدًا في كل مرة"}
            </p>
          </div>

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </Link>

      {/* List Header */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              قائمة الأذكار
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              اختر ذكرًا للانتقال مباشرة إلى القراءة
            </p>
          </div>

          <span className="shrink-0 text-sm text-[var(--muted)]">
            {items.length} ذكر
          </span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const completed = Math.min(
              progress[item.id] ?? 0,
              item.repetitions
            );

            const isItemComplete =
              mounted &&
              completed >= item.repetitions;

            const isCurrent =
              mounted &&
              firstIncompleteIndex !== -1 &&
              index === firstIncompleteIndex;

            return (
              <Link
                key={item.id}
                href={`/reading/${kind}?start=${item.order - 1}`}
                className={`focus-ring group block rounded-3xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-soft)] ${
                  isCurrent ? "shadow-sm" : ""
                }`}
                style={{
                  borderColor: isCurrent
                    ? "var(--primary)"
                    : isItemComplete
                    ? "var(--primary)"
                    : "var(--border)",
                  background:
                    isCurrent || isItemComplete
                      ? "var(--surface-soft)"
                      : "var(--surface)",
                }}
              >
                <div className="flex gap-4">
                  {/* Number / Complete */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
                      isItemComplete
                        ? "bg-[var(--primary)] text-white"
                        : isCurrent
                        ? "bg-[var(--primary)] text-white"
                        : "soft text-[var(--primary)]"
                    }`}
                    dir="ltr"
                  >
                    {isItemComplete ? (
                      <CheckIcon size={17} />
                    ) : (
                      String(item.order).padStart(2, "0")
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            isItemComplete
                              ? "text-[var(--primary)]"
                              : isCurrent
                              ? "text-[var(--primary)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {isItemComplete
                            ? "مكتمل"
                            : isCurrent
                            ? "عليه الدور"
                            : "غير مكتمل"}
                        </span>

                        {isCurrent &&
                          !isItemComplete && (
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
                              aria-hidden="true"
                            />
                          )}
                      </div>

                      {/* السهم كما هو — لم يتم تغييره */}
                      <span
                        className="shrink-0 text-[var(--muted)] transition-transform duration-200 group-hover:-translate-x-1"
                        aria-hidden="true"
                      >
                        <ArrowRight size={17} />
                      </span>
                    </div>

                    <p className="line-clamp-2 text-[16px] leading-8">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}