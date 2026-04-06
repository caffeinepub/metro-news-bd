interface BreakingNewsItem {
  id: number;
  text: string;
  time: string;
}

const breakingItems: BreakingNewsItem[] = [
  {
    id: 1,
    text: "ঢাকায় ভারী বৃষ্টিপাতের কারণে যানজট তীব্র আকার ধারণ করেছে",
    time: "১৫ মিনিট আগে",
  },
  {
    id: 2,
    text: "জাতীয় সংসদে নতুন বাজেট প্রস্তাব উপস্থাপিত হয়েছে",
    time: "৩২ মিনিট আগে",
  },
  {
    id: 3,
    text: "বাংলাদেশ ক্রিকেট দল পাকিস্তানের বিরুদ্ধে ঐতিহাসিক জয় অর্জন করেছে",
    time: "১ ঘন্টা আগে",
  },
  {
    id: 4,
    text: "পদ্মা সেতুতে নতুন টোল হার নির্ধারণ করা হয়েছে",
    time: "২ ঘন্টা আগে",
  },
  {
    id: 5,
    text: "দেশের তৈরি পোশাক শিল্পে রফতানি আয় বৃদ্ধি পেয়েছে",
    time: "৩ ঘন্টা আগে",
  },
];

export function BreakingNewsTicker() {
  const tickerContent = [...breakingItems, ...breakingItems];

  return (
    <div
      className="w-full flex items-center overflow-hidden"
      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)", height: "38px" }}
      aria-label="ব্রেকিং নিউজ"
    >
      {/* Label */}
      <div
        className="flex items-center gap-2 px-4 text-white font-bold text-xs uppercase tracking-widest shrink-0 h-full border-r"
        style={{
          backgroundColor: "oklch(0.38 0.2183 22.8)",
          borderColor: "oklch(0.38 0.2183 22.8)",
        }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>ব্রেকিং</span>
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-animation flex items-center gap-0">
          {tickerContent.map((item, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`ticker-${item.id}-${idx}`}
              className="inline-flex items-center gap-3 text-white text-sm font-medium"
            >
              <span className="mx-6 text-red-200 opacity-60">●</span>
              <span>{item.text}</span>
              <span className="text-red-200 opacity-80 text-xs">
                ({item.time})
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
