import type { Article } from "../backend";

interface CategoryNewsSectionProps {
  articles: Article[];
}

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

function groupByCategory(articles: Article[]): Map<string, Article[]> {
  const map = new Map<string, Article[]>();
  for (const article of articles) {
    const existing = map.get(article.category) ?? [];
    map.set(article.category, [...existing, article]);
  }
  // Sort articles within each category by publishedAt descending
  for (const [cat, arts] of map.entries()) {
    map.set(
      cat,
      [...arts].sort((a, b) => {
        if (b.publishedAt > a.publishedAt) return 1;
        if (b.publishedAt < a.publishedAt) return -1;
        return 0;
      }),
    );
  }
  return map;
}

export function CategoryNewsSection({ articles }: CategoryNewsSectionProps) {
  if (!articles || articles.length === 0) return null;

  const grouped = groupByCategory(articles);
  const sortedCategories = Array.from(grouped.keys()).sort((a, b) =>
    a.localeCompare(b, "bn"),
  );

  return (
    <div className="flex flex-col gap-10">
      {sortedCategories.map((category) => {
        const catArticles = grouped.get(category) ?? [];
        return (
          <section key={category} aria-labelledby={`cat-heading-${category}`}>
            {/* Category heading */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-1 h-6 rounded-sm shrink-0"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
              />
              <h2
                id={`cat-heading-${category}`}
                className="text-base font-bold uppercase tracking-widest text-white shrink-0"
              >
                {category}
              </h2>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "#2d2d2d" }}
              />
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catArticles.map((article, i) => (
                <article
                  key={article.id.toString()}
                  data-ocid={`category_news.item.${i + 1}`}
                  className="flex gap-3 p-3 rounded cursor-pointer card-hover border"
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
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
                        style={{ backgroundColor: "#2d2d2d" }}
                      >
                        <span
                          className="text-xs font-bold uppercase"
                          style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                        >
                          {category.charAt(0)}
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
                    <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-news-red transition-colors">
                      {article.title}
                    </h3>
                    <p
                      className="text-xs mt-1 line-clamp-1"
                      style={{ color: "#9c9c9c" }}
                    >
                      {article.summary}
                    </p>
                    <p
                      className="text-[11px] mt-1.5"
                      style={{ color: "#6b6b6b" }}
                    >
                      {article.author} ·{" "}
                      {formatPublishedAt(article.publishedAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
