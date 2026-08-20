import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  MoonIcon,
  SunIcon,
} from "../../components/Icons";
import { getAdhkar } from "@/lib/adhkar";
import { getProgress } from "@/lib/storage";
import type { AzkarType } from "@/lib/types";

export default async function AzkarList({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (
    type !== "morning" &&
    type !== "evening"
  ) {
    notFound();
  }

  const kind = type as AzkarType;
  const items = getAdhkar(kind);

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

  const progress = getProgress();

  const completedCount = items.filter(
    (item) =>
      (progress[item.id] ?? 0) >=
      item.repetitions
  ).length;

  const progressPercent =
    items.length > 0
      ? Math.round(
          (completedCount / items.length) * 100
        )
      : 0;

  const firstIncompleteIndex =
    items.findIndex(
      (item) =>
        (progress[item.id] ?? 0) <
        item.repetitions
    );

  const resumeIndex =
    firstIncompleteIndex === -1
      ? 0
      : firstIncompleteIndex;

  const hasProgress = completedCount > 0;
  const isComplete =
    completedCount === items.length &&
    items.length > 0;

  return (
    <div className="container-mobile pb-10 pt-8 sm:pt-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
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
          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl soft text-[var(--primary)]">
          <Icon size={21} />
        </div>
      </div>

      {/* Progress */}
      <section className="card mb-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">
              تقدمك
            </p>

            <p className="mt-1 font-semibold">
              <span dir="ltr">
                {completedCount} / {items.length}
              </span>{" "}
              ذكر مكتمل
            </p>
          </div>

          <span
            className="text-sm font-semibold text-[var(--primary)]"
            dir="ltr"
          >
            {progressPercent}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full progress-track">
          <div
            className="progress-fill h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </section>

      {/* Main action */}
      <Link
        href={`/reading/${kind}?start=${resumeIndex}`}
        className="focus-ring group mb-6 block rounded-3xl bg-[var(--primary)] p-5 text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">
              {isComplete
                ? "إعادة الورد"
                : hasProgress
                ? "استكمال الورد"
                : "ابدأ الورد"}
            </div>

            <div className="mt-1 text-sm text-white/75">
              {isComplete
                ? "إعادة قراءة الأذكار من البداية"
                : hasProgress
                ? "ابدأ من حيث توقفت"
                : "اقرأ ذكرًا واحدًا في كل مرة"}
            </div>
          </div>

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </Link>

      {/* List */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            قائمة الأذكار
          </h2>

          <span className="text-sm text-[var(--muted)]">
            {items.length} ذكر
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const completed = Math.min(
              progress[item.id] ?? 0,
              item.repetitions
            );

            const isItemComplete =
              completed >= item.repetitions;

            return (
              <Link
                key={item.id}
                href={`/reading/${kind}?start=${item.order - 1}`}
                className="focus-ring group block rounded-3xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-soft)]"
                style={{
                  borderColor: isItemComplete
                    ? "var(--primary)"
                    : "var(--border)",
                  background: isItemComplete
                    ? "var(--surface-soft)"
                    : "var(--surface)",
                }}
              >
                <div className="flex gap-4">
                  {/* Number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
                      isItemComplete
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
                      <span
                        className={`text-xs ${
                          isItemComplete
                            ? "text-[var(--primary)]"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {isItemComplete
                          ? "مكتمل"
                          : "غير مكتمل"}
                      </span>

                      <ArrowRight
                        size={17}
                        className="shrink-0 text-[var(--muted)] transition-transform duration-200 group-hover:-translate-x-1"
                      />
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