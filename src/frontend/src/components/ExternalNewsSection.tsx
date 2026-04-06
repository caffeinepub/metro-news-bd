import { ExternalLink, Loader2, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import type { ExternalNews } from "../hooks/useQueries";
import {
  useFetchExternalNews,
  useGetExternalNews,
  useGetLastFetchedTime,
} from "../hooks/useQueries";

const CATEGORY_ORDER = [
  "রাজনৈতিক",
  "অর্থনৈতিক",
  "ক্রীড়া",
  "জাতীয় খবর",
  "আন্তর্জাতিক খবর",
  "শিক্ষা",
  "স্বাস্থ্য",
  "কৃষি",
  "সাধারণ খবর",
];

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

// Category-based thumbnail images
const CATEGORY_IMAGES: Record<string, string> = {
  রাজনৈতিক: "/assets/generated/thumb-politics.dim_300x200.jpg",
  "জাতীয় খবর": "/assets/generated/thumb-politics.dim_300x200.jpg",
  "আন্তর্জাতিক খবর": "/assets/generated/thumb-international.dim_300x200.jpg",
  অর্থনৈতিক: "/assets/generated/thumb-business.dim_300x200.jpg",
  ক্রীড়া: "/assets/generated/thumb-sports.dim_300x200.jpg",
  শিক্ষা: "/assets/generated/thumb-education.dim_300x200.jpg",
  স্বাস্থ্য: "/assets/generated/thumb-health.dim_300x200.jpg",
  কৃষি: "/assets/generated/thumb-agriculture.dim_300x200.jpg",
  প্রযুক্তি: "/assets/generated/thumb-tech.dim_300x200.jpg",
  সংস্কৃতি: "/assets/generated/thumb-culture.dim_300x200.jpg",
};

function getCategoryImage(category: string): string {
  return (
    CATEGORY_IMAGES[category] ??
    "/assets/generated/thumb-international.dim_300x200.jpg"
  );
}

function formatFetchedAt(fetchedAt: bigint): string {
  const ms = Number(fetchedAt / BigInt(1_000_000));
  const diff = Date.now() - ms;
  if (diff < 60_000) return "এইমাত্র";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} মিনিট আগে`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ঘন্টা আগে`;
  return new Date(ms).toLocaleDateString("bn-BD");
}

function formatLastFetchedTime(time: bigint): string {
  const ms = Number(time / BigInt(1_000_000));
  const diff = Date.now() - ms;
  if (diff < 60_000) return "এইমাত্র";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} মিনিট আগে`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ঘন্টা আগে`;
  return new Date(ms).toLocaleString("bn-BD");
}

function groupByCategory(items: ExternalNews[]): Map<string, ExternalNews[]> {
  const map = new Map<string, ExternalNews[]>();
  for (const item of items) {
    const existing = map.get(item.category) ?? [];
    map.set(item.category, [...existing, item]);
  }
  return map;
}

function getSortedCategories(map: Map<string, ExternalNews[]>): string[] {
  const ordered: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    if (map.has(cat)) ordered.push(cat);
  }
  for (const cat of map.keys()) {
    if (!CATEGORY_ORDER.includes(cat)) ordered.push(cat);
  }
  return ordered;
}

interface NewsCardProps {
  item: ExternalNews;
  onClick: (item: ExternalNews) => void;
  index: number;
}

