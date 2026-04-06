import { useState } from "react";
import { type NewsDetailItem, NewsDetailModal } from "./NewsDetailModal";

interface PickItem {
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

const picks: PickItem[] = [
  {
    id: 1,
    category: "শিক্ষা",
    title: "বিশ্ববিদ্যালয়ে ভর্তি পরীক্ষার নতুন নিয়মাবলি প্রকাশিত",
    excerpt:
      "বিশ্ববিদ্যালয় ভর্তি কমিটি এবার কেন্দ্রীয় পরীক্ষার পাশাপাশি বিষয়ভিত্তিক আলাদা পরীক্ষার ব্যবস্থা রাখছে। নতুন নিয়মে আবেদনকারীদের ন্যূনতম জিপিএ ৩.৫ থাকতে হবে। মেধা তালিকা প্রস্তুতে পূর্ববর্তী ফলাফলের পাশাপাশি ভর্তি পরীক্ষার নম্বর সমান গুরুত্ব পাবে।",
    author: "রেজওয়ান আলী",
    time: "৩ ঘন্টা আগে",
    image: "/assets/generated/thumb-education.dim_300x200.jpg",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
  },
  {
    id: 2,
    category: "খেলাধুলা",
    title: "বাংলাদেশ দল আইসিসি র‍্যাঙ্কিংয়ে নতুন শীর্ষে উঠে এসেছে",
    excerpt:
      "সর্বশেষ আইসিসি টি-টোয়েন্টি র‍্যাঙ্কিংয়ে বাংলাদেশ ৩ ধাপ এগিয়ে ৬ নম্বরে উঠে এসেছে। এ সাফল্যের পেছনে তরুণ ব্যাটারদের ধারাবাহিক পারফরম্যান্স এবং স্পিন বিভাগের দুর্দান্ত কার্যকারিতা অবদান রেখেছে।",
    author: "তানভীর ইসলাম",
    time: "৫ ঘন্টা আগে",
    image: "/assets/generated/thumb-sports.dim_300x200.jpg",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
  },
  {
    id: 3,
    category: "সংস্কৃতি",
    title: "ঐতিহ্যবাহী মেলায় লক্ষাধিক দর্শনার্থীর ঢল, উৎসবের আমেজ",
    excerpt:
      "তিন দিনব্যাপী এই মেলায় দেশের বিভিন্ন অঞ্চল থেকে ১ লাখেরও বেশি দর্শনার্থী এসেছেন। লোকসংগীত, হস্তশিল্প প্রদর্শনী ও ঐতিহ্যবাহী খাবারের স্টল মেলাকে বর্ণময় করে তুলেছে। আয়োজকরা জানিয়েছেন আগামী বছর মেলাটি আরও বড় পরিসরে আয়োজন করা হবে।",
    author: "নাসরিন চৌধুরী",
    time: "৭ ঘন্টা আগে",
    image: "/assets/generated/thumb-culture.dim_300x200.jpg",
    sourceUrl: "https://www.bbcbangla.com",
    sourceName: "BBC বাংলা",
  },
];

export function EditorsPicks() {
  const [selectedItem, setSelectedItem] = useState<NewsDetailItem | null>(null);

  return (
    <aside
      className="flex flex-col gap-4"
      style={{ borderLeft: "1px solid #e5e7eb", paddingLeft: "1.5rem" }}
    >
      {/* Heading */}
      <div className="flex items-center gap-3">
        <h2
          className="text-sm font-bold uppercase tracking-widest shrink-0"
          style={{ color: "#111827" }}
        >
          সম্পাদকের পছন্দ
        </h2>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
        />
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {picks.map((pick, i) => (
          <button
            type="button"
            key={pick.id}
            data-ocid={`editors_picks.item.${i + 1}`}
            className="flex gap-3 group cursor-pointer text-left w-full"
            onClick={() =>
              setSelectedItem({
                title: pick.title,
                summary: pick.excerpt,
                category: pick.category,
                author: pick.author,
                time: pick.time,
                image: pick.image,
                sourceUrl: pick.sourceUrl,
                sourceName: pick.sourceName,
              })
            }
          >
            {/* Thumbnail */}
            <div
              className="shrink-0 overflow-hidden rounded"
              style={{ width: "80px", height: "60px" }}
            >
              <img
                src={pick.image}
                alt={pick.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <span
                className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-1"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
              >
                {pick.category}
              </span>
              <h3
                className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-news-red transition-colors"
                style={{ color: "#111827" }}
              >
                {pick.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                {pick.author} · {pick.time}
              </p>
            </div>
          </button>
        ))}
      </div>

      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </aside>
  );
}
