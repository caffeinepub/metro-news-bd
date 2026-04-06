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
import { NewsPostModal } from "./components/NewsPostModal";
import { useGetAllArticles } from "./hooks/useQueries";

export default function App() {
  const [showPostModal, setShowPostModal] = useState(false);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b0b" }}>
      {/* Sticky header */}
      <Header onPostClick={() => setShowPostModal(true)} />

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
          <div className="h-px" style={{ backgroundColor: "#2d2d2d" }} />
        </div>

        {/* Latest News section */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <LatestNews articles={hasBackendArticles ? latestSix : undefined} />
        </div>

        {/* Category News sections (only shown when backend articles exist) */}
        {hasBackendArticles && articles.length > 0 && (
          <>
            {/* Divider */}
            <div className="max-w-[1200px] mx-auto px-4">
              <div className="h-px" style={{ backgroundColor: "#2d2d2d" }} />
            </div>
            <div className="max-w-[1200px] mx-auto px-4 py-8">
              <CategoryNewsSection articles={articles} />
            </div>
          </>
        )}

        {/* Divider before external news */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#2d2d2d" }} />
        </div>

        {/* External News Section - national & international headlines */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <ExternalNewsSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* News Post Modal */}
      <NewsPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSuccess={() => {
          setShowPostModal(false);
          refetchArticles();
        }}
      />
    </div>
  );
}
