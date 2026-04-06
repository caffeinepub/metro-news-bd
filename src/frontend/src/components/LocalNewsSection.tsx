import {
  CheckCircle,
  Clock,
  Database,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LocalNewsArticle } from "../backend";
import { useActor } from "../hooks/useActor";
import { type NewsDetailItem, NewsDetailModal } from "./NewsDetailModal";

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

function formatRelativeTime(publishedAtMs: number): string {
  const diff = Date.now() - publishedAtMs;
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

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

// Convert backend LocalNewsArticle (nanoseconds) to display format
function toDisplayMs(publishedAt: bigint): number {
  return Number(publishedAt) / 1_000_000;
}

// --- Open Graph Meta Tag helpers ---
function setMetaTag(selector: string, attribute: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (selector.includes("[property=")) {
      const prop = selector.match(/\[property=["']([^"']+)["']/)?.[1];
      if (prop) el.setAttribute("property", prop);
    } else {
      const name = selector.match(/\[name=["']([^"']+)["']/)?.[1];
      if (name) el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

function updateOpenGraphMeta(article: LocalNewsArticle) {
  const base = window.location.href.split("#")[0].split("?")[0];
  const articleUrl = `${base}?news=${article.id.toString()}#local-news-${article.id.toString()}`;
  const shortSummary =
    article.summary.slice(0, 200) + (article.summary.length > 200 ? "..." : "");
  const titleFull = `${article.title} | বালীগাঁও নিউজ`;
  document.title = titleFull;
  setMetaTag(`meta[property="og:title"]`, "content", titleFull);
  setMetaTag(`meta[property="og:description"]`, "content", shortSummary);
  setMetaTag(`meta[property="og:url"]`, "content", articleUrl);
  setMetaTag(`meta[property="og:type"]`, "content", "article");
  if (article.imageBase64) {
    setMetaTag(`meta[property="og:image"]`, "content", article.imageBase64);
  }
  setMetaTag(`meta[name="twitter:title"]`, "content", titleFull);
  setMetaTag(`meta[name="twitter:description"]`, "content", shortSummary);
  if (article.imageBase64) {
    setMetaTag(`meta[name="twitter:image"]`, "content", article.imageBase64);
  }
}

function resetOpenGraphMeta() {
  const siteName = "বালীগাঁও নিউজ - Voice of Truth & Freedom";
  const siteDesc =
    "বালীগাঁও, লাখাই, হবিগঞ্জ ও আশপাশের এলাকার সর্বশেষ স্থানীয়, জাতীয় ও আন্তর্জাতিক সংবাদ।";
  document.title = siteName;
  setMetaTag(`meta[property="og:title"]`, "content", siteName);
  setMetaTag(`meta[property="og:description"]`, "content", siteDesc);
  setMetaTag(`meta[property="og:url"]`, "content", window.location.href);
  setMetaTag(`meta[property="og:type"]`, "content", "website");
  setMetaTag(`meta[name="twitter:title"]`, "content", siteName);
  setMetaTag(`meta[name="twitter:description"]`, "content", siteDesc);
}

// Social share helpers
function getShareUrl(article: LocalNewsArticle): string {
  const base = window.location.href.split("#")[0].split("?")[0];
  return `${base}?news=${article.id.toString()}#local-news-${article.id.toString()}`;
}

function shareFacebook(article: LocalNewsArticle) {
  updateOpenGraphMeta(article);
  const url = encodeURIComponent(getShareUrl(article));
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "_blank",
    "noopener,width=600,height=500",
  );
}

function shareWhatsApp(article: LocalNewsArticle) {
  const url = encodeURIComponent(getShareUrl(article));
  const text = encodeURIComponent(
    `${article.title}\n${article.summary.slice(0, 100)}...\n`,
  );
  window.open(`https://wa.me/?text=${text}${url}`, "_blank", "noopener");
}

function shareTwitter(article: LocalNewsArticle) {
  updateOpenGraphMeta(article);
  const url = encodeURIComponent(getShareUrl(article));
  const text = encodeURIComponent(article.title);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    "_blank",
    "noopener,width=600,height=500",
  );
}

function shareYouTube(article: LocalNewsArticle) {
  const query = encodeURIComponent(article.title);
  window.open(
    `https://www.youtube.com/results?search_query=${query}`,
    "_blank",
    "noopener",
  );
}

function SocialShareBar({ article }: { article: LocalNewsArticle }) {
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

// ---- Legacy localStorage article type ----
interface LegacyLocalArticle {
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

export function LocalNewsSection() {
  const { actor, isFetching: actorFetching } = useActor();

  const [articles, setArticles] = useState<LocalNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [migrating, setMigrating] = useState(false);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Auth
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

  // Validation
  const [titleError, setTitleError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal
  const [selectedItem, setSelectedItem] = useState<NewsDetailItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Load articles from blockchain ----
  const loadArticles = useCallback(async () => {
    if (!actor || actorFetching) return;
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await actor.getAllLocalNews();
      const sorted = [...result].sort((a, b) => {
        const aMs = toDisplayMs(a.publishedAt);
        const bMs = toDisplayMs(b.publishedAt);
        return bMs - aMs;
      });
      setArticles(sorted);

      // Migration: check localStorage for old articles
      const raw = localStorage.getItem("localNews");
      if (raw && result.length === 0) {
        let legacy: LegacyLocalArticle[] = [];
        try {
          legacy = JSON.parse(raw);
        } catch {
          legacy = [];
        }
        if (legacy.length > 0) {
          setMigrating(true);
          const migrated: LocalNewsArticle[] = [];
          for (const old of legacy) {
            try {
              const newId = await actor.addLocalNews(
                old.title,
                old.summary,
                old.category,
                old.imageBase64 || "",
                old.author || "বালীগাঁও নিউজ",
                old.sourceName || "নিজস্ব প্রতিবেদক",
                old.sourceUrl || "",
              );
              migrated.push({
                id: newId,
                title: old.title,
                summary: old.summary,
                category: old.category,
                imageBase64: old.imageBase64 || "",
                author: old.author || "বালীগাঁও নিউজ",
                sourceName: old.sourceName || "নিজস্ব প্রতিবেদক",
                sourceUrl: old.sourceUrl || "",
                publishedAt: BigInt(old.publishedAt) * 1_000_000n,
              });
            } catch (err) {
              console.error("Migration error for article:", old.title, err);
            }
          }
          if (migrated.length > 0) {
            localStorage.removeItem("localNews");
            const migSorted = [...migrated].sort((a, b) => {
              return toDisplayMs(b.publishedAt) - toDisplayMs(a.publishedAt);
            });
            setArticles(migSorted);
          }
          setMigrating(false);
        }
      }
    } catch (err) {
      console.error("Failed to load articles:", err);
      setLoadError("ব্লকচেইন থেকে সংবাদ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, [actor, actorFetching]);

  useEffect(() => {
    if (actor && !actorFetching) {
      loadArticles();
    }
  }, [actor, actorFetching, loadArticles]);

  // On mount: check URL for ?news=<id> and auto-open that article
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get("news");
    if (newsId && articles.length > 0) {
      const found = articles.find((a) => a.id.toString() === newsId);
      if (found) {
        updateOpenGraphMeta(found);
        setTimeout(() => {
          const el = document.getElementById(
            `local-news-${found.id.toString()}`,
          );
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [articles]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (!selectedItem) {
      resetOpenGraphMeta();
    }
  }, [selectedItem]);

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

  async function handlePublish() {
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
    if (!actor) {
      setSaveError("ব্লকচেইন সংযোগ স্থাপিত হয়নি। একটু অপেক্ষা করুন।");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    try {
      await actor.addLocalNews(
        title.trim(),
        summary.trim(),
        category,
        imageBase64,
        author.trim() || "বালীগাঁও নিউজ",
        sourceName.trim() || "নিজস্ব প্রতিবেদক",
        sourceUrl.trim(),
      );

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
      await loadArticles();
    } catch (err) {
      console.error("Failed to save article:", err);
      setSaveError("সংবাদ সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: bigint) {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteLocalNews(id);
      await loadArticles();
    } catch (err) {
      console.error("Failed to delete article:", err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSearch() {
    if (!actor) return;
    setIsSearching(true);
    setLoadError("");
    try {
      let result: LocalNewsArticle[] = [];
      if (searchFromDate && searchToDate) {
        const fromMs = new Date(searchFromDate).getTime();
        const toMs = new Date(searchToDate).setHours(23, 59, 59, 999);
        const fromNs = BigInt(fromMs) * 1_000_000n;
        const toNs = BigInt(toMs) * 1_000_000n;
        result = await actor.getLocalNewsByDateRange(fromNs, toNs);
      } else if (searchKeyword.trim()) {
        result = await actor.searchLocalNews(searchKeyword.trim());
      } else {
        await loadArticles();
        setIsSearchMode(false);
        return;
      }
      const sorted = [...result].sort(
        (a, b) => toDisplayMs(b.publishedAt) - toDisplayMs(a.publishedAt),
      );
      setArticles(sorted);
      setIsSearchMode(true);
    } catch (err) {
      console.error("Search failed:", err);
      setLoadError("সার্চ করতে সমস্যা হয়েছে।");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleResetSearch() {
    setSearchKeyword("");
    setSearchFromDate("");
    setSearchToDate("");
    setIsSearchMode(false);
    await loadArticles();
  }

  function openArticle(article: LocalNewsArticle) {
    updateOpenGraphMeta(article);
    const publishedMs = toDisplayMs(article.publishedAt);
    setSelectedItem({
      title: article.title,
      summary: article.summary,
      category: article.category,
      author: article.author,
      time: formatRelativeTime(publishedMs),
      sourceUrl: article.sourceUrl || undefined,
      sourceName: article.sourceName || undefined,
      image: article.imageBase64 || undefined,
      articleData: {
        id: article.id.toString(),
        title: article.title,
        summary: article.summary,
        imageBase64: article.imageBase64,
      },
    });
  }

  const showSearchBar = articles.length > 0 || isLoggedIn || isSearchMode;

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
          {/* Blockchain badge */}
          <span
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: "#ecfdf5",
              color: "#059669",
              border: "1px solid #a7f3d0",
            }}
            title="সংবাদগুলো ব্লকচেইনে স্থায়ীভাবে সংরক্ষিত"
          >
            <Database size={9} />
            ব্লকচেইন
          </span>
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

      {/* Migration notice */}
      {migrating && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
          data-ocid="local_news.migration.loading_state"
        >
          <Loader2
            size={15}
            className="animate-spin"
            style={{ color: "#2563eb" }}
          />
          <span className="text-sm font-medium" style={{ color: "#1d4ed8" }}>
            আগের সংবাদগুলো ব্লকচেইনে স্থানান্তরিত হচ্ছে...
          </span>
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
            সংবাদ সফলভাবে ব্লকচেইনে সংরক্ষিত হয়েছে!
          </span>
        </div>
      )}

      {/* Save Error */}
      {saveError && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          data-ocid="local_news.save.error_state"
        >
          <X size={15} style={{ color: "#dc2626" }} />
          <span className="text-sm" style={{ color: "#dc2626" }}>
            {saveError}
          </span>
          <button
            type="button"
            onClick={() => setSaveError("")}
            className="ml-auto"
            style={{ color: "#9ca3af" }}
            aria-label="বন্ধ করুন"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Editor Form — only when logged in */}
      {isLoggedIn && (
        <div
          className="mb-8 p-5 rounded-xl"
          style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          data-ocid="local_news.editor.panel"
        >
          <h3
            className="text-sm font-bold mb-4 flex items-center gap-2"
            style={{ color: "#111827" }}
          >
            <Plus size={15} style={{ color: "#dc2626" }} />
            নতুন সংবাদ লিখুন
            <span
              className="ml-auto flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#ecfdf5",
                color: "#059669",
                border: "1px solid #a7f3d0",
              }}
            >
              <Database size={9} />
              ব্লকচেইনে সংরক্ষিত হবে
            </span>
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
                placeholder="সোর্স লিঙ্ক (ঐচ্ছিক)..."
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
              disabled={isSaving}
              data-ocid="local_news.publish.submit_button"
              className="w-full sm:w-auto self-end px-6 py-2.5 text-sm font-bold text-white rounded-md transition-colors flex items-center gap-2"
              style={{
                backgroundColor: isSaving ? "#9ca3af" : "#dc2626",
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isSaving ? "সংরক্ষণ হচ্ছে..." : "প্রকাশ করুন"}
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {showSearchBar && (
        <div
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          data-ocid="local_news.search.panel"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Keyword input */}
            <div
              className="flex items-center flex-1 gap-2 px-3 py-2 rounded-md border"
              style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
            >
              <Search size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="কীওয়ার্ড দিয়ে সার্চ করুন..."
                data-ocid="local_news.search_input"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: "#111827" }}
              />
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2 py-2 rounded-md border"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
              >
                <Clock size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
                <input
                  type="date"
                  value={searchFromDate}
                  onChange={(e) => setSearchFromDate(e.target.value)}
                  data-ocid="local_news.search_from_date.input"
                  className="text-xs bg-transparent outline-none"
                  style={{ color: "#374151" }}
                />
              </div>
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                থেকে
              </span>
              <div
                className="flex items-center gap-1.5 px-2 py-2 rounded-md border"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
              >
                <Clock size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
                <input
                  type="date"
                  value={searchToDate}
                  onChange={(e) => setSearchToDate(e.target.value)}
                  data-ocid="local_news.search_to_date.input"
                  className="text-xs bg-transparent outline-none"
                  style={{ color: "#374151" }}
                />
              </div>
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              data-ocid="local_news.search.button"
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-md transition-colors"
              style={{
                backgroundColor: isSearching ? "#9ca3af" : "#2563eb",
                cursor: isSearching ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}
            >
              {isSearching ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Search size={13} />
              )}
              সার্চ করুন
            </button>

            {/* Reset button */}
            {isSearchMode && (
              <button
                type="button"
                onClick={handleResetSearch}
                data-ocid="local_news.search_reset.button"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors"
                style={{
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <X size={13} />
                সব দেখুন
              </button>
            )}
          </div>

          {isSearchMode && (
            <p className="mt-2 text-xs" style={{ color: "#6b7280" }}>
              {articles.length} টি সংবাদ পাওয়া গেছে
            </p>
          )}
        </div>
      )}

      {/* Load Error */}
      {loadError && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          data-ocid="local_news.load.error_state"
        >
          <X size={15} style={{ color: "#dc2626" }} />
          <span className="text-sm" style={{ color: "#dc2626" }}>
            {loadError}
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          data-ocid="local_news.loading_state"
        >
          <Loader2
            size={32}
            className="animate-spin mb-3"
            style={{ color: "#dc2626" }}
          />
          <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
            ব্লকচেইন থেকে সংবাদ লোড হচ্ছে...
          </p>
        </div>
      ) : articles.length === 0 ? (
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
            {isSearchMode
              ? "এই সার্চে কোনো সংবাদ পাওয়া যায়নি"
              : "এখনো কোনো স্থানীয় সংবাদ নেই"}
          </p>
          {!isLoggedIn && !isSearchMode && (
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
          {articles.map((article, i) => {
            const catColor = CATEGORY_COLORS[article.category] ?? "#dc2626";
            const publishedMs = toDisplayMs(article.publishedAt);
            const isDeleting = deletingId === article.id;
            return (
              <article
                key={article.id.toString()}
                id={`local-news-${article.id.toString()}`}
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
                        {formatRelativeTime(publishedMs)} ·{" "}
                        {formatDate(publishedMs)}
                      </p>
                      {/* Blockchain stored indicator */}
                      <p
                        className="text-[9px] flex items-center gap-0.5 mt-0.5"
                        style={{ color: "#059669" }}
                      >
                        <Database size={8} />
                        ব্লকচেইনে সংরক্ষিত
                      </p>
                    </div>

                    {/* Delete button (admin only) */}
                    {isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting}
                        data-ocid={`local_news.delete_button.${i + 1}`}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded transition-colors"
                        style={{
                          color: isDeleting ? "#9ca3af" : "#dc2626",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          cursor: isDeleting ? "not-allowed" : "pointer",
                        }}
                        aria-label="সংবাদ মুছুন"
                      >
                        {isDeleting ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Trash2 size={10} />
                        )}
                        {isDeleting ? "মুছছে..." : "মুছুন"}
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
