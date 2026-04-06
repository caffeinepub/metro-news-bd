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
  {
    id: 6,
    text: "ইরান-আমেরিকা উত্তেজনায় পারস্য উপসাগরে মার্কিন রণতরী মোতায়েন",
    time: "৪ ঘন্টা আগে",
  },
  {
    id: 7,
    text: "বালীগাঁও এলাকায় নতুন সেচ প্রকল্প চালু হচ্ছে আগামী মাসে",
    time: "৫ ঘন্টা আগে",
  },
];

export function BreakingNewsTicker() {
  // Duplicate for seamless infinite scroll
  const tickerContent = [...breakingItems, ...breakingItems];

  return (
    <div
      className="w-full flex items-center overflow-hidden"
      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)", height: "44px" }}
      aria-label="ব্রেকিং নিউজ"
    >
      {/* Label */}
      <div
        className="flex items-center gap-2 px-4 text-white font-bold text-xs uppercase tracking-widest shrink-0 h-full"
        style={{
          backgroundColor: "oklch(0.34 0.2183 22.8)",
          minWidth: "max-content",
        }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        🔴 ব্রেকিং নিউজ
      </div>

      {/* Vertical separator */}
      <div
        className="shrink-0 h-full"
        style={{
          width: "2px",
          backgroundColor: "oklch(0.38 0.2183 22.8)",
        }}
      />

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-animation flex items-center">
          {tickerContent.map((item, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`ticker-${item.id}-${idx}`}
              className="inline-flex items-center gap-3 text-white text-sm font-semibold"
            >
              <span className="mx-8 text-red-200 opacity-70">◆</span>
              <span>{item.text}</span>
              <span className="text-red-200 opacity-80 text-xs font-normal ml-1">
                ({item.time})
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
