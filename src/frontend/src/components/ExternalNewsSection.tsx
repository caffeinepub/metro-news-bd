import { ExternalLink, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type SourceGroup = "national" | "online" | "international";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  publishedAt: string;
  sourceGroup: SourceGroup;
}

const ALL_NEWS: NewsItem[] = [
  // ─────────────────────────────────────────────────────────────
  // জাতীয় পত্রিকা — national
  // ─────────────────────────────────────────────────────────────

  // প্রথম আলো
  {
    id: 1,
    title: "বাংলাদেশে নতুন বাজেট ঘোষণা: উন্নয়নে বরাদ্দ বৃদ্ধি",
    summary:
      "আগামী অর্থবছরের জন্য সরকার জাতীয় সংসদে নতুন বাজেট প্রস্তাব পেশ করেছে। শিক্ষা, স্বাস্থ্য ও অবকাঠামো খাতে বরাদ্দ আগের বছরের তুলনায় উল্লেখযোগ্যভাবে বৃদ্ধি পেয়েছে। অর্থনীতিবিদরা বলছেন এই বরাদ্দ দেশের দীর্ঘমেয়াদি উন্নয়নে ইতিবাচক ভূমিকা রাখবে। সামাজিক সুরক্ষা কার্যক্রমেও বিশেষ মনোযোগ দেওয়া হয়েছে।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "জাতীয় খবর",
    publishedAt: "১ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 2,
    title: "এসএসসি পরীক্ষার ফলাফল প্রকাশ: পাসের হার বৃদ্ধি",
    summary:
      "এ বছর মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষায় সার্বিক পাসের হার গত বছরের তুলনায় প্রায় ৩ শতাংশ বেশি। মেয়েদের পাসের হার ছেলেদের চেয়ে সামান্য এগিয়ে রয়েছে। চট্টগ্রাম ও রাজশাহী বোর্ড সর্বোচ্চ ফলাফল অর্জন করেছে। শিক্ষামন্ত্রী ফলাফলকে আশাব্যঞ্জক বলে অভিহিত করেছেন।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "শিক্ষা",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 3,
    title: "বোরো ধানের বাম্পার ফলন: কৃষকদের মুখে হাসি",
    summary:
      "এ বছর সারাদেশে বোরো ধানের বাম্পার ফলন হয়েছে। অনুকূল আবহাওয়া এবং সময়মতো সার-বীজ সরবরাহের কারণে কৃষকরা আশাতীত ফলন পেয়েছেন। কৃষি মন্ত্রণালয়ের তথ্যমতে, এ বছর মোট উৎপাদন লক্ষ্যমাত্রা ছাড়িয়ে গেছে। হাওর অঞ্চলের কৃষকরাও এবার সুফল পেয়েছেন।",
    sourceUrl: "https://www.prothomalo.com",
    sourceName: "প্রথম আলো",
    category: "কৃষি",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // বাংলাদেশ প্রতিদিন
  {
    id: 4,
    title: "জাতীয় নির্বাচনের প্রস্তুতি: ইসি'র নতুন রোডম্যাপ প্রকাশ",
    summary:
      "নির্বাচন কমিশন আসন্ন জাতীয় সংসদ নির্বাচনের জন্য বিস্তারিত রোডম্যাপ প্রকাশ করেছে। ভোটার তালিকা হালনাগাদ, কেন্দ্র নির্ধারণ ও প্রার্থিতার বিধিমালা নিয়ে দিকনির্দেশনা দেওয়া হয়েছে। রাজনৈতিক দলগুলো এই রোডম্যাপকে স্বাগত জানিয়েছে। সুষ্ঠু ও নিরপেক্ষ নির্বাচনের জন্য কমিশন প্রতিশ্রুতিবদ্ধ বলে জানানো হয়েছে।",
    sourceUrl: "https://www.bd-pratidin.com",
    sourceName: "বাংলাদেশ প্রতিদিন",
    category: "রাজনৈতিক",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 5,
    title: "বাংলাদেশের রপ্তানি আয়ে নতুন মাইলফলক",
    summary:
      "চলতি অর্থবছরে বাংলাদেশের মোট রপ্তানি আয় নতুন মাইলফলক স্পর্শ করেছে। তৈরি পোশাক খাতের পাশাপাশি চামড়া, পাট ও আইটি সেবা খাতেও রপ্তানি বেড়েছে। বাণিজ্য মন্ত্রণালয় জানিয়েছে আগামী বছর এই প্রবৃদ্ধি আরও বাড়বে বলে আশা করা হচ্ছে। নতুন বাজার অনুসন্ধানে সরকার বিশেষ উদ্যোগ নিচ্ছে।",
    sourceUrl: "https://www.bd-pratidin.com",
    sourceName: "বাংলাদেশ প্রতিদিন",
    category: "অর্থনৈতিক",
    publishedAt: "৫ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // যুগান্তর
  {
    id: 6,
    title: "ঢাকায় মেট্রোরেলের নতুন রুট চালু হচ্ছে",
    summary:
      "ঢাকা মেট্রোরেলের নতুন সম্প্রসারিত রুট শীঘ্রই চালু হবে। কমলাপুর থেকে পূর্বাচল পর্যন্ত নতুন লাইন নির্মাণ কাজ দ্রুতগতিতে এগিয়ে চলছে। এই রুট চালু হলে রাজধানীর যানজট সমস্যা উল্লেখযোগ্যভাবে কমবে বলে সংশ্লিষ্টরা আশাবাদী। প্রাথমিকভাবে পরীক্ষামূলক চলাচল শুরু হবে।",
    sourceUrl: "https://www.jugantor.com",
    sourceName: "যুগান্তর",
    category: "জাতীয় খবর",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 7,
    title: "ডেঙ্গু পরিস্থিতি: সতর্কতা জারি, হাসপাতালে ভর্তি বাড়ছে",
    summary:
      "দেশে ডেঙ্গু জ্বরের প্রকোপ উদ্বেগজনকভাবে বেড়েছে। রাজধানী ঢাকাসহ জেলা পর্যায়ে হাসপাতালে ভর্তির সংখ্যা বৃদ্ধি পেয়েছে। স্বাস্থ্য অধিদপ্তর জনগণকে এডিস মশার বংশবিস্তার রোধে সচেতন থাকার আহ্বান জানিয়েছে। বিশেষ সতর্কতা হিসেবে দেশব্যাপী পরিষ্কার-পরিচ্ছন্নতা অভিযান পরিচালিত হচ্ছে।",
    sourceUrl: "https://www.jugantor.com",
    sourceName: "যুগান্তর",
    category: "স্বাস্থ্য",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // সমকাল
  {
    id: 8,
    title: "ডলারের বিপরীতে টাকার মূল্য স্থিতিশীল",
    summary:
      "বাংলাদেশ ব্যাংকের কার্যকর হস্তক্ষেপে বৈদেশিক মুদ্রা বাজারে স্থিতিশীলতা ফিরছে। কেন্দ্রীয় ব্যাংক ডলারের চাহিদা মেটাতে রিজার্ভ থেকে নিয়মিত সরবরাহ অব্যাহত রেখেছে। রেমিট্যান্স প্রবাহ বৃদ্ধির কারণে বাজারে কিছুটা চাপ কমেছে। বিশেষজ্ঞরা বলছেন আগামী কয়েক মাসে পরিস্থিতি আরও উন্নত হবে।",
    sourceUrl: "https://www.samakal.com",
    sourceName: "সমকাল",
    category: "অর্থনৈতিক",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 9,
    title: "বিরোধীদলীয় নেতাদের বৈঠক: রাজনৈতিক সংলাপের আহ্বান",
    summary:
      "দেশের প্রধান বিরোধীদলগুলো জাতীয় রাজনৈতিক পরিস্থিতি নিয়ে যৌথ বৈঠক করেছে। সংকট নিরসনে সংলাপের পথে হাঁটার আহ্বান জানানো হয়েছে। নেতারা বলেছেন, দেশের স্বার্থে রাজনৈতিক স্থিতিশীলতা নিশ্চিত করা এখন সর্বোচ্চ অগ্রাধিকার। সরকারের সাথে গঠনমূলক আলোচনার জন্য তারা প্রস্তুত।",
    sourceUrl: "https://www.samakal.com",
    sourceName: "সমকাল",
    category: "রাজনৈতিক",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // ইত্তেফাক
  {
    id: 10,
    title: "পদ্মা সেতুতে যানবাহন চলাচল রেকর্ড উচ্চতায়",
    summary:
      "পদ্মা সেতু উদ্বোধনের পর থেকে দৈনিক যানবাহন চলাচলে নতুন রেকর্ড স্থাপিত হয়েছে। দক্ষিণ-পশ্চিমাঞ্চলের ২১ জেলার সাথে রাজধানীর যোগাযোগ ব্যবস্থার ব্যাপক উন্নতি হয়েছে। টোল আদায়েও রেকর্ড সৃষ্টি হয়েছে। সেতু কর্তৃপক্ষ বলছে যানবাহনের চাপ মোকাবেলায় বিশেষ ব্যবস্থা নেওয়া হচ্ছে।",
    sourceUrl: "https://www.ittefaq.com.bd",
    sourceName: "ইত্তেফাক",
    category: "জাতীয় খবর",
    publishedAt: "৫ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 11,
    title: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষা: নতুন পদ্ধতি চালু",
    summary:
      "বাংলাদেশের সরকারি বিশ্ববিদ্যালয়গুলোতে ভর্তি পরীক্ষার জন্য নতুন কেন্দ্রীয় পদ্ধতি চালু করা হচ্ছে। এতে শিক্ষার্থীদের একটি মাত্র পরীক্ষায় বিভিন্ন বিশ্ববিদ্যালয়ে আবেদন করার সুযোগ মিলবে। পরীক্ষার ফি ও যাতায়াত খরচ কমবে। বিশ্ববিদ্যালয় মঞ্জুরি কমিশন এই সিদ্ধান্তকে যুগান্তকারী বলে অভিহিত করেছে।",
    sourceUrl: "https://www.ittefaq.com.bd",
    sourceName: "ইত্তেফাক",
    category: "শিক্ষা",
    publishedAt: "৬ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // কালের কণ্ঠ
  {
    id: 12,
    title: "বাংলাদেশ ক্রিকেট দল: এশিয়া কাপে দুর্দান্ত পারফরম্যান্স",
    summary:
      "বাংলাদেশ ক্রিকেট দল এশিয়া কাপ টুর্নামেন্টে অপ্রত্যাশিত দুর্দান্ত পারফরম্যান্স দেখিয়ে শক্তিশালী প্রতিপক্ষদের বিপক্ষে জয় তুলে নিয়েছে। তরুণ ব্যাটারদের পরিণত ব্যাটিং ও বোলারদের ধারাবাহিক দক্ষতা দলকে সেমিফাইনালে নিয়ে গেছে। ক্রিকেট বোর্ড এই পারফরম্যান্সে অত্যন্ত উৎসাহিত।",
    sourceUrl: "https://www.kalerkantho.com",
    sourceName: "কালের কণ্ঠ",
    category: "ক্রীড়া",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 13,
    title: "বাংলাদেশে বিদেশি বিনিয়োগ বাড়ছে",
    summary:
      "চলতি বছরে বাংলাদেশে সরাসরি বিদেশি বিনিয়োগ গত বছরের তুলনায় প্রায় ২০ শতাংশ বৃদ্ধি পেয়েছে। তৈরি পোশাক শিল্পের পাশাপাশি তথ্যপ্রযুক্তি, বিশেষ অর্থনৈতিক অঞ্চল ও নবায়নযোগ্য শক্তি খাতে বিনিয়োগ আসছে। বিশেষজ্ঞরা বলছেন, বিনিয়োগবান্ধব পরিবেশ তৈরিতে সরকারের উদ্যোগ ফলপ্রসূ হচ্ছে।",
    sourceUrl: "https://www.kalerkantho.com",
    sourceName: "কালের কণ্ঠ",
    category: "জাতীয় খবর",
    publishedAt: "৭ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // মানবজমিন
  {
    id: 14,
    title: "সরকারের নতুন উন্নয়ন পরিকল্পনা: মন্ত্রিসভায় অনুমোদন",
    summary:
      "সরকারের নতুন পঞ্চবার্ষিক উন্নয়ন পরিকল্পনা মন্ত্রিসভায় অনুমোদন পেয়েছে। অবকাঠামো, শিল্প, কৃষি ও মানব উন্নয়নে সমন্বিত বিনিয়োগের রূপরেখা তৈরি করা হয়েছে। পরিকল্পনামন্ত্রী বলেছেন, এই পরিকল্পনা বাস্তবায়নে সরকার সর্বোচ্চ গুরুত্ব দেবে। আগামী পাঁচ বছরে দেশের মাথাপিছু আয় দ্বিগুণ করার লক্ষ্য নির্ধারণ করা হয়েছে।",
    sourceUrl: "https://mzamin.com",
    sourceName: "মানবজমিন",
    category: "রাজনৈতিক",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 15,
    title: "দেশে মূল্যস্ফীতি নিয়ন্ত্রণে আসছে: বাংলাদেশ ব্যাংক",
    summary:
      "বাংলাদেশ ব্যাংকের সর্বশেষ তথ্য অনুযায়ী, দেশে মূল্যস্ফীতির হার ক্রমশ কমে আসছে। মুদ্রানীতি কঠোর করা ও আমদানি নিয়ন্ত্রণের ফলে বাজারে চাপ কমছে। খাদ্য মূল্যস্ফীতি নিয়ন্ত্রণে গ্রামীণ বাজারে সরাসরি হস্তক্ষেপের পরিকল্পনা রয়েছে। সামনের মাসগুলোতে মূল্যস্ফীতি আরও কমার প্রত্যাশা।",
    sourceUrl: "https://mzamin.com",
    sourceName: "মানবজমিন",
    category: "অর্থনৈতিক",
    publishedAt: "৬ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // দেশ রূপান্তর
  {
    id: 16,
    title: "করোনা পরিস্থিতি: নতুন ভ্যারিয়েন্ট নিয়ে সতর্কতা",
    summary:
      "বিশ্বজুড়ে করোনাভাইরাসের নতুন ভ্যারিয়েন্ট ছড়িয়ে পড়ার প্রেক্ষিতে বাংলাদেশ স্বাস্থ্য অধিদপ্তর বিশেষ সতর্কতা জারি করেছে। বিমানবন্দরে স্বাস্থ্য স্ক্রিনিং জোরদার করা হয়েছে। জনগণকে মাস্ক পরিধান ও স্বাস্থ্যবিধি মানার পরামর্শ দেওয়া হয়েছে। হাসপাতালগুলোকে প্রস্তুত থাকার নির্দেশ দেওয়া হয়েছে।",
    sourceUrl: "https://www.deshrupantor.com",
    sourceName: "দেশ রূপান্তর",
    category: "স্বাস্থ্য",
    publishedAt: "৫ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 17,
    title: "সেচ প্রকল্পে নতুন বরাদ্দ: কৃষিতে বিপ্লবের আশা",
    summary:
      "সরকার কৃষি খাতের উন্নয়নে সেচ প্রকল্পে বিশেষ বরাদ্দ রেখেছে। দেশের উত্তর-পশ্চিমাঞ্চলে নতুন সেচ অবকাঠামো নির্মাণ করা হবে। এতে হাজার হাজার কৃষক উপকৃত হবেন এবং শুষ্ক মৌসুমেও সেচ সুবিধা পাবেন। কৃষিবিদরা বলছেন এই পদক্ষেপ দেশের খাদ্য নিরাপত্তায় গুরুত্বপূর্ণ ভূমিকা রাখবে।",
    sourceUrl: "https://www.deshrupantor.com",
    sourceName: "দেশ রূপান্তর",
    category: "কৃষি",
    publishedAt: "৮ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // নয়া দিগন্ত
  {
    id: 18,
    title: "মানবাধিকার পরিস্থিতি নিয়ে আন্তর্জাতিক উদ্বেগ",
    summary:
      "জাতিসংঘের মানবাধিকার কমিশন বাংলাদেশের পরিস্থিতি পর্যবেক্ষণ করছে। বিভিন্ন আন্তর্জাতিক সংস্থা নাগরিক স্বাধীনতা ও বিচারিক প্রক্রিয়া নিয়ে উদ্বেগ প্রকাশ করেছে। সরকার জানিয়েছে আন্তর্জাতিক মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ। এই বিষয়ে কূটনৈতিক আলোচনা চলছে।",
    sourceUrl: "https://www.dailynayadiganta.com",
    sourceName: "নয়া দিগন্ত",
    category: "রাজনৈতিক",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "national",
  },
  {
    id: 19,
    title: "সড়ক দুর্ঘটনা রোধে নতুন আইন কার্যকর",
    summary:
      "সড়ক পরিবহন ও যোগাযোগ মন্ত্রণালয় নতুন সড়ক নিরাপত্তা আইন কার্যকর করেছে। বেপরোয়া গাড়ি চালানো, মদ্যপান করে গাড়ি চালানো ও অতিরিক্ত গতিতে শাস্তি কঠোর করা হয়েছে। প্রশিক্ষিত চালক নিয়োগ বাধ্যতামূলক করা হয়েছে। বিশেষজ্ঞরা বলছেন এই আইন সঠিকভাবে প্রয়োগ হলে দুর্ঘটনা উল্লেখযোগ্যভাবে কমবে।",
    sourceUrl: "https://www.dailynayadiganta.com",
    sourceName: "নয়া দিগন্ত",
    category: "জাতীয় খবর",
    publishedAt: "৯ ঘন্টা আগে",
    sourceGroup: "national",
  },

  // ─────────────────────────────────────────────────────────────
  // অনলাইন নিউজ পোর্টাল — online
  // ─────────────────────────────────────────────────────────────

  // BD News24
  {
    id: 20,
    title: "বাংলাদেশের নদী দূষণ: পরিবেশ মন্ত্রণালয়ের উদ্যোগ",
    summary:
      "পরিবেশ মন্ত্রণালয় বুড়িগঙ্গাসহ দেশের প্রধান নদীগুলোর দূষণ রোধে বিশেষ কর্মসূচি গ্রহণ করেছে। শিল্পকারখানার দূষিত পানি নদীতে ফেলা নিষিদ্ধ করা হয়েছে এবং এর বিরুদ্ধে আইনি ব্যবস্থা কঠোর করা হয়েছে। নদী পুনরুদ্ধারে আন্তর্জাতিক সহযোগিতাও চাওয়া হচ্ছে। পরিবেশবিদরা এই উদ্যোগকে সাধুবাদ জানিয়েছেন।",
    sourceUrl: "https://www.bdnews24.com",
    sourceName: "BD News24",
    category: "জাতীয় খবর",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 21,
    title: "জাতিসংঘে বাংলাদেশের নতুন প্রস্তাব পাস",
    summary:
      "জাতিসংঘ সাধারণ পরিষদে বাংলাদেশের উত্থাপিত জলবায়ু পরিবর্তন সংক্রান্ত একটি গুরুত্বপূর্ণ প্রস্তাব পাস হয়েছে। ক্ষতিগ্রস্ত দেশগুলোর জন্য বিশেষ ক্ষতিপূরণ তহবিল গঠনের বিষয়টি এই প্রস্তাবে অন্তর্ভুক্ত। বাংলাদেশের পররাষ্ট্র মন্ত্রণালয় এই সাফল্যকে কূটনৈতিক অর্জন হিসেবে দেখছে। আন্তর্জাতিক মহলে বাংলাদেশের ভাবমূর্তি উজ্জ্বল হয়েছে।",
    sourceUrl: "https://www.bdnews24.com",
    sourceName: "BD News24",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // Bangla News24
  {
    id: 22,
    title: "শেয়ার বাজারে নতুন উত্থান: বিনিয়োগকারীদের আগ্রহ বাড়ছে",
    summary:
      "ঢাকা স্টক এক্সচেঞ্জে সাম্প্রতিক সপ্তাহগুলোতে সূচক উল্লেখযোগ্যভাবে বেড়েছে। ব্যাংকিং ও টেলিযোগাযোগ খাতের শেয়ারে বিনিয়োগকারীদের আগ্রহ বেশি দেখা যাচ্ছে। বিশ্লেষকরা বলছেন অর্থনৈতিক স্থিতিশীলতা ফিরলে বাজার আরও শক্তিশালী হবে। ক্ষুদ্র বিনিয়োগকারীদের সতর্কতার সাথে বিনিয়োগ করার পরামর্শ দেওয়া হচ্ছে।",
    sourceUrl: "https://www.banglanews24.com",
    sourceName: "Bangla News24",
    category: "অর্থনৈতিক",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 23,
    title: "বাংলাদেশ ফুটবল ফেডারেশনের নতুন কোচ নিয়োগ",
    summary:
      "বাংলাদেশ ফুটবল ফেডারেশন জাতীয় দলের জন্য নতুন বিদেশি কোচ নিয়োগ দিয়েছে। কোচ আগামী বিশ্বকাপ বাছাই পর্বে দলের পারফরম্যান্স উন্নয়নে কাজ করবেন। তরুণ ফুটবলারদের দক্ষতা বিকাশে বিশেষ প্রশিক্ষণ কার্যক্রম চালু হবে। ফেডারেশন আশা করছে আগামী দুই বছরে দলের র‍্যাংকিং উল্লেখযোগ্যভাবে বাড়বে।",
    sourceUrl: "https://www.banglanews24.com",
    sourceName: "Bangla News24",
    category: "ক্রীড়া",
    publishedAt: "৬ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // Jago News24
  {
    id: 24,
    title: "স্থানীয় সরকার নির্বাচন: প্রস্তুতি শুরু",
    summary:
      "আগামী ইউনিয়ন পরিষদ ও পৌরসভা নির্বাচনের জন্য নির্বাচন কমিশন প্রস্তুতি শুরু করেছে। ভোটার তালিকা হালনাগাদ ও কেন্দ্র চিহ্নিতকরণের কাজ এগিয়ে চলছে। স্থানীয় রাজনৈতিক দলগুলো প্রার্থী মনোনয়নের পরিকল্পনা শুরু করেছে। সুষ্ঠু ও শান্তিপূর্ণ নির্বাচন নিশ্চিতে কমিশন দৃঢ় প্রতিজ্ঞ।",
    sourceUrl: "https://www.jagonews24.com",
    sourceName: "Jago News24",
    category: "রাজনৈতিক",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 25,
    title: "বাংলাদেশে ক্যান্সার চিকিৎসায় নতুন সুবিধা",
    summary:
      "বাংলাদেশে ক্যান্সার চিকিৎসার সুযোগ বাড়াতে নতুন কয়েকটি বিশেষায়িত হাসপাতাল ও ক্যান্সার কেয়ার সেন্টার চালু হচ্ছে। আধুনিক রেডিওথেরাপি ও কেমোথেরাপি সুবিধা এখন জেলা পর্যায়েও পাওয়া যাবে। বিদেশ থেকে রোগী ফিরিয়ে আনতে সরকার বিশেষ প্রণোদনা দিচ্ছে। এই উদ্যোগে লক্ষাধিক রোগী উপকৃত হবেন।",
    sourceUrl: "https://www.jagonews24.com",
    sourceName: "Jago News24",
    category: "স্বাস্থ্য",
    publishedAt: "৭ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // Risingbd
  {
    id: 26,
    title: "প্রাথমিক শিক্ষায় ডিজিটাল রূপান্তর: ট্যাবলেট বিতরণ",
    summary:
      "সরকারের ডিজিটাল বাংলাদেশ কর্মসূচির আওতায় সারাদেশের সরকারি প্রাথমিক বিদ্যালয়ে শিক্ষার্থীদের মধ্যে ট্যাবলেট বিতরণ শুরু হয়েছে। ইন্টারেক্টিভ কনটেন্ট ও ই-বুক সুবিধায় শিক্ষার মান উন্নত হবে বলে আশা করা যাচ্ছে। শিক্ষকদের ডিজিটাল প্রশিক্ষণও চলছে। এই উদ্যোগে প্রায় ৫০ লাখ শিক্ষার্থী উপকৃত হবে।",
    sourceUrl: "https://www.risingbd.com",
    sourceName: "Risingbd",
    category: "শিক্ষা",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 27,
    title: "মাছ চাষে বাংলাদেশের সাফল্য: বিশ্বে তৃতীয়",
    summary:
      "বাংলাদেশ মাছ উৎপাদনে বিশ্বে তৃতীয় স্থান অধিকার করেছে। মৎস্য বিভাগের সর্বশেষ প্রতিবেদন অনুযায়ী, দেশে ইলিশ উৎপাদন রেকর্ড পর্যায়ে পৌঁছেছে। আধুনিক প্রযুক্তিতে মাছ চাষ এবং হ্যাচারি ব্যবস্থার উন্নয়নে সরকারি-বেসরকারি বিনিয়োগ বেড়েছে। এই সাফল্য দেশের কোটি মানুষের জীবিকার সাথে জড়িত।",
    sourceUrl: "https://www.risingbd.com",
    sourceName: "Risingbd",
    category: "কৃষি",
    publishedAt: "৮ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // Dhaka Post
  {
    id: 28,
    title: "ঢাকার যানজট নিরসনে নতুন পরিকল্পনা",
    summary:
      "ঢাকা উত্তর ও দক্ষিণ সিটি কর্পোরেশন রাজধানীর যানজট নিরসনে একটি সমন্বিত পরিকল্পনা গ্রহণ করেছে। পার্কিং ব্যবস্থার উন্নয়ন, ফুটপাথ মুক্তকরণ ও সুশৃঙ্খল গণপরিবহন নিশ্চিত করার পদক্ষেপ নেওয়া হচ্ছে। মেট্রোরেল ও বাস র‍্যাপিড ট্রানজিটের সমন্বয়ে যানজট কমানো সম্ভব হবে বলে বিশেষজ্ঞরা আশাবাদী।",
    sourceUrl: "https://www.dhakapost.com",
    sourceName: "Dhaka Post",
    category: "জাতীয় খবর",
    publishedAt: "৫ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 29,
    title: "গার্মেন্টস খাতে নতুন কর্মসংস্থান সৃষ্টি",
    summary:
      "বাংলাদেশের তৈরি পোশাক শিল্পে বিদেশি ক্রেতাদের নতুন অর্ডার বাড়ায় হাজার হাজার নতুন কর্মসংস্থান তৈরি হচ্ছে। মজুরি বৃদ্ধি ও কর্মক্ষেত্রের নিরাপত্তা উন্নয়নে কারখানা মালিকরা বিনিয়োগ করছেন। বিজিএমইএ জানিয়েছে আগামী বছরের মধ্যে আরও ১০ লাখ কর্মী নিয়োগ পাবেন। বৈশ্বিক ফ্যাশন বাজারে বাংলাদেশের অবস্থান আরও শক্তিশালী হচ্ছে।",
    sourceUrl: "https://www.dhakapost.com",
    sourceName: "Dhaka Post",
    category: "অর্থনৈতিক",
    publishedAt: "৯ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // Go News24
  {
    id: 30,
    title: "সংসদে নতুন বিল পাস: নাগরিক অধিকার শক্তিশালী",
    summary:
      "জাতীয় সংসদে নাগরিক সুরক্ষা সংক্রান্ত একটি নতুন বিল পাস হয়েছে। এই আইনে ভোক্তা অধিকার সংরক্ষণ, তথ্য প্রাপ্তির অধিকার ও প্রতিকারের পথ আরও সহজ করা হয়েছে। আইন বিশেষজ্ঞরা এটিকে একটি যুগান্তকারী পদক্ষেপ বলছেন। সাধারণ নাগরিকরা এই আইনের মাধ্যমে দ্রুত বিচার পাবেন।",
    sourceUrl: "https://www.gonews24.com",
    sourceName: "Go News24",
    category: "রাজনৈতিক",
    publishedAt: "৬ ঘন্টা আগে",
    sourceGroup: "online",
  },
  {
    id: 31,
    title: "বাংলাদেশ দাবা দলের আন্তর্জাতিক সাফল্য",
    summary:
      "বাংলাদেশ দাবা দল এশিয়ান চ্যাম্পিয়নশিপে অসাধারণ সাফল্য দেখিয়েছে। তরুণ গ্র্যান্ডমাস্টার নিফাজ আহমেদ ব্যক্তিগত বিভাগে স্বর্ণপদক জিতেছেন। বাংলাদেশ দাবা ফেডারেশন জানিয়েছে আগামী বিশ্ব চ্যাম্পিয়নশিপের জন্য বিশেষ প্রস্তুতি নেওয়া হচ্ছে। এই সাফল্যে ক্রীড়া মন্ত্রী অভিনন্দন জানিয়েছেন।",
    sourceUrl: "https://www.gonews24.com",
    sourceName: "Go News24",
    category: "ক্রীড়া",
    publishedAt: "১০ ঘন্টা আগে",
    sourceGroup: "online",
  },

  // ─────────────────────────────────────────────────────────────
  // আন্তর্জাতিক সংবাদ মাধ্যম — international
  // ─────────────────────────────────────────────────────────────

  // BBC Bangla
  {
    id: 32,
    title: "ইরান-আমেরিকা উত্তেজনা: মধ্যপ্রাচ্যে সামরিক মহড়া তীব্র হচ্ছে",
    summary:
      "পারস্য উপসাগরীয় অঞ্চলে ইরান ও যুক্তরাষ্ট্রের মধ্যে সামরিক উপস্থিতি বাড়ছে। উভয় দেশ আঞ্চলিক মিত্রদের সাথে সমন্বিত মহড়া পরিচালনা করছে। বিশ্লেষকরা বলছেন পরিস্থিতি যে কোনো মুহূর্তে সংকটে রূপ নিতে পারে। ইউরোপীয় দেশগুলো কূটনৈতিক সমাধানের আহ্বান জানাচ্ছে। জাতিসংঘের মহাসচিব উভয় পক্ষকে সংযত থাকার আহ্বান জানিয়েছেন।",
    sourceUrl: "https://www.bbc.com/bengali",
    sourceName: "BBC বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 33,
    title: "ভারত-পাকিস্তান সীমান্তে উত্তেজনা বৃদ্ধি",
    summary:
      "ভারত ও পাকিস্তানের মধ্যে নিয়ন্ত্রণ রেখায় সামরিক তৎপরতা আশঙ্কাজনকভাবে বেড়েছে। সীমান্ত অঞ্চলে বেশ কয়েকটি সংঘর্ষের ঘটনা রিপোর্ট করা হয়েছে। দুই দেশের কূটনৈতিক সম্পর্কে মারাত্মক টানাপোড়েন চলছে। পাকিস্তানের পররাষ্ট্রমন্ত্রী বলেছেন, উত্তেজনা কমাতে তৃতীয় পক্ষের মধ্যস্থতা প্রয়োজন।",
    sourceUrl: "https://www.bbc.com/bengali",
    sourceName: "BBC বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৮ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // DW Bangla
  {
    id: 34,
    title: "ইউরোপে শরণার্থী সংকট: নতুন নীতি প্রণয়ন",
    summary:
      "ইউরোপীয় ইউনিয়ন বাড়তে থাকা শরণার্থী সংকট মোকাবেলায় নতুন অভিবাসন নীতি প্রণয়ন করেছে। সদস্য দেশগুলোর মধ্যে শরণার্থীদের সমান বণ্টনের বিষয়ে চুক্তি হয়েছে। মানবাধিকার সংস্থাগুলো এই নীতির কিছু দিক নিয়ে উদ্বেগ প্রকাশ করেছে। সীমান্ত ব্যবস্থাপনায় নতুন প্রযুক্তির ব্যবহার বাড়ানো হচ্ছে।",
    sourceUrl: "https://www.dw.com/bn",
    sourceName: "DW বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 35,
    title: "জার্মানিতে নতুন সরকার গঠন: মার্কেলের উত্তরসূরি",
    summary:
      "জার্মানিতে দীর্ঘ আলোচনার পর নতুন জোট সরকার গঠিত হয়েছে। নতুন চ্যান্সেলর দেশের অর্থনৈতিক পুনরুদ্ধার ও জলবায়ু পরিবর্তন মোকাবেলাকে অগ্রাধিকার দিচ্ছেন। ইউরোপীয় ইউনিয়নে জার্মানির নেতৃত্বের ভূমিকা আরও শক্তিশালী হবে বলে বিশ্লেষকরা মনে করছেন। রাশিয়া-ইউক্রেন যুদ্ধ ইস্যুতে নতুন সরকারের অবস্থান গুরুত্বপূর্ণ।",
    sourceUrl: "https://www.dw.com/bn",
    sourceName: "DW বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৭ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // VOA Bangla
  {
    id: 36,
    title: "মার্কিন কংগ্রেসে নতুন বাণিজ্য বিল পাস",
    summary:
      "মার্কিন কংগ্রেসে একটি নতুন আন্তর্জাতিক বাণিজ্য বিল পাস হয়েছে যা উন্নয়নশীল দেশগুলোর সাথে বাণিজ্য সম্পর্ক পুনর্বিন্যাস করবে। বাংলাদেশ সহ দক্ষিণ এশিয়ার দেশগুলোর জন্য রপ্তানি সুযোগ বাড়তে পারে। মার্কিন ব্যবসায়ীরা এই বিলকে ইতিবাচকভাবে দেখছেন। অর্থনৈতিক বিশেষজ্ঞরা এর দীর্ঘমেয়াদি প্রভাব বিশ্লেষণ করছেন।",
    sourceUrl: "https://www.voabangla.com",
    sourceName: "VOA বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৪ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 37,
    title: "আফগানিস্তানে মানবিক সংকট: আন্তর্জাতিক সহায়তার আহ্বান",
    summary:
      "আফগানিস্তানে চলমান মানবিক সংকট আরও গভীর হচ্ছে। লক্ষ লক্ষ মানুষ খাদ্য সংকটে ভুগছেন। জাতিসংঘের বিশ্ব খাদ্য কার্যক্রম আন্তর্জাতিক সম্প্রদায়ের কাছে জরুরি সহায়তার আবেদন জানিয়েছে। তালেবান সরকার মানবিক সহায়তা কার্যক্রম চলতে দেওয়ার আশ্বাস দিলেও বাস্তবে প্রতিবন্ধকতা রয়েছে।",
    sourceUrl: "https://www.voabangla.com",
    sourceName: "VOA বাংলা",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৯ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // The Daily Star
  {
    id: 38,
    title: "Bangladesh economy shows resilience amid global headwinds",
    summary:
      "বৈশ্বিক মন্দার প্রভাব সত্ত্বেও বাংলাদেশের অর্থনীতি চলতি বছরে ৬.৫ শতাংশের বেশি প্রবৃদ্ধি অর্জন করেছে। রপ্তানি আয়, রেমিট্যান্স ও কৃষি উৎপাদনে ধারাবাহিক অগ্রগতি এই সাফল্যের মূল কারণ। আন্তর্জাতিক মুদ্রা তহবিল বাংলাদেশের অর্থনৈতিক ব্যবস্থাপনার প্রশংসা করেছে। বিনিয়োগকারীদের আস্থা ফিরে আসছে।",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
    category: "জাতীয় খবর",
    publishedAt: "১ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 39,
    title: "চীন ও তাইওয়ান উত্তেজনা: নতুন সামরিক মহড়া",
    summary:
      "চীন তাইওয়ান প্রণালীতে বড় আকারের সামরিক মহড়া পরিচালনা করেছে। যুদ্ধজাহাজ, সাবমেরিন ও বিমানবাহিনীর সমন্বয়ে এই মহড়া তাইওয়ানের জন্য গুরুতর হুমকি বলে বিবেচিত হচ্ছে। যুক্তরাষ্ট্র ও জাপান তীব্র নিন্দা জানিয়েছে। তাইওয়ান তার সামরিক প্রস্তুতি জোরদার করেছে।",
    sourceUrl: "https://www.thedailystar.net",
    sourceName: "The Daily Star",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "১০ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // Al Jazeera
  {
    id: 40,
    title: "গাজায় যুদ্ধবিরতির আলোচনা: মধ্যস্থতাকারীরা আশাবাদী",
    summary:
      "কাতার ও মিশরের মধ্যস্থতায় ইসরায়েল ও হামাসের মধ্যে যুদ্ধবিরতির নতুন আলোচনা শুরু হয়েছে। উভয় পক্ষই কিছুটা নমনীয় অবস্থানে আসছে বলে সূত্র জানিয়েছে। মার্কিন যুক্তরাষ্ট্র এই আলোচনায় সক্রিয় সমর্থন দিচ্ছে। জিম্মিদের মুক্তি ও মানবিক করিডোর নিশ্চিত করা আলোচনার কেন্দ্রে রয়েছে।",
    sourceUrl: "https://www.aljazeera.com",
    sourceName: "Al Jazeera",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৫ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 41,
    title: "আফ্রিকায় জলবায়ু পরিবর্তনের প্রভাব: খরা ও দুর্ভিক্ষের আশঙ্কা",
    summary:
      "আফ্রিকার সাহেল অঞ্চলে তীব্র খরার কারণে কৃষি উৎপাদন মারাত্মকভাবে ক্ষতিগ্রস্ত হয়েছে। কোটি কোটি মানুষ খাদ্য সংকটের মুখে। জলবায়ু বিশেষজ্ঞরা সতর্ক করছেন এই পরিস্থিতি আগামী দশকে আরও ভয়ংকর হবে। আন্তর্জাতিক সম্প্রদায়ের কাছে জরুরি পদক্ষেপের দাবি উঠছে।",
    sourceUrl: "https://www.aljazeera.com",
    sourceName: "Al Jazeera",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৮ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // Reuters
  {
    id: 42,
    title: "তেলের দাম বৃদ্ধি: বিশ্ব অর্থনীতিতে প্রভাব",
    summary:
      "মধ্যপ্রাচ্যে রাজনৈতিক অস্থিতিশীলতার কারণে আন্তর্জাতিক বাজারে অপরিশোধিত তেলের দাম ব্যারেলপ্রতি ৫ ডলারের বেশি বেড়েছে। এই মূল্যবৃদ্ধি বিশ্বব্যাপী মুদ্রাস্ফীতির চাপ বাড়াচ্ছে। উন্নয়নশীল দেশগুলো সবচেয়ে বেশি ক্ষতিগ্রস্ত হচ্ছে। ওপেক দেশগুলো উৎপাদন নীতি পর্যালোচনা করছে।",
    sourceUrl: "https://www.reuters.com",
    sourceName: "Reuters",
    category: "অর্থনৈতিক",
    publishedAt: "২ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 43,
    title: "রাশিয়া-ইউক্রেন যুদ্ধ: নতুন শান্তি আলোচনার সম্ভাবনা",
    summary:
      "তুরস্ক ও সুইজারল্যান্ডের মধ্যস্থতায় রাশিয়া ও ইউক্রেনের মধ্যে নতুন শান্তি আলোচনা শুরুর সম্ভাবনা তৈরি হয়েছে। উভয় পক্ষই কিছু শর্তে সংলাপে বসতে আগ্রহী বলে জানা গেছে। যুদ্ধের তৃতীয় বছরে এসে আন্তর্জাতিক সম্প্রদায় কূটনৈতিক সমাধানের দিকে জোর দিচ্ছে।",
    sourceUrl: "https://www.reuters.com",
    sourceName: "Reuters",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "১২ ঘন্টা আগে",
    sourceGroup: "international",
  },

  // AP News
  {
    id: 44,
    title: "আমেরিকায় নতুন প্রশাসনের বৈদেশিক নীতি পরিবর্তন",
    summary:
      "মার্কিন যুক্তরাষ্ট্রের নতুন প্রশাসন তাদের বৈদেশিক নীতিতে বড় পরিবর্তন আনছে। মধ্যপ্রাচ্য, এশিয়া ও ইউরোপ নীতিতে নতুন অগ্রাধিকার নির্ধারণ করা হয়েছে। মিত্র দেশগুলোর সাথে নতুন করে কৌশলগত সম্পর্ক গড়ে তোলার চেষ্টা চলছে। বিশ্বের বিভিন্ন দেশ এই পরিবর্তন ঘনিষ্ঠভাবে পর্যবেক্ষণ করছে।",
    sourceUrl: "https://apnews.com",
    sourceName: "AP News",
    category: "আন্তর্জাতিক খবর",
    publishedAt: "৩ ঘন্টা আগে",
    sourceGroup: "international",
  },
  {
    id: 45,
    title: "বৈশ্বিক মুদ্রাস্ফীতি নিয়ন্ত্রণে কেন্দ্রীয় ব্যাংকগুলোর উদ্যোগ",
    summary:
      "বিশ্বের প্রধান কেন্দ্রীয় ব্যাংকগুলো মুদ্রাস্ফীতি নিয়ন্ত্রণে সুদের হার বৃদ্ধি অব্যাহত রেখেছে। মার্কিন ফেডারেল রিজার্ভ, ইউরোপীয় কেন্দ্রীয় ব্যাংক ও ব্যাংক অব ইংল্যান্ড সমন্বিতভাবে কাজ করছে। তবে এই কঠোর মুদ্রানীতি বৈশ্বিক প্রবৃদ্ধিকে মন্থর করতে পারে বলে আশঙ্কা রয়েছে।",
    sourceUrl: "https://apnews.com",
    sourceName: "AP News",
    category: "অর্থনৈতিক",
    publishedAt: "৬ ঘন্টা আগে",
    sourceGroup: "international",
  },
];

// Extra news batches for rotation on Refresh
const REFRESH_BATCHES: NewsItem[][] = [
  [
    {
      id: 101,
      title: "ইরানের পারমাণবিক কর্মসূচি: আইএইএ'র নতুন প্রতিবেদন",
      summary:
        "আন্তর্জাতিক পরমাণু শক্তি সংস্থা (আইএইএ) ইরানের পারমাণবিক কর্মসূচির সর্বশেষ অগ্রগতি নিয়ে নতুন প্রতিবেদন প্রকাশ করেছে। ইরান উচ্চমাত্রার ইউরেনিয়াম সমৃদ্ধকরণ চালিয়ে যাচ্ছে বলে জানানো হয়েছে। পশ্চিমা দেশগুলো এই তথ্যে গভীর উদ্বেগ প্রকাশ করেছে। জাতিসংঘ নিরাপত্তা পরিষদে জরুরি আলোচনা আহ্বান করা হয়েছে।",
      sourceUrl: "https://www.bbc.com/bengali",
      sourceName: "BBC বাংলা",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "international",
    },
    {
      id: 102,
      title: "বাংলাদেশে নতুন তথ্যপ্রযুক্তি পার্ক উদ্বোধন",
      summary:
        "সরকার সিলেটে নতুন একটি হাইটেক পার্ক উদ্বোধন করেছে। এই পার্কে দেশ-বিদেশের আইটি কোম্পানি বিনিয়োগ করবে এবং হাজার হাজার তরুণের কর্মসংস্থান হবে। আইটি শিল্পকে রপ্তানি খাত হিসেবে প্রতিষ্ঠা করতে সরকার দীর্ঘমেয়াদি পরিকল্পনা নিয়েছে। প্রবাসী বাংলাদেশিদের বিনিয়োগ আকৃষ্ট করতে বিশেষ প্রণোদনা ঘোষণা করা হয়েছে।",
      sourceUrl: "https://www.bd-pratidin.com",
      sourceName: "বাংলাদেশ প্রতিদিন",
      category: "জাতীয় খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "national",
    },
    {
      id: 103,
      title: "শেয়ার বাজারে ব্যাংক খাতে বিনিয়োগকারীদের উৎসাহ",
      summary:
        "সাম্প্রতিক মাসগুলোতে ঢাকা স্টক এক্সচেঞ্জে ব্যাংকিং খাতের শেয়ারে বিনিয়োগকারীদের আগ্রহ অনেক বেড়েছে। ব্যাংকগুলোর মুনাফার হার বাড়ায় এবং খেলাপি ঋণ কমায় বিনিয়োগকারীরা উৎসাহিত হচ্ছেন। বিশ্লেষকরা বলছেন এই ধারা অব্যাহত থাকলে পুঁজিবাজারে ইতিবাচক প্রভাব পড়বে।",
      sourceUrl: "https://www.banglanews24.com",
      sourceName: "Bangla News24",
      category: "অর্থনৈতিক",
      publishedAt: "এইমাত্র",
      sourceGroup: "online",
    },
    {
      id: 104,
      title: "সুদান সংকট: লক্ষাধিক মানুষ বাস্তুচ্যুত",
      summary:
        "সুদানে চলমান গৃহযুদ্ধে লক্ষাধিক বেসামরিক মানুষ বাস্তুচ্যুত হয়েছেন। প্রতিবেশী দেশগুলোতে শরণার্থীর ঢল নামছে। আন্তর্জাতিক রেড ক্রস ও জাতিসংঘ মানবিক সহায়তা পৌঁছে দিতে হিমশিম খাচ্ছে। আফ্রিকান ইউনিয়ন যুদ্ধবিরতির জন্য নিবিড় কূটনৈতিক প্রচেষ্টা চালিয়ে যাচ্ছে।",
      sourceUrl: "https://www.aljazeera.com",
      sourceName: "Al Jazeera",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "international",
    },
    {
      id: 105,
      title: "বাংলাদেশের চা শিল্পে নতুন সম্ভাবনা",
      summary:
        "সিলেট ও চট্টগ্রামের চা বাগানগুলোতে উৎপাদন বৃদ্ধি পাচ্ছে। আন্তর্জাতিক বাজারে বাংলাদেশি চায়ের চাহিদা বাড়ছে। চা বোর্ড নতুন বাজার অনুসন্ধানে বিশেষ কর্মসূচি নিয়েছে। চা শিল্পে প্রযুক্তির ব্যবহার বাড়িয়ে উৎপাদন খরচ কমানো হচ্ছে।",
      sourceUrl: "https://www.risingbd.com",
      sourceName: "Risingbd",
      category: "কৃষি",
      publishedAt: "এইমাত্র",
      sourceGroup: "online",
    },
  ],
  [
    {
      id: 201,
      title: "ইরান-ইসরায়েল উত্তেজনা: আঞ্চলিক নিরাপত্তা হুমকিতে",
      summary:
        "ইরান ও ইসরায়েলের মধ্যে পারস্পরিক হুমকি-পাল্টা হুমকি চলছে। পারস্য উপসাগরীয় অঞ্চলে উত্তেজনা দ্রুত বাড়ছে। আরব বিশ্বের দেশগুলো উভয় পক্ষকে সংযত থাকার আহ্বান জানাচ্ছে। মার্কিন যুক্তরাষ্ট্র অঞ্চলটিতে অতিরিক্ত নৌবহর মোতায়েন করেছে।",
      sourceUrl: "https://www.bbc.com/bengali",
      sourceName: "BBC বাংলা",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "international",
    },
    {
      id: 202,
      title: "বাংলাদেশ-ভারত বাণিজ্য সম্পর্ক জোরদার",
      summary:
        "বাংলাদেশ ও ভারতের মধ্যে বাণিজ্য সম্পর্ক নতুন গতি পেয়েছে। উভয় দেশের মধ্যে সীমান্ত হাট, রেলপথ ও নৌপথে ব্যবসার সুযোগ বাড়ছে। বাংলাদেশি পণ্যের শুল্কমুক্ত প্রবেশাধিকার ভারতীয় বাজারে আরও প্রসারিত হচ্ছে। দুই দেশের বাণিজ্যমন্ত্রী পরবর্তী বৈঠকে নতুন চুক্তি সই করবেন বলে জানা গেছে।",
      sourceUrl: "https://www.thedailystar.net",
      sourceName: "The Daily Star",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "international",
    },
    {
      id: 203,
      title: "গ্রামীণ স্বাস্থ্যসেবায় ডিজিটাল উদ্যোগ",
      summary:
        "সরকার গ্রামীণ পর্যায়ে স্বাস্থ্যসেবা পৌঁছে দিতে টেলিমেডিসিন ও ডিজিটাল স্বাস্থ্য কার্ড চালু করেছে। ইউনিয়ন স্বাস্থ্য কেন্দ্রগুলোকে ডিজিটাল সংযোগে যুক্ত করা হচ্ছে। এতে প্রত্যন্ত অঞ্চলের মানুষ বিনামূল্যে বিশেষজ্ঞ চিকিৎসার পরামর্শ পাবেন। স্বাস্থ্যমন্ত্রী বলেছেন এটি স্বাস্থ্যখাতে বিপ্লব আনবে।",
      sourceUrl: "https://www.jagonews24.com",
      sourceName: "Jago News24",
      category: "স্বাস্থ্য",
      publishedAt: "এইমাত্র",
      sourceGroup: "online",
    },
    {
      id: 204,
      title: "বৈশ্বিক প্রযুক্তি যুদ্ধ: চিপ শিল্পে আমেরিকা-চীন প্রতিযোগিতা",
      summary:
        "সেমিকন্ডাক্টর শিল্পে যুক্তরাষ্ট্র ও চীনের মধ্যে প্রতিযোগিতা তীব্রতর হচ্ছে। আমেরিকা চীনকে উন্নত চিপ রপ্তানিতে নতুন বিধিনিষেধ আরোপ করেছে। চীন নিজস্ব চিপ উৎপাদনে ব্যাপক বিনিয়োগ করছে। এই প্রযুক্তি যুদ্ধ বৈশ্বিক সরবরাহ শৃঙ্খলে প্রভাব ফেলছে।",
      sourceUrl: "https://www.reuters.com",
      sourceName: "Reuters",
      category: "আন্তর্জাতিক খবর",
      publishedAt: "এইমাত্র",
      sourceGroup: "international",
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

const TAB_LABELS: Record<SourceGroup, string> = {
  national: "জাতীয় পত্রিকা",
  online: "অনলাইন পোর্টাল",
  international: "আন্তর্জাতিক সংবাদ",
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
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
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
          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm max-w-[130px] truncate"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          title={item.sourceName}
        >
          {item.sourceName}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <h3
          className="text-sm font-bold leading-snug line-clamp-2 group-hover:opacity-80 transition-opacity"
          style={{ color: "#111827", minHeight: "2.5rem" }}
        >
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[11px]" style={{ color: "#6b7280" }}>
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
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
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
            data-ocid="external_news.close_button"
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
          style={{ borderBottom: "1px solid #e5e7eb" }}
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
            className="text-base font-bold leading-snug"
            style={{ color: "#111827" }}
          >
            {item.title}
          </h2>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#6b7280" }}
            >
              সারসংক্ষেপ
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              {item.summary}
            </p>
          </div>

          <div
            className="flex items-center justify-between pt-3 border-t flex-wrap gap-3"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div>
              <p className="text-xs" style={{ color: "#6b7280" }}>
                সূত্র:
                <span
                  className="font-semibold ml-1"
                  style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                >
                  {item.sourceName}
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                ক্যাটাগরি: {item.category} · {item.publishedAt}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs mt-1 block underline underline-offset-2 break-all"
                style={{ color: "#2563eb" }}
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

export function ExternalNewsSection({
  initialTab,
}: { initialTab?: "national" | "online" | "international" }) {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("এইমাত্র");
  const [activeTab, setActiveTab] = useState<SourceGroup>(
    initialTab ?? "national",
  );

  // Sync tab when initialTab prop changes (from nav click)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Auto-refresh every 6 hours
  useEffect(() => {
    const timer = setInterval(
      () => {
        setRefreshCount((c) => c + 1);
        setLastRefreshed("এইমাত্র");
      },
      6 * 60 * 60 * 1000,
    );
    return () => clearInterval(timer);
  }, []);

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

  // Filter by active tab
  const tabNews = allCurrentNews.filter((n) => n.sourceGroup === activeTab);

  const grouped = groupByCategory(tabNews);
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
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div
          className="w-1 h-7 rounded-sm shrink-0"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
        />
        <h2
          id="external-news-heading"
          className="text-base font-bold uppercase tracking-widest shrink-0"
          style={{ color: "#111827" }}
        >
          জাতীয় ও আন্তর্জাতিক সংবাদ
        </h2>
        <div
          className="flex-1 h-px min-w-[20px]"
          style={{ backgroundColor: "#e5e7eb" }}
        />
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs" style={{ color: "#6b7280" }}>
            শেষ আপডেট: <span style={{ color: "#374151" }}>{lastRefreshed}</span>
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

      {/* Source Group Tabs */}
      <div
        className="flex items-center gap-1 mb-6 p-1 rounded-lg w-full sm:w-auto"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        role="tablist"
        aria-label="সংবাদ উৎস গ্রুপ"
      >
        {(Object.keys(TAB_LABELS) as SourceGroup[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            data-ocid={`external_news.${tab}.tab`}
            onClick={() => setActiveTab(tab)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 whitespace-nowrap"
            style={
              activeTab === tab
                ? {
                    backgroundColor: "oklch(0.4764 0.2183 22.8)",
                    color: "#ffffff",
                  }
                : {
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                  }
            }
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <div
          data-ocid="external_news.loading_state"
          className="flex items-center justify-center gap-2 py-6 rounded mb-4"
          style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        >
          <RefreshCw
            size={16}
            className="animate-spin"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          />
          <span className="text-sm" style={{ color: "#6b7280" }}>
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
                    className="text-sm font-bold uppercase tracking-widest shrink-0"
                    style={{ color: "#111827" }}
                  >
                    {category}
                  </h3>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#e5e7eb" }}
                  />
                  <span className="text-xs" style={{ color: "#6b7280" }}>
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
