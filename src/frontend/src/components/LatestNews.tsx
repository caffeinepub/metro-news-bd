interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image: string;
}

const latestNews: NewsItem[] = [
  {
    id: 1,
    category: "প্রযুক্তি",
    title: "দেশে প্রথমবার ৫জি নেটওয়ার্ক চালু, গতি বেড়েছে দশগুণ",
    excerpt:
      "টেলিযোগাযোগ বিভাগ জানিয়েছে, এই বছরের মধ্যে সারা দেশে ৫জি কভারেজ নিশ্চিত করা হবে।",
    author: "কামরুল ইসলাম",
    time: "১ ঘন্টা আগে",
    image: "/assets/generated/thumb-tech.dim_300x200.jpg",
  },
  {
    id: 2,
    category: "অর্থনীতি",
    title: "দেশীয় শিল্পে বিনিয়োগ বৃদ্ধিতে নতুন প্রণোদনা প্যাকেজ ঘোষণা",
    excerpt: "সরকার ঘরোয়া বিনিয়োগ বাড়াতে বিশেষ কর ছাড় ও ঋণ সুবিধার ঘোষণা দিয়েছে।",
    author: "শাহানা পারভীন",
    time: "২ ঘন্টা আগে",
    image: "/assets/generated/thumb-business.dim_300x200.jpg",
  },
  {
    id: 3,
    category: "ত্রাণ",
    title: "বন্যা দুর্গত এলাকায় ত্রাণ বিতরণ অব্যাহত, উদ্ধার কার্যক্রম চলছে",
    excerpt: "সেনাবাহিনী ও স্বেচ্ছাসেবীরা বন্যাকবলিত অঞ্চলে সাহায্য পৌঁছে দিচ্ছেন।",
    author: "আশরাফ উদ্দিন",
    time: "৩ ঘন্টা আগে",
    image: "/assets/generated/thumb-flood.dim_300x200.jpg",
  },
  {
    id: 4,
    category: "খেলাধুলা",
    title: "জাতীয় ফুটবল লিগে নতুন দলের যোগদান, উত্তেজনা বাড়ছে সমর্থকদের মধ্যে",
    excerpt:
      "এবারের সিজনে তিনটি নতুন দল লিগে অংশ নিচ্ছে, যা প্রতিযোগিতাকে আরও তীব্র করে তুলবে।",
    author: "মিজানুর রহমান",
    time: "৪ ঘন্টা আগে",
    image: "/assets/generated/thumb-sports.dim_300x200.jpg",
  },
  {
    id: 5,
    category: "সংস্কৃতি",
    title: "আন্তর্জাতিক বইমেলায় বাংলাদেশ প্যাভিলিয়নে ব্যাপক সাড়া",
    excerpt:
      "ফ্রাঙ্কফুর্ট বইমেলায় বাংলাদেশের প্যাভিলিয়ন প্রশংসিত হয়েছে বিদেশি দর্শনার্থীদের কাছে।",
    author: "নিলুফার হোসেন",
    time: "৫ ঘন্টা আগে",
    image: "/assets/generated/thumb-culture.dim_300x200.jpg",
  },
  {
    id: 6,
    category: "শিক্ষা",
    title: "পাবলিক বিশ্ববিদ্যালয়ে গবেষণা তহবিল দ্বিগুণ করার সিদ্ধান্ত",
    excerpt:
      "বিশ্ববিদ্যালয় মঞ্জুরি কমিশন সারা দেশের পাবলিক বিশ্ববিদ্যালয়গুলোর গবেষণা বাজেট বাড়ানোর পরিকল্পনা ঘোষণা করেছে।",
    author: "হামিদ উল্লাহ",
    time: "৬ ঘন্টা আগে",
    image: "/assets/generated/thumb-education.dim_300x200.jpg",
  },
];

export function LatestNews() {
  return (
    <section aria-labelledby="latest-news-heading">
      {/* Section heading */}
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="latest-news-heading"
          className="text-base font-bold uppercase tracking-widest text-white shrink-0"
        >
          সর্বশেষ খবর
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: "#2d2d2d" }}>
          <div
            className="w-24 h-full"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestNews.map((item, i) => (
          <article
            key={item.id}
            data-ocid={`latest_news.item.${i + 1}`}
            className="flex gap-3 p-3 rounded cursor-pointer card-hover border"
            style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
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
              <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-news-red transition-colors">
                {item.title}
              </h3>
              <p
                className="text-xs mt-1 line-clamp-1"
                style={{ color: "#9c9c9c" }}
              >
                {item.excerpt}
              </p>
              <p className="text-[11px] mt-1.5" style={{ color: "#6b6b6b" }}>
                {item.author} · {item.time}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
