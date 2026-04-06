import { ExternalLink, RefreshCw, X } from "lucide-react";
import { useCallback, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  publishedAt: string;
}

const ALL_NEWS: NewsItem[] = [
  // ── আন্তর্জাতিক খবর ──
  {
    id: 1,
    title: "ইরান-আমেরিকা উত্তেজনা: মধ্যপ্রাচ্যে সামরিক মহড়া তীব্র হচ্ছে",
    summary:
      "ইরান ও যুক্তরাষ্ট্রের মধ্যে কূটনৈতিক সম্পর্ক আরও খারাপ হচ্ছে। উভয় দেশই পারস্য উপসাগরীয় অঞ্চলে সামরিক উপস্থিতি বাড়াচ্ছে। বিশেষজ্ঞরা মনে করছেন পরিস্থিতি আরও উত্তপ্ত হওয়ার আশঙ্কা রয়েছে।",
    sourceUrl: "https://www.bbc.com/bengali",
    sourceName: "BBC বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "২ ঘন্টা আগে",
  },
  {
    id: 2,
    title: "ইরানে মার্কিন নিষেধাজ্ঞা: তেলের বাজারে অস্থিরতা",
    summary:
      "যুক্তরাষ্ট্র ইরানের উপর নতুন অর্থনৈতিক নিষেধাজ্ঞা জারি করেছে। এর ফলে আন্তর্জাতিক তেলের বাজারে দাম বৃদ্ধি পাচ্ছে এবং বিশ্ব অর্থনীতিতে প্রভাব পড়ার আশঙ্কা তৈরি হয়েছে।",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৪ ঘন্টা আগে",
  },
  {
    id: 3,
    title: "মধ্যপ্রাচ্য সংকট: জাতিসংঘের জরুরি বৈঠক আহ্বান",
    summary:
      "ইরান-আমেরিকা উত্তেজনার পরিপ্রেক্ষিতে জাতিসংঘ নিরাপত্তা পরিষদের জরুরি বৈঠক আহ্বান করা হয়েছে। বিশ্বনেতারা সংঘাত এড়াতে কূটনৈতিক সমাধান খুঁজছেন।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৬ ঘন্টা আগে",
  },
  {
    id: 4,
    title: "ভারত-পাকিস্তান সীমান্তে উত্তেজনা বৃদ্ধি",
    summary:
      "ভারত ও পাকিস্তানের মধ্যে নিয়ন্ত্রণ রেখায় সামরিক তৎপরতা বেড়েছে। উভয় দেশের কূটনৈতিক সম্পর্কে টানাপোড়েন চলছে।",
    sourceUrl: "https://www.bbc.com/bengali",
    sourceName: "BBC বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৮ ঘন্টা আগে",
  },
  {
    id: 5,
    title: "চীন ও তাইওয়ান উত্তেজনা: নতুন সামরিক মহড়া",
    summary:
      "চীন তাইওয়ান প্রণালীতে বড় সামরিক মহড়া পরিচালনা করেছে। তাইওয়ান ও যুক্তরাষ্ট্র উভয়ই এর তীব্র নিন্দা করেছে।",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "১০ ঘন্টা আগে",
  },
  {
    id: 6,
    title: "রাশিয়া-ইউক্রেন যুদ্ধ: নতুন শান্তি আলোচনার সম্ভাবনা",
    summary:
      "ইউরোপীয় মধ্যস্থতাকারীরা রাশিয়া ও ইউক্রেনের মধ্যে শান্তি আলোচনার উদ্যোগ নিচ্ছে। তবে উভয় পক্ষ এখনো কঠোর অবস্থানে রয়েছে।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "১২ ঘন্টা আগে",
  },
  // ── জাতীয় খবর ──
  {
    id: 7,
    title: "বাংলাদেশে নতুন বাজেট ঘোষণা: উন্নয়নে বরাদ্দ বৃদ্ধি",
    summary:
      "আগামী অর্থবছরের জন্য সরকার নতুন বাজেট প্রস্তাব পেশ করেছে। শিক্ষা, স্বাস্থ্য ও অবকাঠামো খাতে বরাদ্দ উল্লেখযোগ্যভাবে বৃদ্ধি পেয়েছে।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "জাতীয় খবর",
    publishedAt: "১ ঘন্টা আগে",
  },
  {
    id: 8,
    title: "ঢাকায় মেট্রোরেলের নতুন রুট চালু হচ্ছে",
    summary:
      "ঢাকা মেট্রোরেলের নতুন সম্প্রসারিত রুট শীঘ্রই চালু হবে। এতে রাজধানীর যানজট সমস্যা কমবে বলে আশা করা হচ্ছে।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "জাতীয় খবর",
    publishedAt: "৩ ঘন্টা আগে",
  },
  {
    id: 9,
    title: "পদ্মা সেতুতে যানবাহন চলাচল রেকর্ড উচ্চতায়",
    summary:
      "পদ্মা সেতুতে দৈনিক যানবাহন চলাচল নতুন রেকর্ড স্থাপন করেছে। দক্ষিণাঞ্চলের সাথে যোগাযোগ ব্যবস্থার ব্যাপক উন্নতি হয়েছে।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "জাতীয় খবর",
    publishedAt: "৫ ঘন্টা আগে",
  },
  {
    id: 10,
    title: "বাংলাদেশের রপ্তানি আয়ে নতুন মাইলফলক",
    summary:
      "চলতি অর্থবছরে বাংলাদেশের রপ্তানি আয় লক্ষ্যমাত্রা ছাড়িয়েছে। তৈরি পোশাক খাত এই সাফল্যে সবচেয়ে বেশি অবদান রেখেছে।",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
    category: "অর্থনৈতিক",
    publishedAt: "৭ ঘন্টা আগে",
  },
  // ── রাজনৈতিক ──
  {
    id: 11,
    title: "জাতীয় নির্বাচনের প্রস্তুতি: ইসি'র নতুন রোডম্যাপ প্রকাশ",
    summary:
      "নির্বাচন কমিশন আসন্ন জাতীয় নির্বাচনের জন্য বিস্তারিত রোডম্যাপ প্রকাশ করেছে। ভোটার তালিকা হালনাগাদ ও কেন্দ্র প্রস্তুতির কাজ শুরু হয়েছে।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "রাজনৈতিক",
    publishedAt: "২ ঘন্টা আগে",
  },
  {
    id: 12,
    title: "বিরোধীদলীয় নেতাদের বৈঠক: রাজনৈতিক সংলাপের আহ্বান",
    summary:
      "প্রধান বিরোধীদলগুলো জাতীয় রাজনৈতিক পরিস্থিতি নিয়ে যৌথ বৈঠক করেছে। সংলাপের মাধ্যমে রাজনৈতিক সংকট নিরসনের আহ্বান জানানো হয়েছে।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "রাজনৈতিক",
    publishedAt: "৪ ঘন্টা আগে",
  },
  // ── ক্রীড়া ──
  {
    id: 13,
    title: "বাংলাদেশ ক্রিকেট দল: এশিয়া কাপে দুর্দান্ত পারফরম্যান্স",
    summary:
      "বাংলাদেশ ক্রিকেট দল এশিয়া কাপে শক্তিশালী প্রতিপক্ষকে হারিয়ে সেমিফাইনালে জায়গা করে নিয়েছে। সাকিব আল হাসানের অল-রাউন্ড পারফরম্যান্স ছিল অনবদ্য।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "ক্রীড়া",
    publishedAt: "৩ ঘন্টা আগে",
  },
  {
    id: 14,
    title: "ফিফা বিশ্বকাপ বাছাই: বাংলাদেশের জয়",
    summary:
      "বিশ্বকাপ বাছাই পর্বে বাংলাদেশ ফুটবল দল গুরুত্বপূর্ণ জয় পেয়েছে। এই জয়ে পয়েন্ট তালিকায় দলের অবস্থান উন্নত হয়েছে।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "ক্রীড়া",
    publishedAt: "৬ ঘন্টা আগে",
  },
  // ── শিক্ষা ──
  {
    id: 15,
    title: "এসএসসি পরীক্ষার ফলাফল প্রকাশ: পাসের হার বৃদ্ধি",
    summary:
      "এ বছর এসএসসি পরীক্ষায় পাসের হার গত বছরের তুলনায় বেশি। মেয়েদের ফলাফল ছেলেদের তুলনায় ভালো ছিল।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "শিক্ষা",
    publishedAt: "২ ঘন্টা আগে",
  },
  {
    id: 16,
    title: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষা: নতুন পদ্ধতি চালু",
    summary:
      "বাংলাদেশের সরকারি বিশ্ববিদ্যালয়গুলোতে ভর্তি পরীক্ষার নতুন কেন্দ্রীয় পদ্ধতি চালু হচ্ছে। শিক্ষার্থীদের আবেদন প্রক্রিয়া আরও সহজ হবে।",
    sourceUrl: "https://bdnews24.com",
    sourceName: "BD News 24",
    category: "শিক্ষা",
    publishedAt: "৫ ঘন্টা আগে",
  },
  // ── স্বাস্থ্য ──
  {
    id: 17,
    title: "ডেঙ্গু পরিস্থিতি: সতর্কতা জারি, হাসপাতালে ভর্তি বাড়ছে",
    summary:
      "দেশে ডেঙ্গু জ্বরের প্রকোপ বেড়েছে। স্বাস্থ্য অধিদপ্তর জনগণকে সতর্ক থাকার পরামর্শ দিচ্ছে এবং মশা নিধনে বিশেষ অভিযান পরিচালিত হচ্ছে।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "স্বাস্থ্য",
    publishedAt: "৩ ঘন্টা আগে",
  },
  // ── কৃষি ──
  {
    id: 18,
    title: "বোরো ধানের বাম্পার ফলন: কৃষকদের মুখে হাসি",
    summary:
      "এ বছর সারাদেশে বোরো ধানের বাম্পার ফলন হয়েছে। আবহাওয়া অনুকূল থাকায় এবং সার-বীজ সরবরাহ ঠিকমতো হওয়ায় কৃষকরা ভালো ফলন পেয়েছেন।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "কৃষি",
    publishedAt: "৪ ঘন্টা আগে",
  },
];

