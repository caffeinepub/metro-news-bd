import { ExternalLink, X } from "lucide-react";

export interface NewsDetailItem {
  title: string;
  summary: string;
  category: string;
  author?: string;
  time?: string;
  sourceUrl?: string;
  sourceName?: string;
  image?: string;
}

interface NewsDetailModalProps {
  item: NewsDetailItem | null;
  onClose: () => void;
}

export function NewsDetailModal({ item, onClose }: NewsDetailModalProps) {
  if (!item) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
      aria-modal="true"
      aria-labelledby="news-detail-modal-title"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-xl rounded-lg shadow-2xl"
        style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
      >
        {/* Image if available */}
        {item.image && (
          <div
            className="w-full overflow-hidden rounded-t-lg"
            style={{ maxHeight: "200px" }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}

        {/* Modal Header */}
        <div
          className="flex items-start justify-between px-6 py-4 border-b gap-4"
          style={{ borderColor: "#2d2d2d" }}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-1 shrink-0 rounded-sm mt-1"
              style={{
                backgroundColor: "oklch(0.4764 0.2183 22.8)",
                minHeight: "1.25rem",
              }}
            />
            <div className="flex-1 min-w-0">
              {item.category && (
                <span
                  className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-2"
                  style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                >
                  {item.category}
                </span>
              )}
              <h2
                id="news-detail-modal-title"
                className="text-base font-bold text-white leading-snug"
              >
                {item.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded text-gray-400 hover:text-white transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
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

          {/* Meta + Source */}
          <div
            className="flex items-center justify-between pt-3 border-t flex-wrap gap-3"
            style={{ borderColor: "#2d2d2d" }}
          >
            <div>
              {(item.author || item.time) && (
                <p className="text-xs" style={{ color: "#9c9c9c" }}>
                  {item.author && <span>{item.author}</span>}
                  {item.author && item.time && <span> · </span>}
                  {item.time && <span>{item.time}</span>}
                </p>
              )}
              {item.sourceName && (
                <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                  সূত্র:{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                  >
                    {item.sourceName}
                  </span>
                </p>
              )}
            </div>
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
              >
                <ExternalLink size={13} />
                সম্পূর্ণ পড়ুন
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
