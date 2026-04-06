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
  // optional: the original local article data for social sharing
  articleData?: {
    id: string;
    title: string;
    summary: string;
    imageBase64?: string;
  };
}

interface NewsDetailModalProps {
  item: NewsDetailItem | null;
  onClose: () => void;
}

function getArticleShareUrl(articleId: string): string {
  const base = window.location.href.split("#")[0];
  return `${base}#local-news-${articleId}`;
}

function SocialShareRowModal({
  articleData,
  title,
}: {
  articleData: { id: string; title: string };
  title: string;
}) {
  const shareUrl = getArticleShareUrl(articleData.id);

  function openFacebook() {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,width=600,height=500",
    );
  }
  function openWhatsApp() {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${title}\n`);
    window.open(`https://wa.me/?text=${text}${url}`, "_blank", "noopener");
  }
  function openTwitter() {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(title);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,width=600,height=500",
    );
  }
  function openYouTube() {
    const query = encodeURIComponent(title);
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank",
      "noopener",
    );
  }

  return (
    <div
      className="flex items-center gap-2 pt-3 mt-3"
      style={{ borderTop: "1px solid #2d2d2d" }}
    >
      <span
        className="text-[10px] font-semibold"
        style={{ color: "#6b6b6b", whiteSpace: "nowrap" }}
      >
        শেয়ার:
      </span>
      {/* Facebook */}
      <button
        type="button"
        onClick={openFacebook}
        title="Facebook-এ শেয়ার করুন"
        aria-label="Facebook-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#1877f2",
          flexShrink: 0,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
      {/* WhatsApp */}
      <button
        type="button"
        onClick={openWhatsApp}
        title="WhatsApp-এ শেয়ার করুন"
        aria-label="WhatsApp-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#25d366",
          flexShrink: 0,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
      {/* Twitter / X */}
      <button
        type="button"
        onClick={openTwitter}
        title="Twitter-এ শেয়ার করুন"
        aria-label="Twitter-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#000000",
          flexShrink: 0,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      {/* YouTube */}
      <button
        type="button"
        onClick={openYouTube}
        title="YouTube-এ শেয়ার করুন"
        aria-label="YouTube-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 30,
          height: 30,
          backgroundColor: "#ff0000",
          flexShrink: 0,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </button>
    </div>
  );
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
        className="relative w-full max-w-xl rounded-lg shadow-2xl flex flex-col"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #2d2d2d",
          maxHeight: "90vh",
        }}
      >
        {/* Image if available */}
        {item.image && (
          <div
            className="w-full overflow-hidden rounded-t-lg shrink-0"
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
          className="flex items-start justify-between px-6 py-4 border-b gap-4 shrink-0"
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

        {/* Scrollable Modal Body */}
        <div
          className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
          style={{ overflowY: "auto" }}
        >
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
                সম্পূর্ণ পড়ুন
              </a>
            )}
          </div>

          {/* Social Share — only for local articles */}
          {item.articleData && (
            <SocialShareRowModal
              articleData={item.articleData}
              title={item.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}
