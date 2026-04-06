import { createContext, useContext, useEffect, useState } from "react";

export interface Journalist {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  handle: string;
}

export interface SiteSettings {
  // Site Info
  siteName: string;
  tagline: string;
  email: string;
  address: string;
  editorName: string;
  aboutText: string;
  phone: string;
  establishedYear: string;
  // Logo
  logoBase64: string;
  // Journalists
  journalists: Journalist[];
  // Social Media
  socialLinks: SocialLink[];
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "বালীগাঁও নিউজ",
  tagline: "Voice of Truth & Freedom",
  email: "baligawnews@gmail.com",
  address: "বালিগাঁও, লাখাই, হবিগঞ্জ",
  editorName: "এম.ডি ব্রাইট",
  aboutText:
    "বালীগাঁও নিউজ বালিগাঁও, লাখাই, হবিগঞ্জ-এর একটি নির্ভরযোগ্য স্থানীয় সংবাদ মাধ্যম। আমরা প্রতিদিন সর্বশেষ, নিরপেক্ষ ও তথ্যভিত্তিক সংবাদ পরিবেশন করে থাকি।",
  phone: "",
  establishedYear: "",
  logoBase64: "",
  journalists: [],
  socialLinks: [
    {
      id: "1",
      platform: "Facebook",
      url: "https://facebook.com/baligawnews",
      handle: "@baligawnews",
    },
    {
      id: "2",
      platform: "X",
      url: "https://x.com/baligawnews",
      handle: "@baligawnews",
    },
    {
      id: "3",
      platform: "YouTube",
      url: "https://youtube.com/@baligawnews",
      handle: "বালীগাঁও নিউজ",
    },
    {
      id: "4",
      platform: "Instagram",
      url: "https://instagram.com/baligawnews",
      handle: "@baligawnews",
    },
  ],
};

const STORAGE_KEY = "baligaon_site_settings";

function loadFromStorage(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveToStorage(settings: SiteSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently ignore storage errors
  }
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(loadFromStorage);

  useEffect(() => {
    saveToStorage(settings);
  }, [settings]);

  const updateSettings = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
