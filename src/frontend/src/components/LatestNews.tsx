import { useState } from "react";
import type { Article } from "../backend";
import { type NewsDetailItem, NewsDetailModal } from "./NewsDetailModal";

interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image: string;
  sourceUrl: string;
  sourceName: string;
}

const staticLatestNews: NewsItem[] = [
  {
    id: 1,
    category: "প্রযুক্তি",
    title: "দেশে প্রথমবার ৫জি নেটওয়ার্ক চালু, গতি বেড়েছে দশগুণ",
    excerpt:
      "টেলিযোগাযোগ বিভাগ জানিয়েছে, এই বছরের মধ্যে সারা দেশে ৫জি কভারেজ নিশ্চিত করা হবে। ৫জি প্রযুক্তি চালু হলে ডাউনলোড গতি ১ গিগাবিট পর্যন্ত পৌঁছাবে, যা বর্তমান ৪জি-র তুলনায় দশ গুণ বেশি। শিল্প বিশেষজ্ঞরা বলছেন এটি দেশের ডিজিটাল রূপান্তরে মাইলফলক হয়ে উঠবে।",
    author: "কামরুল ইসলাম",
    time: "১ ঘন্টা আগে",
    image: "/assets/generated/thumb-tech.dim_300x200.jpg",
    sourceUrl: "https://www.bdnews24.com",
    sourceName: "BD News 24",
  },
  {
    id: 2,
    category: "অর্থনীতি",
    title: "দেশীয় শিল্পে বিনিয়োগ বৃদ্ধিতে নতুন প্রণোদনা প্যাকেজ ঘোষণা",
    excerpt:
      "সরকার ঘরোয়া বিনিয়োগ বাড়াতে বিশেষ কর ছাড় ও ঋণ সুবিধার ঘোষণা দিয়েছে। নতুন প্যাকেজের আওতায় ক্ষুদ্র ও মাঝারি উদ্যোক্তারা সহজ শর্তে ঋণ পাবেন এবং করমুক্ত সুবিধা ভোগ করবেন। অর্থনীতিবিদরা বলছেন এই পদক্ষেপ কর্মসংস্থান বৃদ্ধিতে সহায়ক হবে।",
    author: "শাহানা পারভীন",
    time: "২ ঘন্টা আগে",
    image: "/assets/generated/thumb-business.dim_300x200.jpg",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
  },
  {
    id: 3,
    category: "ত্রাণ",
    title: "বন্যা দুর্গত এলাকায় ত্রাণ বিতরণ অব্যাহত, উদ্ধার কার্যক্রম চলছে",
    excerpt:
      "সেনাবাহিনী ও স্বেচ্ছাসেবীরা বন্যাকবলিত অঞ্চলে সাহায্য পৌঁছে দিচ্ছেন। গত ৪৮ ঘণ্টায় ১০ হাজারেরও বেশি পরিবারকে নিরাপদ স্থানে সরিয়ে নেওয়া হয়েছে। খাদ্য, বিশুদ্ধ পানি ও চিকিৎসা সরবরাহ চলমান রয়েছে।",
    author: "আশরাফ উদ্দিন",
    time: "৩ ঘন্টা আগে",
    image: "/assets/generated/thumb-flood.dim_300x200.jpg",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
  },
  {
    id: 4,
    category: "খেলাধুলা",
    title: "জাতীয় ফুটবল লিগে নতুন দলের যোগদান, উত্তেজনা বাড়ছে সমর্থকদের মধ্যে",
    excerpt:
      "এবারের সিজনে তিনটি নতুন দল লিগে অংশ নিচ্ছে, যা প্রতিযোগিতাকে আরও তীব্র করে তুলবে। নতুন দলগুলোর মধ্যে রয়েছে ঢাকা সিটি এফসি, চট্টগ্রাম পোর্ট ও সিলেট স্টার। বাফুফে জানিয়েছে এ বছর দর্শক উপস্থিতি ৩০% বাড়বে বলে আশা করা হচ্ছে।",
    author: "মিজানুর রহমান",
    time: "৪ ঘন্টা আগে",
    image: "/assets/generated/thumb-sports.dim_300x200.jpg",
    sourceUrl: "https://www.bdnews24.com",
    sourceName: "BD News 24",
  },
  {
    id: 5,
    category: "সংস্কৃতি",
    title: "আন্তর্জাতিক বইমেলায় বাংলাদেশ প্যাভিলিয়নে ব্যাপক সাড়া",
    excerpt:
      "ফ্রাঙ্কফুর্ট বইমেলায় বাংলাদেশের প্যাভিলিয়ন প্রশংসিত হয়েছে বিদেশি দর্শনার্থীদের কাছে। ৫০টিরও বেশি বাংলাদেশি প্রকাশনা সংস্থা এতে অংশ নিয়েছে। বাংলা সাহিত্যের বেশ কয়েকটি বই ইংরেজিতে অনুবাদের আগ্রহ দেখিয়েছেন আন্তর্জাতিক প্রকাশকরা।",
    author: "নিলুফার হোসেন",
    time: "৫ ঘন্টা আগে",
    image: "/assets/generated/thumb-culture.dim_300x200.jpg",
    sourceUrl: "https://www.bbcbangla.com",
    sourceName: "BBC বাংলা",
  },
  {
    id: 6,
    category: "শিক্ষা",
    title: "পাবলিক বিশ্ববিদ্যালয়ে গবেষণা তহবিল দ্বিগুণ করার সিদ্ধান্ত",
    excerpt:
      "বিশ্ববিদ্যালয় মঞ্জুরি কমিশন সারা দেশের পাবলিক বিশ্ববিদ্যালয়গুলোর গবেষণা বাজেট বাড়ানোর পরিকল্পনা ঘোষণা করেছে। আগামী দুই বছরে এই তহবিল থেকে বিজ্ঞান, প্রকৌশল ও সামাজিক গবেষণায় ৫০০ কোটি টাকা বরাদ্দ করা হবে।",
    author: "হামিদ উল্লাহ",
    time: "৬ ঘন্টা আগে",
    image: "/assets/generated/thumb-education.dim_300x200.jpg",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
  },
];

