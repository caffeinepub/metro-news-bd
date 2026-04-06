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
        backgroundColor: "oklch(0.4764 0.2183 22.8)",
        /*
         * Generous vertical padding so Bengali vowel marks (মাত্রা/স্বরচিহ্ন)
         * that extend above the cap-height are never cropped.
         */
        paddingTop: "14px",
        paddingBottom: "14px",
        /*
         * overflow: clip on the OUTER shell hides horizontal overflow without
         * creating a scroll container and — crucially — does NOT force the
         * perpendicular axis (overflow-y) to become "auto"/"hidden".
         * This is the key difference vs overflow:hidden which forces both axes.
         */
        overflow: "clip",
      }}
      aria-label="ব্রেকিং নিউজ"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          /*
           * minHeight must accommodate: line-height × font-size + vertical padding
           * Bengali diacritics add ~0.3em above the cap height, so lineHeight:2
           * on 14px text ≈ 28px; 12px×2 = 24px for the label.
           * 56px is a safe lower bound.
           */
          minHeight: "64px",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            backgroundColor: "oklch(0.34 0.2183 22.8)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: "2",
            flexShrink: 0,
            whiteSpace: "nowrap",
            /* Never clip this label's own text either */
            overflow: "visible",
            alignSelf: "stretch",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
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
            alignSelf: "stretch",
            backgroundColor: "oklch(0.38 0.2183 22.8)",
            flexShrink: 0,
          }}
        />

        {/*
          Scrolling content wrapper.

          KEY FIX:
          We removed clipPath: "inset(0 0 0 0)" which was clipping ALL four
          sides — including the top — and cutting off Bengali vowel marks.

          The outer shell already uses `overflow: clip` which handles
          horizontal containment. This inner div just needs `overflow: visible`
          so Bengali diacritics that sit above the normal line-box are not cut.

          Extra paddingTop/paddingBottom give the diacritics room even when the
          parent's overflow:clip edge coincides with the content boundary.
        */}
        <div
          style={{
            flex: 1,
            /* MUST be visible — no clip here — parent already clips x-axis */
            overflow: "visible",
            position: "relative",
            /* Room for Bengali vowel marks above the cap-height */
            paddingTop: "6px",
            paddingBottom: "6px",
          }}
        >
          <div
            className="ticker-animation"
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              /* Also visible here — clipping is handled by the outermost shell */
              overflow: "visible",
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
                  fontSize: "12px",
                  fontWeight: 600,
                  /*
                   * lineHeight:2 gives Bengali vowel marks (মাত্রা) plenty of
                   * vertical space. Without this, ascenders get clipped even
                   * when overflow is visible because the line-box itself is tight.
                   */
                  lineHeight: "2",
                }}
              >
                <span
                  style={{
                    margin: "0 32px",
                    color: "rgba(254,202,202,0.8)",
                    fontSize: "12px",
                    lineHeight: "2",
                  }}
                >
                  ◆
                </span>
                <span style={{ lineHeight: "2" }}>{item.text}</span>
                <span
                  style={{
                    color: "rgba(254,202,202,0.9)",
                    fontSize: "12px",
                    fontWeight: 400,
                    marginLeft: "4px",
                    lineHeight: "2",
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