function NewsCard({ item, onClick, index }: NewsCardProps) {
  const thumbImg = getCategoryImage(item.category);

  return (
    <button
      type="button"
      data-ocid={`external_news.item.${index}`}
      className="relative flex flex-col gap-0 rounded-md cursor-pointer transition-all duration-200 border group w-full text-left overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
      onClick={() => onClick(item)}
      aria-label={`সংবাদ পড়ুন: ${item.title}`}
    >
      {/* Thumbnail image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "140px" }}
      >
        <img
          src={thumbImg}
          alt={item.category}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)",
          }}
        />
        {/* Source badge on image */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm max-w-[120px] truncate"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          title={item.sourceName}
        >
          {item.sourceName}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-3">
        {/* Title */}
        <h3
          className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:opacity-80 transition-opacity"
          style={{ minHeight: "2.5rem" }}
        >
          {item.title}
        </h3>

        {/* Time + source link hint */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[11px]" style={{ color: "#6b6b6b" }}>
            {formatFetchedAt(item.fetchedAt)}
          </p>
          <span
            className="text-[10px] font-semibold flex items-center gap-1"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          >
            <ExternalLink size={10} />
            বিস্তারিত
          </span>
        </div>
      </div>

      {/* Hover accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
        style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
      />
    </button>
  );
}

interface NewsModalProps {
  item: ExternalNews | null;
  onClose: () => void;
}

function NewsModal({ item, onClose }: NewsModalProps) {
  if (!item) return null;

  const thumbImg = getCategoryImage(item.category);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
      data-ocid="external_news.modal"
      aria-modal="true"
      aria-labelledby="ext-news-modal-title"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-xl rounded-lg shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
      >
        {/* Image */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "180px" }}
        >
          <img
            src={thumbImg}
            alt={item.category}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 70%)",
            }}
          />
          {/* Category badge */}
          <span
            className="absolute bottom-3 left-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-sm"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          >
            {item.category}
          </span>
          {/* Close button */}
          <button
            type="button"
            data-ocid="external_news.close_button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded text-white transition-colors"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            aria-label="বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Header */}
        <div
          className="flex items-start px-5 pt-4 pb-3 gap-3"
          style={{ borderBottom: "1px solid #2d2d2d" }}
        >
          <div
            className="w-1 shrink-0 rounded-sm mt-1"
            style={{
              backgroundColor: "oklch(0.4764 0.2183 22.8)",
              minHeight: "1.25rem",
            }}
          />
          <h2
            id="ext-news-modal-title"
            className="text-base font-bold text-white leading-snug"
          >
            {item.title}
          </h2>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Summary */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#6b6b6b" }}
            >
              সারসংক্ষেপ
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#c8c8c8" }}>
              {item.summary?.trim() ? item.summary : "সারসংক্ষেপ পাওয়া যায়নি"}
            </p>
          </div>

          {/* Source + link */}
          <div
            className="flex items-center justify-between pt-3 border-t flex-wrap gap-3"
            style={{ borderColor: "#2d2d2d" }}
          >
            <div>
              <p className="text-xs" style={{ color: "#6b6b6b" }}>
                সূত্র:
                <span
                  className="font-semibold ml-1"
                  style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                >
                  {item.sourceName}
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                ক্যাটাগরি: {item.category} · {formatFetchedAt(item.fetchedAt)}
              </p>
              {/* Source URL as text link */}
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs mt-1 block underline underline-offset-2 break-all"
                style={{ color: "#7ba7c7" }}
              >
                {item.sourceUrl}
              </a>
            </div>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="external_news.link"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 shrink-0"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            >
              <ExternalLink size={13} />
              সংবাদটি পড়ুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-md border overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
    >
      <div
        className="w-full animate-pulse"
        style={{ height: "140px", backgroundColor: "#2d2d2d" }}
      />
      <div className="flex flex-col gap-3 p-3">
        <div
          className="h-4 w-full rounded animate-pulse"
          style={{ backgroundColor: "#2d2d2d" }}
        />
        <div
          className="h-4 w-3/4 rounded animate-pulse"
          style={{ backgroundColor: "#2d2d2d" }}
        />
        <div
          className="h-3 w-16 rounded animate-pulse mt-1"
          style={{ backgroundColor: "#232323" }}
        />
      </div>
    </div>
  );
}

