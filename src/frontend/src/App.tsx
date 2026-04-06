import { useState } from "react";
import type { Article } from "./backend";
import { BreakingNewsTicker } from "./components/BreakingNewsTicker";
import { CategoryNewsSection } from "./components/CategoryNewsSection";
import { EditorsPicks } from "./components/EditorsPicks";
import { ExternalNewsSection } from "./components/ExternalNewsSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSlider } from "./components/HeroSlider";
import { LatestNews } from "./components/LatestNews";
import { LocalNewsSection } from "./components/LocalNewsSection";
import { NewsPostModal } from "./components/NewsPostModal";
import { SettingsModal } from "./components/SettingsModal";
import { WeatherSection } from "./components/WeatherSection";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { useGetAllArticles } from "./hooks/useQueries";

type NewsTabCategory = "national" | "online" | "international" | null;
type CategoryFilter = string | null;

function AppContent() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [activeNewsTab, setActiveNewsTab] = useState<NewsTabCategory>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>(null);

  const { data: allArticles, refetch: refetchArticles } = useGetAllArticles();

  const articles: Article[] = allArticles ?? [];

  // Sort by publishedAt descending for latest news
  const sortedArticles = [...articles].sort((a, b) => {
    if (b.publishedAt > a.publishedAt) return 1;
    if (b.publishedAt < a.publishedAt) return -1;
    return 0;
  });

  // Latest 6 articles for the main section
  const latestSix = sortedArticles.slice(0, 6);

  // All articles for category grouping
  const hasBackendArticles = allArticles !== undefined;

  // Handle nav category click — set tab/category filter and scroll to external news section
  function handleCategoryNav(
    tab: "national" | "online" | "international" | null,
    category?: string,
  ) {
    if (tab) {
      setActiveNewsTab(tab);
      setActiveCategoryFilter(null);
    } else if (category) {
      setActiveCategoryFilter(category);
      setActiveNewsTab(null);
    }
    setTimeout(() => {
      const el = document.getElementById("external-news-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }

  const mainContent = (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      {/* Breaking news ticker */}
      <BreakingNewsTicker />

      {/* Main content */}
      <main>
        {/* Hero + Editor's Picks section */}
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Hero Slider (70%) */}
            <div className="flex-1 min-w-0">
              <HeroSlider />
            </div>

            {/* Editor's Picks (30%) */}
            <div className="lg:w-[320px] shrink-0">
              <EditorsPicks />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
        </div>

        {/* Latest News section */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <LatestNews articles={hasBackendArticles ? latestSix : undefined} />
        </div>

        {/* Divider before local news */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
        </div>

        {/* Local News Section */}
        <div id="local-news" className="max-w-[1200px] mx-auto px-4 py-8">
          <LocalNewsSection />
        </div>

        {/* Category News sections (only shown when backend articles exist) */}
        {hasBackendArticles && articles.length > 0 && (
          <>
            {/* Divider */}
            <div className="max-w-[1200px] mx-auto px-4">
              <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
            </div>
            <div className="max-w-[1200px] mx-auto px-4 py-8">
              <CategoryNewsSection articles={articles} />
            </div>
          </>
        )}

        {/* Divider before weather */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
        </div>

        {/* Weather Section */}
        <div id="weather" className="max-w-[1200px] mx-auto px-4 py-8">
          <WeatherSection />
        </div>

        {/* Divider before external news */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
        </div>

        {/* External News Section - national & international headlines */}
        <div
          id="external-news-section"
          className="max-w-[1200px] mx-auto px-4 py-8"
        >
          <ExternalNewsSection
            initialTab={activeNewsTab}
            categoryFilter={activeCategoryFilter}
          />
        </div>
      </main>

      {/* About Section */}
      <div
        id="about-section"
        className="max-w-[1200px] mx-auto px-4 py-10"
        style={{ borderTop: "1px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-1 h-7 rounded-sm shrink-0"
            style={{ backgroundColor: "#dc2626" }}
          />
          <h2
            className="text-base font-bold uppercase tracking-widest"
            style={{ color: "#111827" }}
          >
            আমাদের সম্পর্কে
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "#374151" }}
            >
              <strong style={{ color: "#111827" }}>বালীগাঁও নিউজ</strong> বালিগাঁও,
              লাখাই, হবিগঞ্জ এবং হাওর অঞ্চলের স্থানীয় ও জাতীয় সংবাদের একটি বিশ্বস্ত ডিজিটাল
              মাধ্যম। আমরা স্থানীয় মানুষের কথা, তাদের সুখ-দুঃখ এবং সংগ্রামের গল্প প্রামাণিকভাবে
              তুলে ধরি।
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              জাতীয় ও আন্তর্জাতিক সংবাদের পাশাপাশি কৃষি, শিক্ষা, স্বাস্থ্য, খেলাধুলা এবং সংস্কৃতি
              বিষয়ক সংবাদ পরিবেশন করা আমাদের লক্ষ্য। তথ্যপ্রযুক্তির সাহায্যে স্থানীয় সংবাদকে
              ব্লকচেইনে স্থায়ীভাবে সংরক্ষণ করা আমাদের অনন্য বৈশিষ্ট্য।
            </p>
          </div>
          <div>
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#6b7280" }}
              >
                সম্পাদকীয় তথ্য
              </p>
              <p className="text-sm mb-1" style={{ color: "#374151" }}>
                <span style={{ color: "#6b7280" }}>সম্পাদক:</span>{" "}
                <strong style={{ color: "#111827" }}>এম.ডি ব্রাইট</strong>
              </p>
              <p className="text-sm mb-1" style={{ color: "#374151" }}>
                <span style={{ color: "#6b7280" }}>প্রকাশনা:</span>{" "}
                <strong style={{ color: "#111827" }}>বালিগাঁও, লাখাই, হবিগঞ্জ</strong>
              </p>
              <p className="text-sm" style={{ color: "#374151" }}>
                <span style={{ color: "#6b7280" }}>ইমেইল:</span>{" "}
                <a
                  href="mailto:baligawnews@gmail.com"
                  style={{ color: "#dc2626" }}
                >
                  baligawnews@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact-section"
        className="max-w-[1200px] mx-auto px-4 py-10"
        style={{ borderTop: "1px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-1 h-7 rounded-sm shrink-0"
            style={{ backgroundColor: "#dc2626" }}
          />
          <h2
            className="text-base font-bold uppercase tracking-widest"
            style={{ color: "#111827" }}
          >
            যোগাযোগ
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "#dc2626" }}
            >
              ইমেইল
            </p>
            <a
              href="mailto:baligawnews@gmail.com"
              className="text-sm font-medium"
              style={{ color: "#111827" }}
            >
              baligawnews@gmail.com
            </a>
          </div>
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "#6b7280" }}
            >
              ঠিকানা
            </p>
            <p className="text-sm font-medium" style={{ color: "#111827" }}>
              বালিগাঁও, লাখাই, হবিগঞ্জ
            </p>
          </div>
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "#6b7280" }}
            >
              সম্পাদক
            </p>
            <p className="text-sm font-medium" style={{ color: "#111827" }}>
              এম.ডি ব্রাইট
            </p>
          </div>
        </div>
        <p className="text-xs mt-6 text-center" style={{ color: "#9ca3af" }}>
          সংবাদ পাঠাতে বা বিজ্ঞাপনের জন্য উপরের ইমেইলে যোগাযোগ করুন।
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Sticky header — always full width */}
      <Header
        onPostClick={() => setShowPostModal(true)}
        onSettingsClick={() => setShowSettingsModal(true)}
        previewMode={previewMode}
        onPreviewChange={setPreviewMode}
        onCategoryNav={handleCategoryNav}
      />

      {/* Content area — wrapped in mobile frame if previewMode === 'mobile' */}
      {previewMode === "mobile" ? (
        <div
          style={{
            padding: "0",
            backgroundColor: "#d1d5db",
            minHeight: "100vh",
          }}
        >
          {/* Mobile frame label */}
          <div
            style={{
              textAlign: "center",
              padding: "10px 0 6px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#6b7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            📱 মোবাইল ভিউ
          </div>
          <div className="mobile-preview-frame">{mainContent}</div>
        </div>
      ) : (
        mainContent
      )}

      {/* News Post Modal */}
      <NewsPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSuccess={() => {
          setShowPostModal(false);
          refetchArticles();
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <AppContent />
    </SiteSettingsProvider>
  );
}
