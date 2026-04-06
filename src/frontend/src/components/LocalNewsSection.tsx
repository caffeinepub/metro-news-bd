import {
  CheckCircle,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type NewsDetailItem, NewsDetailModal } from "./NewsDetailModal";

interface LocalArticle {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  imageBase64: string;
  author: string;
  publishedAt: number;
}

const CATEGORIES = [
  "স্থানীয় খবর",
  "রাজনৈতিক",
  "ক্রীড়া",
  "অর্থনীতি",
  "শিক্ষা",
  "স্বাস্থ্য",
  "কৃষি",
  "ধর্মীয় অনুষ্ঠান",
  "জাতীয় খবর",
  "আন্তর্জাতিক খবর",
  "বিনোদন",
  "অপরাধ",
];

const PASSWORD = "baligaon2024";

function formatRelativeTime(publishedAt: number): string {
  const diff = Date.now() - publishedAt;
  if (diff < 60_000) return "এইমাত্র";
  if (diff < 3_600_000) {
    const mins = Math.floor(diff / 60_000);
    return `${mins} মিনিট আগে`;
  }
  if (diff < 86_400_000) {
    const hours = Math.floor(diff / 3_600_000);
    return `${hours} ঘন্টা আগে`;
  }
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return "গতকাল";
  return `${days} দিন আগে`;
}

const CATEGORY_COLORS: Record<string, string> = {
  "স্থানীয় খবর": "#dc2626",
  রাজনৈতিক: "#2563eb",
  ক্রীড়া: "#16a34a",
  অর্থনীতি: "#ca8a04",
  শিক্ষা: "#7c3aed",
  স্বাস্থ্য: "#0891b2",
  কৃষি: "#65a30d",
  "ধর্মীয় অনুষ্ঠান": "#b45309",
  "জাতীয় খবর": "#dc2626",
  "আন্তর্জাতিক খবর": "#6366f1",
  বিনোদন: "#db2777",
  অপরাধ: "#374151",
};

function loadArticles(): LocalArticle[] {
  try {
    const raw = localStorage.getItem("localNews");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveArticles(articles: LocalArticle[]) {
  localStorage.setItem("localNews", JSON.stringify(articles));
}

// Social share helpers
function getShareUrl(article: LocalArticle): string {
  // Use current page URL with a hash anchor for the specific article
  const base = window.location.href.split("#")[0];
  return `${base}#local-news-${article.id}`;
}

function shareFacebook(article: LocalArticle) {
  const url = encodeURIComponent(getShareUrl(article));
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "_blank",
    "noopener,width=600,height=500",
  );
}

function shareWhatsApp(article: LocalArticle) {
  const url = encodeURIComponent(getShareUrl(article));
  const text = encodeURIComponent(`${article.title}\n`);
  window.open(`https://wa.me/?text=${text}${url}`, "_blank", "noopener");
}

function shareTwitter(article: LocalArticle) {
  const url = encodeURIComponent(getShareUrl(article));
  const text = encodeURIComponent(article.title);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    "_blank",
    "noopener,width=600,height=500",
  );
}

function shareYouTube(article: LocalArticle) {
  // YouTube doesn't have a direct share URL for external links;
  // we open YouTube search with the article title as a fallback
  const query = encodeURIComponent(article.title);
  window.open(
    `https://www.youtube.com/results?search_query=${query}`,
    "_blank",
    "noopener",
  );
}