// Extra news batches for rotation on Refresh
const REFRESH_BATCHES: NewsItem[][] = [
  [
    {
      id: 101,
      title: "ইরানের পারমাণবিক কর্মসূচি: আইএইএ'র নতুন প্রতিবেদন",
      summary:
        "আন্তর্জাতিক পরমাণু শক্তি সংস্থা ইরানের পারমাণবিক কর্মসূচির সর্বশেষ অগ্রগতি নিয়ে নতুন প্রতিবেদন প্রকাশ করেছে। এতে উদ্বেগজনক তথ্য রয়েছে বলে বিশেষজ্ঞরা মনে করছেন।",
      sourceUrl: "https://www.bbc.com/bengali",
      sourceName: "BBC বাংলা",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
    },
    {
      id: 102,
      title: "গাজায় যুদ্ধবিরতির আলোচনা: মধ্যস্থতাকারীরা আশাবাদী",
      summary:
        "কাতার ও মিসরের মধ্যস্থতায় ইসরায়েল ও হামাসের মধ্যে যুদ্ধবিরতির নতুন আলোচনা শুরু হয়েছে। উভয় পক্ষ কিছুটা নমনীয় অবস্থানে আসছে বলে জানা গেছে।",
      sourceUrl: "https://www.thedailystar.net",
      sourceName: "The Daily Star",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
    },
    {
      id: 103,
      title: "আমেরিকায় নতুন প্রশাসনের বৈদেশিক নীতি পরিবর্তন",
      summary:
        "মার্কিন যুক্তরাষ্ট্রের নতুন প্রশাসন মধ্যপ্রাচ্য নীতিতে বড় পরিবর্তন আনছে। ইরানের সাথে কূটনৈতিক চ্যানেল খোলার সম্ভাবনা নিয়ে আলোচনা চলছে।",
      sourceUrl: "https://bdnews24.com",
      sourceName: "BD News 24",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
    },
    {
      id: 104,
      title: "ডলারের বিপরীতে টাকার মূল্য স্থিতিশীল",
      summary:
        "বাংলাদেশ ব্যাংকের হস্তক্ষেপে বৈদেশিক মুদ্রা বাজারে কিছুটা স্থিতিশীলতা এসেছে। রিজার্ভ পরিস্থিতি ধীরে ধীরে উন্নতি হচ্ছে।",
      sourceUrl: "https://www.prothomalo.com",
      sourceName: "প্রথম আলো",
      category: "অর্থনৈতিক",
      publishedAt: "এইমাত্র",
    },
  ],
  [
    {
      id: 201,
      title: "ইরান-ইসরায়েল উত্তেজনা: আঞ্চলিক নিরাপত্তা হুমকিতে",
      summary:
        "ইরান ও ইসরায়েলের মধ্যে পারস্পরিক হুমকি-পাল্টা হুমকি চলছে। মধ্যপ্রাচ্যের আঞ্চলিক নিরাপত্তা পরিস্থিতি নাজুক হয়ে পড়েছে।",
      sourceUrl: "https://www.bbc.com/bengali",
      sourceName: "BBC বাংলা",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
    },
    {
      id: 202,
      title: "তেলের দাম বৃদ্ধি: বিশ্ব অর্থনীতিতে প্রভাব",
      summary:
        "মধ্যপ্রাচ্যে অস্থিতিশীলতার কারণে আন্তর্জাতিক বাজারে তেলের দাম ৫% বৃদ্ধি পেয়েছে। বিশ্বব্যাপী মূল্যস্ফীতির ঝুঁকি বাড়ছে।",
      sourceUrl: "https://www.thedailystar.net",
      sourceName: "The Daily Star",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
    },
    {
      id: 203,
      title: "বাংলাদেশে বিদেশি বিনিয়োগ বাড়ছে",
      summary:
        "চলতি বছরে বাংলাদেশে সরাসরি বিদেশি বিনিয়োগ উল্লেখযোগ্যভাবে বৃদ্ধি পেয়েছে। তৈরি পোশাক, আইটি ও অবকাঠামো খাতে বিনিয়োগ আসছে।",
      sourceUrl: "https://www.prothomalo.com",
      sourceName: "প্রথম আলো",
      category: "অর্থনৈতিক",
      publishedAt: "এইমাত্র",
    },
    {
      id: 204,
      title: "জলবায়ু পরিবর্তন: বাংলাদেশের উপকূলীয় এলাকায় বিপদ বাড়ছে",
      summary:
        "সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধির কারণে বাংলাদেশের উপকূলীয় জেলাগুলো হুমকিতে পড়েছে। জলবায়ু মোকাবেলায় জরুরি পদক্ষেপ নেওয়ার আহ্বান জানানো হয়েছে।",
      sourceUrl: "https://bdnews24.com",
      sourceName: "BD News 24",
      category: "জাতীয় খবর",
      publishedAt: "এইমাত্র",
    },
  ],
];

