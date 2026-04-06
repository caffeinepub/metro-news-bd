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

function AppContent() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

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
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <WeatherSection />
        </div>

        {/* Divider before external news */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
        </div>

        {/* External News Section - national & international headlines */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <ExternalNewsSection />
        </div>
      </main>

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
