import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type NewsDetailItem, NewsDetailModal } from "./NewsDetailModal";

interface SlideItem {
  id: number;
  category: string;
  headline: string;
  excerpt: string;
  author: string;
  time: string;
  image: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    category: "স্থানীয়",
    headline: "রাজধানীর যানজট নিরসনে নতুন মেট্রোরেল লাইন চালু হচ্ছে আগামী মাসে",
    excerpt:
      "ঢাকা মেট্রোপলিটান কর্তৃপক্ষ জানিয়েছে, নতুন মেট্রোরেল লাইন চালু হলে প্রতিদিন প্রায় পাঁচ লক্ষ যাত্রী পরিবহন করা সম্ভব হবে। এই লাইনটি উত্তরা থেকে গাজীপুর পর্যন্ত বিস্তৃত হবে এবং ২০টি স্টেশন থাকবে। প্রকল্পটি বাস্তবায়নে ব্যয় হবে ১২ হাজার কোটি টাকা।",
    author: "আহমেদ রহমান",
    time: "২ ঘন্টা আগে",
    image: "/assets/generated/hero-city-news.dim_800x450.jpg",
  },
  {
    id: 2,
    category: "রাজনীতি",
    headline: "জাতীয় সংসদের বিশেষ অধিবেশনে নতুন আর্থিক নীতিমালা অনুমোদন",
    excerpt:
      "আজ জাতীয় সংসদের বিশেষ অধিবেশনে দেশের অর্থনৈতিক উন্নয়নে একটি যুগান্তকারী আর্থিক নীতিমালা সর্বসম্মতিক্রমে পাস হয়েছে। নতুন নীতিমালায় রাজস্ব বিভাজন, বিনিয়োগ প্রণোদনা এবং বৈদেশিক ঋণ ব্যবস্থাপনার বিষয়ে সুনির্দিষ্ট নির্দেশনা অন্তর্ভুক্ত করা হয়েছে।",
    author: "ফারহান হোসেন",
    time: "৪ ঘন্টা আগে",
    image: "/assets/generated/hero-politics.dim_800x450.jpg",
  },
  {
    id: 3,
    category: "অর্থনীতি",
    headline: "দেশের কৃষিপণ্য রফতানিতে নতুন রেকর্ড, আয় বেড়েছে ৩০ শতাংশ",
    excerpt:
      "চলতি অর্থবছরে বাংলাদেশের কৃষিপণ্য রফতানি গত বছরের তুলনায় ৩০ শতাংশ বৃদ্ধি পেয়ে নতুন মাইলফলক স্পর্শ করেছে। মাছ, সবজি ও পাট পণ্য রফতানিতে সবচেয়ে বেশি প্রবৃদ্ধি হয়েছে। বাণিজ্য মন্ত্রণালয় জানিয়েছে আগামী বছর এই লক্ষ্যমাত্রা আরও বাড়ানো হবে।",
    author: "সুমাইয়া বেগম",
    time: "৬ ঘন্টা আগে",
    image: "/assets/generated/hero-market.dim_800x450.jpg",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewsDetailItem | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const openModal = () => {
    setSelectedItem({
      title: slide.headline,
      summary: slide.excerpt,
      category: slide.category,
      author: slide.author,
      time: slide.time,
      image: slide.image,
    });
  };

  return (
    <>
      <section
        className="relative w-full overflow-hidden rounded"
        style={{ backgroundColor: "#111111" }}
        aria-label="শীর্ষ খবর স্লাইডার"
      >
        {/* Slide */}
        <div className="relative" style={{ aspectRatio: "16/7" }}>
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.headline}
            className="absolute inset-0 w-full h-full object-cover hero-slide-animate"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="p-6 md:p-10 max-w-[600px]">
              <span
                className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-white mb-3"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
              >
                {slide.category}
              </span>
              <button
                type="button"
                className="block text-left text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={openModal}
              >
                {slide.headline}
              </button>
              <p className="text-sm md:text-base text-gray-300 mb-4 leading-relaxed hidden sm:block">
                {slide.excerpt}
              </p>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-medium"
                  style={{ color: "#9c9c9c" }}
                >
                  {slide.author}
                </span>
                <span style={{ color: "#2d2d2d" }}>•</span>
                <span className="text-xs" style={{ color: "#9c9c9c" }}>
                  {slide.time}
                </span>
              </div>
              <button
                type="button"
                data-ocid="hero.read_full.button"
                className="inline-flex items-center px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                onClick={openModal}
              >
                বিস্তারিত পড়ুন
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button
          type="button"
          data-ocid="hero.slider.pagination_prev"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-opacity hover:opacity-80 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-label="আগের স্লাইড"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          data-ocid="hero.slider.pagination_next"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-opacity hover:opacity-80 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-label="পরের স্লাইড"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              data-ocid={`hero.dot.${i + 1}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? "20px" : "8px",
                height: "8px",
                backgroundColor:
                  i === current
                    ? "oklch(0.4764 0.2183 22.8)"
                    : "rgba(255,255,255,0.4)",
              }}
              aria-label={`স্লাইড ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