const CATEGORY_ORDER = [
  "আন্তর্জাতিক খবর",
  "রাজনৈতিক",
  "জাতীয় খবর",
  "অর্থনৈতিক",
  "ক্রীড়া",
  "শিক্ষা",
  "স্বাস্থ্য",
  "কৃষি",
];

const CATEGORY_IMAGES: Record<string, string> = {
  "আন্তর্জাতিক খবর": "/assets/generated/thumb-international.dim_300x200.jpg",
  রাজনৈতিক: "/assets/generated/thumb-politics.dim_300x200.jpg",
  "জাতীয় খবর": "/assets/generated/thumb-politics.dim_300x200.jpg",
  অর্থনৈতিক: "/assets/generated/thumb-business.dim_300x200.jpg",
  ক্রীড়া: "/assets/generated/thumb-sports.dim_300x200.jpg",
  শিক্ষা: "/assets/generated/thumb-education.dim_300x200.jpg",
  স্বাস্থ্য: "/assets/generated/thumb-health.dim_300x200.jpg",
  কৃষি: "/assets/generated/thumb-agriculture.dim_300x200.jpg",
};

function getCategoryImage(category: string): string {
  return (
    CATEGORY_IMAGES[category] ??
    "/assets/generated/thumb-international.dim_300x200.jpg"
  );
}