function SocialShareBar({ article }: { article: LocalArticle }) {
  return (
    <div
      className="flex items-center gap-2 pt-2 mt-2"
      style={{ borderTop: "1px solid #f3f4f6" }}
    >
      <span
        className="text-[10px] font-semibold"
        style={{ color: "#9ca3af", whiteSpace: "nowrap" }}
      >
        শেয়ার:
      </span>
      {/* Facebook */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          shareFacebook(article);
        }}
        title="Facebook-এ শেয়ার করুন"
        aria-label="Facebook-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#1877f2",
          flexShrink: 0,
        }}
      >
        <svg
          width="13"
          height="13"
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
        onClick={(e) => {
          e.stopPropagation();
          shareWhatsApp(article);
        }}
        title="WhatsApp-এ শেয়ার করুন"
        aria-label="WhatsApp-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#25d366",
          flexShrink: 0,
        }}
      >
        <svg
          width="13"
          height="13"
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
        onClick={(e) => {
          e.stopPropagation();
          shareTwitter(article);
        }}
        title="Twitter-এ শেয়ার করুন"
        aria-label="Twitter-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#000000",
          flexShrink: 0,
        }}
      >
        <svg
          width="13"
          height="13"
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
        onClick={(e) => {
          e.stopPropagation();
          shareYouTube(article);
        }}
        title="YouTube-এ শেয়ার করুন"
        aria-label="YouTube-এ শেয়ার করুন"
        className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#ff0000",
          flexShrink: 0,
        }}
      >
        <svg
          width="13"
          height="13"
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

