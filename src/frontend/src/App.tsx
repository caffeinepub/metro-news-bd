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

      {/* Advertise Section */}
      <div
        id="advertise-section"
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
            বিজ্ঞাপন দিন
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "#374151" }}
            >
              <strong style={{ color: "#111827" }}>বালীগাঁও নিউজ</strong>-এ বিজ্ঞাপন
              দিয়ে বালিগাঁও, লাখাই, হবিগঞ্জ ও হাওর অঞ্চলের হাজার হাজার পাঠকের কাছে পৌঁছান। আমাদের
              পাঠকগোষ্ঠী মূলত স্থানীয় ব্যবসায়ী, কৃষক, শিক্ষার্থী ও সচেতন নাগরিক।
            </p>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#374151" }}
            >
              আপনার পণ্য, সেবা বা প্রতিষ্ঠানের প্রচারে আমাদের ডিজিটাল প্ল্যাটফর্ম ব্যবহার করুন।
              বিজ্ঞাপনের জন্য আজই আমাদের সাথে যোগাযোগ করুন এবং সাশ্রয়ী মূল্যে কার্যকর প্রচারণা
              নিশ্চিত করুন।
            </p>
            <a
              href="mailto:baligawnews@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
              }}
            >
              বিজ্ঞাপনের জন্য যোগাযোগ করুন
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "#6b7280" }}
              >
                বিজ্ঞাপনের ধরন ও মূল্য তালিকা
              </p>
              <div className="flex flex-col gap-2">
                <div
                  className="flex justify-between items-center py-1"
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <span className="text-sm" style={{ color: "#374151" }}>
                    ব্যানার বিজ্ঞাপন (টপ)
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#111827" }}
                  >
                    যোগাযোগ সাপেক্ষ
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-1"
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <span className="text-sm" style={{ color: "#374151" }}>
                    সাইডবার বিজ্ঞাপন
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#111827" }}
                  >
                    যোগাযোগ সাপেক্ষ
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-1"
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <span className="text-sm" style={{ color: "#374151" }}>
                    স্পন্সরড সংবাদ
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#111827" }}
                  >
                    যোগাযোগ সাপেক্ষ
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm" style={{ color: "#374151" }}>
                    ই-কমার্স প্রমোশন
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#111827" }}
                  >
                    যোগাযোগ সাপেক্ষ
                  </span>
                </div>
              </div>
            </div>
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <p className="text-xs" style={{ color: "#dc2626" }}>
                <strong>ইমেইল:</strong>{" "}
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

      {/* Privacy Policy Section */}
      <div
        id="privacy-section"
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
            গোপনীয়তা নীতি
          </h2>
        </div>
        <div className="max-w-3xl flex flex-col gap-4">
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>তথ্য সংগ্রহ:</strong> বালীগাঁও নিউজ
            ওয়েবসাইট পরিদর্শনের সময় আমরা আপনার ডিভাইসের ধরন, ব্রাউজার তথ্য এবং পেজ
            ভিজিটের তথ্য স্বয়ংক্রিয়ভাবে সংগ্রহ করতে পারি। এই তথ্য শুধুমাত্র ওয়েবসাইটের মান
            উন্নয়নের জন্য ব্যবহার করা হয়। আপনি যদি স্থানীয় সংবাদ পাঠানোর জন্য নিবন্ধন করেন,
            তাহলে আপনার প্রদত্ত নাম ও যোগাযোগ তথ্য সংরক্ষণ করা হতে পারে।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>তথ্যের ব্যবহার:</strong> আমরা আপনার
            ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা হস্তান্তর করি না। সংগৃহীত তথ্য শুধুমাত্র
            সাইটের পরিষেবা উন্নত করতে এবং পাঠকদের সাথে যোগাযোগের জন্য ব্যবহার করা হয়। আইনি
            প্রয়োজনে বা নিরাপত্তার স্বার্থে তথ্য ভাগ করা হতে পারে।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>কুকিজ ও ট্র্যাকিং:</strong> আমাদের
            ওয়েবসাইট কুকিজ ব্যবহার করতে পারে যা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করে। আপনি
            ব্রাউজার সেটিংসের মাধ্যমে কুকিজ নিয়ন্ত্রণ করতে পারেন। তৃতীয় পক্ষের বিজ্ঞাপনদাতারা
            তাদের নিজস্ব কুকিজ ব্যবহার করতে পারে, যা তাদের গোপনীয়তা নীতির অধীনে পরিচালিত
            হয়।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>আপনার অধিকার:</strong> আপনার
            ব্যক্তিগত তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে আমাদের ইমেইলে যোগাযোগ করুন:{" "}
            <a href="mailto:baligawnews@gmail.com" style={{ color: "#dc2626" }}>
              baligawnews@gmail.com
            </a>
            । এই গোপনীয়তা নীতি সময়ে সময়ে আপডেট করা হতে পারে। পরিবর্তনের ক্ষেত্রে
            ওয়েবসাইটে নোটিশ দেওয়া হবে।
          </p>
        </div>
      </div>

      {/* Terms of Use Section */}
      <div
        id="terms-section"
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
            শর্তাবলী
          </h2>
        </div>
        <div className="max-w-3xl flex flex-col gap-4">
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>ব্যবহারের শর্ত:</strong> বালীগাঁও
            নিউজ ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলীর সাথে সম্মত হচ্ছেন। এই সাইটের
            কন্টেন্ট শুধুমাত্র তথ্যমূলক উদ্দেশ্যে প্রকাশিত। আমরা যেকোনো সময় সাইটের কন্টেন্ট বা
            পরিষেবা পরিবর্তন করার অধিকার রাখি।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>কন্টেন্টের মালিকানা:</strong> এই
            ওয়েবসাইটে প্রকাশিত সকল মৌলিক সংবাদ, নিবন্ধ ও মিডিয়া কন্টেন্টের স্বত্বাধিকার
            বালীগাঁও নিউজ-এর। লেখকের অনুমতি ছাড়া কোনো কন্টেন্ট পুনঃপ্রকাশ বা বাণিজ্যিক উদ্দেশ্যে
            ব্যবহার করা সম্পূর্ণ নিষিদ্ধ। ব্যক্তিগত ও অশুল্ক ব্যবহারে সূত্র উল্লেখপূর্বক শেয়ার করা
            যাবে।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>ব্যবহারকারীর দায়িত্ব:</strong> পাঠকরা
            যদি মন্তব্য বা সংবাদ পাঠান, তবে সেই কন্টেন্ট মিথ্যা, ভুয়া বা ক্ষতিকর হলে সম্পূর্ণ দায়
            পাঠকের নিজের। ঘৃণামূলক, অশ্লীল বা আইনবিরোধী কোনো কন্টেন্ট জমা দেওয়া সম্পূর্ণ
            নিষিদ্ধ। নিয়ম লঙ্ঘনে আমরা অ্যাকাউন্ট নিষ্ক্রিয় করার অধিকার রাখি।
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>দায়মুক্তি বিবৃতি:</strong> বালীগাঁও
            নিউজ সর্বদা সত্য ও নির্ভরযোগ্য তথ্য প্রকাশের চেষ্টা করে, তবে কোনো ত্রুটি বা তথ্যগত
            অসঙ্গতির জন্য আমরা আইনগতভাবে দায়ী নই। তৃতীয় পক্ষের লিংক বা উৎস থেকে পাওয়া
            তথ্যের জন্য আমরা দায়িত্ব নিই না। সন্দেহজনক বিষয় জানাতে আমাদের ইমেইল করুন:{" "}
            <a href="mailto:baligawnews@gmail.com" style={{ color: "#dc2626" }}>
              baligawnews@gmail.com
            </a>
          </p>
        </div>
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