function groupByCategory(items: NewsItem[]): Map<string, NewsItem[]> {
  const map = new Map<string, NewsItem[]>();
  for (const item of items) {
    const existing = map.get(item.category) ?? [];
    map.set(item.category, [...existing, item]);
  }
  return map;
}

function getSortedCategories(map: Map<string, NewsItem[]>): string[] {
  const ordered: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    if (map.has(cat)) ordered.push(cat);
  }
  for (const cat of map.keys()) {
    if (!CATEGORY_ORDER.includes(cat)) ordered.push(cat);
  }
  return ordered;
}

interface NewsCardProps {
  item: NewsItem;
  onClick: (item: NewsItem) => void;
  index: number;
}

function NewsCard({ item, onClick, index }: NewsCardProps) {
  const thumbImg = getCategoryImage(item.category);
  return (
    <button
      type="button"
      data-ocid={`external_news.item.${index}`}
      className="relative flex flex-col gap-0 rounded-md cursor-pointer transition-all duration-200 border group w-full text-left overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
      onClick={() => onClick(item)}
      aria-label={`সংবাদ পড়ুন: ${item.title}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "140px" }}
      >
        <img
          src={thumbImg}
          alt={item.category}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)",
          }}
        />
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm max-w-[120px] truncate"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          title={item.sourceName}
        >
          {item.sourceName}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <h3
          className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:opacity-80 transition-opacity"
          style={{ minHeight: "2.5rem" }}
        >
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[11px]" style={{ color: "#6b6b6b" }}>
            {item.publishedAt}
          </p>
          <span
            className="text-[10px] font-semibold flex items-center gap-1"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          >
            <ExternalLink size={10} />
            বিস্তারিত
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
        style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
      />
    </button>
  );
}

interface NewsModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

function NewsModal({ item, onClose }: NewsModalProps) {
  if (!item) return null;
  const thumbImg = getCategoryImage(item.category);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
      data-ocid="external_news.modal"
      aria-modal="true"
      aria-labelledby="ext-news-modal-title"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-xl rounded-lg shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "180px" }}
        >
          <img
            src={thumbImg}
            alt={item.category}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 70%)",
            }}
          />
          <span
            className="absolute bottom-3 left-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-sm"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          >
            {item.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded text-white transition-colors"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            aria-label="বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="flex items-start px-5 pt-4 pb-3 gap-3"
          style={{ borderBottom: "1px solid #2d2d2d" }}
        >
          <div
            className="w-1 shrink-0 rounded-sm mt-1"
            style={{
              backgroundColor: "oklch(0.4764 0.2183 22.8)",
              minHeight: "1.25rem",
            }}
          />
          <h2
            id="ext-news-modal-title"
            className="text-base font-bold text-white leading-snug"
          >
            {item.title}
          </h2>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#6b6b6b" }}
            >
              সারসংক্ষেপ
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#c8c8c8" }}>
              {item.summary}
            </p>
          </div>

          <div
            className="flex items-center justify-between pt-3 border-t flex-wrap gap-3"
            style={{ borderColor: "#2d2d2d" }}
          >
            <div>
              <p className="text-xs" style={{ color: "#6b6b6b" }}>
                সূত্র:
                <span
                  className="font-semibold ml-1"
                  style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                >
                  {item.sourceName}
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                ক্যাটাগরি: {item.category} · {item.publishedAt}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs mt-1 block underline underline-offset-2 break-all"
                style={{ color: "#7ba7c7" }}
              >
                {item.sourceUrl}
              </a>
            </div>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="external_news.link"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 shrink-0"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            >
              <ExternalLink size={13} />
              সংবাদটি পড়ুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExternalNewsSection() {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("এইমাত্র");

  // Combine base news with refresh batch (rotated)
  const currentBatchIndex =
    (refreshCount - 1 + REFRESH_BATCHES.length) % REFRESH_BATCHES.length;
  const extraNews: NewsItem[] =
    refreshCount > 0 ? REFRESH_BATCHES[currentBatchIndex] : [];

  // Merge and deduplicate by id, extra news at the top
  const allCurrentNews = [
    ...extraNews,
    ...ALL_NEWS.filter((n) => !extraNews.find((e) => e.id === n.id)),
  ];

  const grouped = groupByCategory(allCurrentNews);
  const sortedCategories = getSortedCategories(grouped);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshCount((c) => c + 1);
      setLastRefreshed("এইমাত্র");
      setIsRefreshing(false);
    }, 1200);
  }, []);

  return (
    <section aria-labelledby="external-news-heading">
      {/* Section Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div
          className="w-1 h-7 rounded-sm shrink-0"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
        />
        <h2
          id="external-news-heading"
          className="text-base font-bold uppercase tracking-widest text-white shrink-0"
        >
          জাতীয় ও আন্তর্জাতিক সংবাদ
        </h2>
        <div
          className="flex-1 h-px min-w-[20px]"
          style={{ backgroundColor: "#2d2d2d" }}
        />
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs" style={{ color: "#6b6b6b" }}>
            শেষ আপডেট: <span style={{ color: "#9c9c9c" }}>{lastRefreshed}</span>
          </span>
          <button
            type="button"
            data-ocid="external_news.refresh.button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            aria-label="সংবাদ রিফ্রেশ করুন"
          >
            {isRefreshing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <div
          className="flex items-center justify-center gap-2 py-6 rounded mb-4"
          style={{ backgroundColor: "#141414" }}
        >
          <RefreshCw
            size={16}
            className="animate-spin"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          />
          <span className="text-sm" style={{ color: "#9c9c9c" }}>
            সংবাদ আপডেট হচ্ছে...
          </span>
        </div>
      )}

      {/* News by category */}
      {!isRefreshing && (
        <div className="flex flex-col gap-10">
          {sortedCategories.map((category) => {
            const items = grouped.get(category) ?? [];
            return (
              <section key={category} aria-labelledby={`ext-cat-${category}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-1 h-5 rounded-sm shrink-0"
                    style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                  />
                  <h3
                    id={`ext-cat-${category}`}
                    className="text-sm font-bold uppercase tracking-widest text-white shrink-0"
                  >
                    {category}
                  </h3>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#2d2d2d" }}
                  />
                  <span className="text-xs" style={{ color: "#6b6b6b" }}>
                    {items.length} টি সংবাদ
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, i) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      onClick={setSelectedItem}
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
