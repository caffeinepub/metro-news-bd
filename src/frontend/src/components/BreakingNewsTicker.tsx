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
      className="w-full"
      style={{
        backgroundColor: "#111111",
        overflow: "visible",
      }}
      aria-label="ব্রেকিং নিউজ"
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "44px",
        }}
      >
        {/* Label — red box: compact height */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "0 10px",
            backgroundColor: "#cc0000",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            flexShrink: 0,
            whiteSpace: "nowrap",
            /* Fixed small height for red label */
            minHeight: "36px",
            maxHeight: "36px",
            alignSelf: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              animation: "pulse 1.5s infinite",
              flexShrink: 0,
            }}
          />
          🔴 ব্রেকিং নিউজ
        </div>

        {/* Vertical separator */}
        <div
          style={{
            width: "2px",
            backgroundColor: "#333333",
            flexShrink: 0,
          }}
        />

        {/* Scrolling content — black box.
            paddingTop/Bottom just enough so Bengali diacritics are fully visible. */}
        <div
          style={{
            flex: 1,
            overflowX: "hidden",
            overflowY: "visible",
            position: "relative",
            backgroundColor: "#111111",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <div
            className="ticker-animation"
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            {tickerContent.map((item, idx) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`ticker-${item.id}-${idx}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "1.8",
                }}
              >
                <span
                  style={{
                    margin: "0 28px",
                    color: "rgba(254,202,202,0.8)",
                    fontSize: "11px",
                  }}
                >
                  ◆
                </span>
                <span style={{ lineHeight: "1.8" }}>{item.text}</span>
                <span
                  style={{
                    color: "rgba(254,202,202,0.9)",
                    fontSize: "12px",
                    fontWeight: 400,
                    marginLeft: "4px",
                    lineHeight: "1.8",
                  }}
                >
                  ({item.time})
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