function formatPublishedAt(publishedAt: bigint): string {
  try {
    const ms = Number(publishedAt / BigInt(1_000_000));
    const date = new Date(ms);
    const now = Date.now();
    const diff = now - ms;

    if (diff < 60_000) return "এইমাত্র";
    if (diff < 3_600_000) {
      const mins = Math.floor(diff / 60_000);
      return `${mins} মিনিট আগে`;
    }
    if (diff < 86_400_000) {
      const hours = Math.floor(diff / 3_600_000);
      return `${hours} ঘন্টা আগে`;
    }
    return date.toLocaleDateString("bn-BD");
  } catch {
    return "";
  }
}

interface LatestNewsProps {
  articles?: Article[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  const [selectedItem, setSelectedItem] = useState<NewsDetailItem | null>(null);
  const useBackendArticles = articles !== undefined;

  return (
    <section aria-labelledby="latest-news-heading">
      {/* Section heading */}
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="latest-news-heading"
          className="text-base font-bold uppercase tracking-widest shrink-0"
          style={{ color: "#111827" }}
        >
          সর্বশেষ খবর
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }}>
          <div
            className="w-24 h-full"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          />
        </div>
      </div>

      {/* Empty state when backend returns empty */}
      {useBackendArticles && articles.length === 0 ? (
        <div
          data-ocid="latest_news.empty_state"
          className="text-center py-16"
          style={{ color: "#6b7280" }}
        >
          <p className="text-sm">এখনো কোনো সংবাদ নেই</p>
          <p className="text-xs mt-1">সংবাদ পোস্ট করতে উপরের বোতাম ব্যবহার করুন</p>
        </div>
      ) : (
        /* News Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useBackendArticles
            ? articles.map((article, i) => (
                <button
                  type="button"
                  key={article.id.toString()}
                  data-ocid={`latest_news.item.${i + 1}`}
                  className="flex gap-3 p-3 rounded cursor-pointer card-hover border text-left w-full"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                  onClick={() =>
                    setSelectedItem({
                      title: article.title,
                      summary: article.summary,
                      category: article.category,
                      author: article.author,
                      time: formatPublishedAt(article.publishedAt),
                      image: article.imageUrl || undefined,
                    })
                  }
                >
                  {/* Thumbnail */}
                  <div
                    className="shrink-0 overflow-hidden rounded"
                    style={{ width: "90px", height: "70px" }}
                  >
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: "#f3f4f6" }}
                      >
                        <span
                          className="text-[10px] font-bold uppercase"
                          style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                        >
                          {article.category.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-1.5"
                      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                    >
                      {article.category}
                    </span>
                    <h3
                      className="text-sm font-semibold leading-snug line-clamp-2 hover:text-news-red transition-colors"
                      style={{
                        color: "#111827",
                        fontSize: "16px",
                        marginBottom: "6px",
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      className="text-xs mt-1 line-clamp-1"
                      style={{ color: "#6b7280" }}
                    >
                      {article.summary}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{
                        color: "#9ca3af",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {article.author} ·{" "}
                      {formatPublishedAt(article.publishedAt)}
                    </p>
                  </div>
                </button>
              ))
            : staticLatestNews.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  data-ocid={`latest_news.item.${i + 1}`}
                  className="flex gap-3 p-3 rounded cursor-pointer card-hover border text-left w-full"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                  onClick={() =>
                    setSelectedItem({
                      title: item.title,
                      summary: item.excerpt,
                      category: item.category,
                      author: item.author,
                      time: item.time,
                      image: item.image,
                      sourceUrl: item.sourceUrl,
                      sourceName: item.sourceName,
                    })
                  }
                >
                  {/* Thumbnail */}
                  <div
                    className="shrink-0 overflow-hidden rounded"
                    style={{ width: "90px", height: "70px" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-1.5"
                      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                    >
                      {item.category}
                    </span>
                    <h3
                      className="text-sm font-semibold leading-snug line-clamp-2 hover:text-news-red transition-colors"
                      style={{
                        color: "#111827",
                        fontSize: "16px",
                        marginBottom: "6px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs mt-1 line-clamp-1"
                      style={{ color: "#6b7280" }}
                    >
                      {item.excerpt}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{
                        color: "#9ca3af",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {item.author} · {item.time}
                    </p>
                  </div>
                </button>
              ))}
        </div>
      )}

      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
