interface PickItem {
  id: number;
  category: string;
  title: string;
  author: string;
  time: string;
  image: string;
}

const picks: PickItem[] = [
  {
    id: 1,
    category: "শিক্ষা",
    title: "বিশ্ববিদ্যালয়ে ভর্তি পরীক্ষার নতুন নিয়মাবলি প্রকাশিত",
    author: "রেজওয়ান আলী",
    time: "৩ ঘন্টা আগে",
    image: "/assets/generated/thumb-education.dim_300x200.jpg",
  },
  {
    id: 2,
    category: "খেলাধুলা",
    title: "বাংলাদেশ দল আইসিসি র‍্যাঙ্কিংয়ে নতুন শীর্ষে উঠে এসেছে",
    author: "তানভীর ইসলাম",
    time: "৫ ঘন্টা আগে",
    image: "/assets/generated/thumb-sports.dim_300x200.jpg",
  },
  {
    id: 3,
    category: "সংস্কৃতি",
    title: "ঐতিহ্যবাহী মেলায় লক্ষাধিক দর্শনার্থীর ঢল, উৎসবের আমেজ",
    author: "নাসরিন চৌধুরী",
    time: "৭ ঘন্টা আগে",
    image: "/assets/generated/thumb-culture.dim_300x200.jpg",
  },
];

export function EditorsPicks() {
  return (
    <aside
      className="flex flex-col gap-4"
      style={{ borderLeft: "1px solid #2d2d2d", paddingLeft: "1.5rem" }}
    >
      {/* Heading */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
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
          <article
            key={pick.id}
            data-ocid={`editors_picks.item.${i + 1}`}
            className="flex gap-3 group cursor-pointer"
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
              <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-news-red transition-colors">
                {pick.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: "#9c9c9c" }}>
                {pick.author} · {pick.time}
              </p>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