export function ExternalNewsSection() {
  const [selectedItem, setSelectedItem] = useState<ExternalNews | null>(null);

  const { data: externalNews, isLoading, isFetched } = useGetExternalNews();
  const { data: lastFetchedTime } = useGetLastFetchedTime();
  const fetchMutation = useFetchExternalNews();

  const newsList: ExternalNews[] = externalNews ?? [];
  const grouped = groupByCategory(newsList);
  const sortedCategories = getSortedCategories(grouped);

  const hasData = newsList.length > 0;
  const hasFetchedOnce = isFetched;
  const isFetching = fetchMutation.isPending;

  let lastFetchedLabel = "কখনো নয়";
  if (
    lastFetchedTime &&
    lastFetchedTime.length > 0 &&
    lastFetchedTime[0] !== undefined
  ) {
    lastFetchedLabel = formatLastFetchedTime(lastFetchedTime[0]);
  }

  const handleRefresh = () => {
    fetchMutation.mutate();
  };

  return (
    <section aria-labelledby="external-news-heading">
      {/* Section Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div
          className="w-1 h-7 rounded-sm shrink-0"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
        />
        <h2
          id="external-news-heading"
          className="text-base font-bold uppercase tracking-widest text-white shrink-0"
        >
          জাতীয় ও আন্তর্জাতিক সংবাদ
        </h2>
        <div
          className="flex-1 h-px min-w-[20px]"
          style={{ backgroundColor: "#2d2d2d" }}
        />

        {/* Last update + Refresh */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs" style={{ color: "#6b6b6b" }}>
            শেষ আপডেট:{" "}
            <span style={{ color: "#9c9c9c" }}>{lastFetchedLabel}</span>
          </span>
          <button
            type="button"
            data-ocid="external_news.refresh.button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            aria-label="সংবাদ রিফ্রেশ করুন"
          >
            {isFetching ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* First-load skeleton */}
      {isLoading && !hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKELETON_IDS.map((id) => (
            <SkeletonCard key={id} />
          ))}
        </div>
      )}

      {/* Prompt to load if nothing fetched yet */}
      {!isLoading && !hasData && !hasFetchedOnce && (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-lg border"
          style={{ backgroundColor: "#141414", borderColor: "#2d2d2d" }}
          data-ocid="external_news.empty_state"
        >
          <p className="text-sm mb-4" style={{ color: "#9c9c9c" }}>
            সংবাদ এখনো লোড হয়নি। নিচের বাটনে ক্লিক করুন।
          </p>
          <button
            type="button"
            data-ocid="external_news.primary_button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          >
            {isFetching ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                লোড হচ্ছে...
              </>
            ) : (
              "সংবাদ লোড করুন"
            )}
          </button>
        </div>
      )}

      {/* Empty state after fetch */}
      {!isLoading && hasFetchedOnce && !hasData && !isFetching && (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-lg border"
          style={{ backgroundColor: "#141414", borderColor: "#2d2d2d" }}
          data-ocid="external_news.empty_state"
        >
          <p className="text-sm" style={{ color: "#9c9c9c" }}>
            কোনো সংবাদ পাওয়া যায়নি
          </p>
        </div>
      )}

      {/* News by category */}
      {hasData && (
        <div className="flex flex-col gap-10">
          {sortedCategories.map((category) => {
            const items = grouped.get(category) ?? [];
            return (
              <section key={category} aria-labelledby={`ext-cat-${category}`}>
                {/* Category heading */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-1 h-5 rounded-sm shrink-0"
                    style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                  />
                  <h3
                    id={`ext-cat-${category}`}
                    className="text-sm font-bold uppercase tracking-widest text-white shrink-0"
                  >
                    {category}
                  </h3>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#2d2d2d" }}
                  />
                  <span className="text-xs" style={{ color: "#6b6b6b" }}>
                    {items.length} টি সংবাদ
                  </span>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, i) => (
                    <NewsCard
                      key={item.id.toString()}
                      item={item}
                      onClick={setSelectedItem}
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Loading overlay while refreshing with existing data */}
      {isFetching && hasData && (
        <div
          className="flex items-center justify-center gap-2 py-4 mt-4 rounded"
          style={{ backgroundColor: "#141414" }}
          data-ocid="external_news.loading_state"
        >
          <Loader2
            size={16}
            className="animate-spin"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          />
          <span className="text-sm" style={{ color: "#9c9c9c" }}>
            সংবাদ আপডেট হচ্ছে...
          </span>
        </div>
      )}

      {/* Error state */}
      {fetchMutation.isError && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded mt-4"
          style={{
            backgroundColor: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.25)",
          }}
          data-ocid="external_news.error_state"
        >
          <span className="text-sm text-red-400">
            সংবাদ আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
          </span>
        </div>
      )}

      {/* News detail modal */}
      <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
