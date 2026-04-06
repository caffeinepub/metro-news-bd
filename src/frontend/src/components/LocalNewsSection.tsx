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
  const [selectedItem, setSelectedItem] = useState<NewsDetailItem | null>(null);
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
                    style={{ color: "#111827" }}
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

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between mt-3 pt-3"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <div>
                      <p
                        className="text-[11px] font-medium"
                        style={{ color: "#374151" }}
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