export function LocalNewsSection() {
  const [articles, setArticles] = useState<LocalArticle[]>(() =>
    loadArticles(),
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("localNewsLoggedIn") === "1",
  );
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // UI state
  const [titleError, setTitleError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (NewsDetailItem & { articleId?: string; articleData?: LocalArticle }) | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  function handleLogin() {
    if (passwordInput === PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("localNewsLoggedIn", "1");
      setShowLoginBox(false);
      setPasswordInput("");
      setLoginError("");
    } else {
      setLoginError("পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।");
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("localNewsLoggedIn");
    setShowLoginBox(false);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageBase64("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePublish() {
    let valid = true;
    if (!title.trim()) {
      setTitleError("শিরোনাম আবশ্যক");
      valid = false;
    } else {
      setTitleError("");
    }
    if (!summary.trim()) {
      setSummaryError("সংবাদের বিস্তারিত আবশ্যক");
      valid = false;
    } else {
      setSummaryError("");
    }
    if (!valid) return;

    const newArticle: LocalArticle = {
      id: Date.now().toString(),
      title: title.trim(),
      summary: summary.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceName: sourceName.trim() || "নিজস্ব প্রতিবেদক",
      category,
      imageBase64,
      author: author.trim() || "বালীগাঁও নিউজ",
      publishedAt: Date.now(),
    };

    const updated = [newArticle, ...articles];
    setArticles(updated);
    saveArticles(updated);

    // Reset form
    setTitle("");
    setSummary("");
    setAuthor("");
    setSourceName("");
    setSourceUrl("");
    setCategory(CATEGORIES[0]);
    setImageBase64("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setShowSuccess(true);
  }

  function handleDelete(id: string) {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveArticles(updated);
  }

  function openArticle(article: LocalArticle) {
    setSelectedItem({
      title: article.title,
      summary: article.summary,
      category: article.category,
      author: article.author,
      time: formatRelativeTime(article.publishedAt),
      sourceUrl: article.sourceUrl || undefined,
      sourceName: article.sourceName || undefined,
      image: article.imageBase64 || undefined,
      articleData: article,
    });
  }

  const sorted = [...articles].sort((a, b) => b.publishedAt - a.publishedAt);

  return (
    <section id="local-news" aria-labelledby="local-news-heading">
      {/* Section Header */}
      <div
        className="flex items-center justify-between gap-4 mb-6 pb-3"
        style={{ borderBottom: "2px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-7 rounded-sm shrink-0"
            style={{ backgroundColor: "#dc2626" }}
          />
          <h2
            id="local-news-heading"
            className="text-lg font-bold uppercase tracking-wide"
            style={{ color: "#111827", letterSpacing: "0.06em" }}
          >
            স্থানীয় সংবাদ
          </h2>
        </div>

        {/* Login / Logout button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              type="button"
              data-ocid="local_news.logout.button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
              style={{
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <LogOut size={13} />
              লগআউট
            </button>
          ) : (
            <button
              type="button"
              data-ocid="local_news.login.button"
              onClick={() => setShowLoginBox(!showLoginBox)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
              style={{
                color: "#dc2626",
                border: "1.5px solid #dc2626",
                backgroundColor: showLoginBox ? "#fef2f2" : "transparent",
              }}
            >
              <Lock size={13} />
              সংবাদকর্মী লগইন
            </button>
          )}
        </div>
      </div>

      {/* Inline Login Box */}
      {showLoginBox && !isLoggedIn && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          data-ocid="local_news.login.panel"
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "#991b1b" }}
          >
            🔐 সংবাদকর্মী লগইন
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="পাসওয়ার্ড দিন..."
              data-ocid="local_news.password.input"
              className="flex-1 px-3 py-2 text-sm rounded-md border focus:outline-none"
              style={{
                borderColor: loginError ? "#ef4444" : "#fca5a5",
                backgroundColor: "#ffffff",
                color: "#111827",
              }}
            />
            <button
              type="button"
              data-ocid="local_news.login_submit.button"
              onClick={handleLogin}
              className="px-4 py-2 text-xs font-bold text-white rounded-md transition-colors"
              style={{ backgroundColor: "#dc2626" }}
            >
              লগইন
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLoginBox(false);
                setPasswordInput("");
                setLoginError("");
              }}
              className="p-2 rounded-md"
              style={{ color: "#9ca3af" }}
              aria-label="বাতিল"
            >
              <X size={16} />
            </button>
          </div>
          {loginError && (
            <p
              className="text-xs mt-2"
              style={{ color: "#dc2626" }}
              data-ocid="local_news.login.error_state"
            >
              {loginError}
            </p>
          )}
        </div>
      )}

      {/* Success Banner */}
      {showSuccess && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
          data-ocid="local_news.publish.success_state"
        >
          <CheckCircle size={16} style={{ color: "#16a34a" }} />
          <span className="text-sm font-semibold" style={{ color: "#15803d" }}>
            সংবাদ সফলভাবে প্রকাশিত হয়েছে!
          </span>
        </div>
      )}

      {/* Editor Form — only when logged in */}
      {isLoggedIn && (
        <div
          className="mb-8 p-5 rounded-xl"
          style={{
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
          data-ocid="local_news.editor.panel"
        >
          <h3
            className="text-sm font-bold mb-4 flex items-center gap-2"
            style={{ color: "#111827" }}
          >
            <Plus size={15} style={{ color: "#dc2626" }} />
            নতুন সংবাদ লিখুন
          </h3>

          <div className="flex flex-col gap-3">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="শিরোনাম লিখুন..."
                data-ocid="local_news.title.input"
                className="w-full px-3 py-2.5 text-sm rounded-md border focus:outline-none transition-colors"
                style={{
                  borderColor: titleError ? "#ef4444" : "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              />
              {titleError && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#dc2626" }}
                  data-ocid="local_news.title.error_state"
                >
                  {titleError}
                </p>
              )}
            </div>

            {/* Summary */}
            <div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="সংবাদের বিস্তারিত লিখুন..."
                rows={5}
                data-ocid="local_news.summary.textarea"
                className="w-full px-3 py-2.5 text-sm rounded-md border focus:outline-none transition-colors resize-none"
                style={{
                  borderColor: summaryError ? "#ef4444" : "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              />
              {summaryError && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#dc2626" }}
                  data-ocid="local_news.summary.error_state"
                >
                  {summaryError}
                </p>
              )}
            </div>

            {/* Author + Source Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="সাংবাদিকের নাম..."
                data-ocid="local_news.author.input"
                className="px-3 py-2.5 text-sm rounded-md border focus:outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              />
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="সোর্সের নাম (যেমন: নিজস্ব প্রতিবেদক)..."
                data-ocid="local_news.source_name.input"
                className="px-3 py-2.5 text-sm rounded-md border focus:outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              />
            </div>

            {/* Source URL + Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="সোর্স লিংক (ঐচ্ছিক)..."
                data-ocid="local_news.source_url.input"
                className="px-3 py-2.5 text-sm rounded-md border focus:outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-ocid="local_news.category.select"
                className="px-3 py-2.5 text-sm rounded-md border focus:outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="প্রিভিউ"
                    className="rounded-md object-cover"
                    style={{
                      height: 120,
                      maxWidth: 240,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    data-ocid="local_news.remove_image.button"
                    className="absolute top-1 right-1 p-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                    }}
                    aria-label="ছবি সরান"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="local_news.upload_button"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-md border-2 border-dashed transition-colors"
                  style={{
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    backgroundColor: "transparent",
                  }}
                >
                  <Upload size={14} />
                  ছবি আপলোড করুন
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                data-ocid="local_news.image_file.input"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handlePublish}
              data-ocid="local_news.publish.submit_button"
              className="w-full sm:w-auto self-end px-6 py-2.5 text-sm font-bold text-white rounded-md transition-colors"
              style={{ backgroundColor: "#dc2626" }}
            >
              প্রকাশ করুন
            </button>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {sorted.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          data-ocid="local_news.empty_state"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <span style={{ fontSize: 28 }}>📰</span>
          </div>
          <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
            এখনো কোনো স্থানীয় সংবাদ নেই
          </p>
          {!isLoggedIn && (
            <p className="text-xs mt-1" style={{ color: "#d1d5db" }}>
              সংবাদকর্মী লগইন করে সংবাদ প্রকাশ করুন
            </p>
          )}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="local_news.list"
        >
          {sorted.map((article, i) => {
            const catColor = CATEGORY_COLORS[article.category] ?? "#dc2626";
            return (
              <article
                key={article.id}
                id={`local-news-${article.id}`}
                data-ocid={`local_news.item.${i + 1}`}
                className="rounded-xl overflow-hidden flex flex-col transition-shadow duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {/* Image */}
                <button
                  type="button"
                  onClick={() => openArticle(article)}
                  className="block w-full text-left focus:outline-none"
                  aria-label={article.title}
                >
                  {article.imageBase64 ? (
                    <div
                      className="w-full overflow-hidden"
                      style={{ height: 160 }}
                    >
                      <img
                        src={article.imageBase64}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full flex items-center justify-center"
                      style={{
                        height: 160,
                        background: `linear-gradient(135deg, ${catColor}22 0%, ${catColor}11 100%)`,
                      }}
                    >
                      <span
                        className="text-4xl font-bold"
                        style={{ color: catColor, opacity: 0.4 }}
                      >
                        {article.category.charAt(0)}
                      </span>
                    </div>
                  )}
                </button>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-4">
                  {/* Category badge */}
                  <span
                    className="inline-block self-start px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-sm mb-2"
                    style={{ backgroundColor: catColor }}
                  >
                    {article.category}
                  </span>

                  {/* Title */}
                  <button
                    type="button"
                    onClick={() => openArticle(article)}
                    data-ocid={`local_news.title.${i + 1}`}
                    className="text-sm font-bold text-left leading-snug mb-2 hover:underline focus:outline-none transition-colors"
                    style={{
                      color: "#111827",
                      fontSize: "16px",
                      marginBottom: "10px",
                    }}
                  >
                    {article.title}
                  </button>

                  {/* Summary snippet */}
                  <p
                    className="text-xs leading-relaxed line-clamp-2 flex-1"
                    style={{ color: "#6b7280" }}
                  >
                    {article.summary}
                  </p>

                  {/* Footer row: author/time + delete */}
                  <div
                    className="flex items-center justify-between mt-3 pt-3"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <div>
                      <p
                        className="text-[11px] font-medium"
                        style={{
                          color: "#374151",
                          fontSize: "13px",
                          marginTop: "6px",
                        }}
                      >
                        {article.author}
                      </p>
                      <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                        {formatRelativeTime(article.publishedAt)}
                      </p>
                    </div>

                    {/* Delete button (admin only) */}
                    {isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        data-ocid={`local_news.delete_button.${i + 1}`}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded transition-colors"
                        style={{
                          color: "#dc2626",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                        }}
                        aria-label="সংবাদ মুছুন"
                      >
                        <Trash2 size={10} />
                        মুছুন
                      </button>
                    )}
                  </div>

                  {/* Social Share Bar */}
                  <SocialShareBar article={article} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
