import { Globe, Mail, MapPin, Phone, User } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { useSiteSettings } from "../context/SiteSettingsContext";

const sectionLinks = [
  { label: "স্থানীয়", href: "#local-news" },
  { label: "জাতীয়", href: "#external-news-section" },
  { label: "বিশ্ব", href: "#external-news-section" },
  { label: "রাজনীতি", href: "#external-news-section" },
  { label: "ব্যবসা", href: "#external-news-section" },
  { label: "খেলাধুলা", href: "#external-news-section" },
  { label: "বিনোদন", href: "#external-news-section" },
  { label: "মতামত", href: "#external-news-section" },
];

const quickLinks = [
  { label: "যোগাযোগ", href: "#contact-section" },
  { label: "আমাদের সম্পর্কে", href: "#about-section" },
  { label: "বিজ্ঞাপন দিন", href: "#advertise-section" },
  { label: "গোপনীয়তা নীতি", href: "#privacy-section" },
  { label: "শর্তাবলী", href: "#terms-section" },
];

function scrollToSection(href: string) {
  const id = href.startsWith("#") ? href.slice(1) : href;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "facebook") return <SiFacebook size={16} />;
  if (p === "youtube") return <SiYoutube size={16} />;
  if (p === "x" || p === "twitter") return <SiX size={14} />;
  if (p === "instagram") return <SiInstagram size={16} />;
  if (p === "tiktok") return <SiTiktok size={16} />;
  if (p === "linkedin") return <Globe size={16} />;
  if (p === "whatsapp") return <SiWhatsapp size={16} />;
  if (p === "telegram") return <SiTelegram size={16} />;
  if (p === "pinterest") return <SiPinterest size={16} />;
  return <Globe size={16} />;
}

function getPlatformColor(platform: string): string {
  const p = platform.toLowerCase();
  if (p === "facebook") return "#1877f2";
  if (p === "youtube") return "#ff0000";
  if (p === "x" || p === "twitter") return "#000000";
  if (p === "instagram") return "#e1306c";
  if (p === "tiktok") return "#010101";
  if (p === "linkedin") return "#0a66c2";
  if (p === "whatsapp") return "#25d366";
  if (p === "telegram") return "#229ed9";
  if (p === "pinterest") return "#bd081c";
  return "#dc2626";
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const { settings } = useSiteSettings();

  return (
    <footer
      className="w-full mt-12"
      style={{
        background: "linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
        borderTop: "3px solid #dc2626",
      }}
    >
      {/* Top decorative accent bar */}
      <div
        className="w-full h-0.5"
        style={{
          background:
            "linear-gradient(to right, #dc2626, #1d4ed8, #d97706, #dc2626)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* === Column 1: Branding + Contact === */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo + Site name */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 42,
                  height: 42,
                }}
              >
                {settings.logoBase64 ? (
                  <img
                    src={settings.logoBase64}
                    alt={settings.siteName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span
                    className="font-bold select-none"
                    style={{ color: "#dc2626", fontSize: 18, lineHeight: 1 }}
                  >
                    বা
                  </span>
                )}
              </div>
              <div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: "1.05rem", letterSpacing: "0.04em" }}
                >
                  {settings.siteName}
                </div>
                <div
                  className="text-xs uppercase"
                  style={{
                    color: "#d97706",
                    letterSpacing: "0.1em",
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                >
                  {settings.tagline || "Voice of Truth & Freedom"}
                </div>
              </div>
            </div>

            {settings.aboutText && (
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ color: "#9ca3af" }}
              >
                {settings.aboutText}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-col gap-2 mt-2">
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  style={{ color: "#9ca3af" }}
                >
                  <Mail size={12} className="shrink-0" />
                  <span className="text-xs">{settings.email}</span>
                </a>
              )}
              {settings.phone && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9ca3af" }}
                >
                  <Phone size={12} className="shrink-0" />
                  <span className="text-xs">{settings.phone}</span>
                </div>
              )}
              {settings.address && (
                <div
                  className="flex items-start gap-2"
                  style={{ color: "#9ca3af" }}
                >
                  <MapPin size={12} className="shrink-0 mt-0.5" />
                  <span className="text-xs">{settings.address}</span>
                </div>
              )}
              {settings.editorName && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9ca3af" }}
                >
                  <User size={12} className="shrink-0" />
                  <span className="text-xs">সম্পাদক: {settings.editorName}</span>
                </div>
              )}
              {settings.establishedYear && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#6b7280" }}
                >
                  <span className="text-xs">
                    প্রতিষ্ঠা: {settings.establishedYear}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* === Column 2: বিভাগ === */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#d97706" }}
            >
              বিভাগ
            </h3>
            <ul className="space-y-2">
              {sectionLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-ocid="footer.section.link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="text-xs transition-colors hover:text-white flex items-center gap-1.5 group cursor-pointer"
                    style={{ color: "#9ca3af" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 group-hover:bg-red-500 transition-colors"
                      style={{ backgroundColor: "#4b5563" }}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* === Column 3: দ্রুত লিংক (5 legal/info links) === */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#d97706" }}
            >
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-ocid="footer.quick.link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="text-xs transition-colors hover:text-white flex items-center gap-1.5 group cursor-pointer"
                    style={{ color: "#9ca3af" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 group-hover:bg-red-500 transition-colors"
                      style={{ backgroundColor: "#4b5563" }}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* === Column 4: সোশ্যাল মিডিয়া (icon-only circular buttons) === */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#d97706" }}
            >
              সোশ্যাল মিডিয়া
            </h3>
            {settings.socialLinks.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {settings.socialLinks.map((link, idx) => (
                    <a
                      key={link.id}
                      href={link.url}
                      data-ocid={`footer.social.link.${idx + 1}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      title={link.platform}
                      className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
                      style={{
                        width: 38,
                        height: 38,
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #2d2d2d",
                        color: "#9ca3af",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.backgroundColor = getPlatformColor(
                          link.platform,
                        );
                        el.style.color = "#ffffff";
                        el.style.border = `1px solid ${getPlatformColor(link.platform)}`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.backgroundColor = "#1f1f1f";
                        el.style.color = "#9ca3af";
                        el.style.border = "1px solid #2d2d2d";
                      }}
                    >
                      {getPlatformIcon(link.platform)}
                    </a>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "#6b7280" }}>
                  আমাদের সাথে যুক্ত থাকুন
                </p>
              </>
            ) : (
              <p className="text-xs" style={{ color: "#6b7280" }}>
                কোনো সোশ্যাল মিডিয়া যোগ করা হয়নি
              </p>
            )}
          </div>
        </div>

        {/* === Journalists section === */}
        {settings.journalists.length > 0 && (
          <div
            className="mt-10 pt-6"
            style={{ borderTop: "1px solid #1f1f1f" }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#d97706" }}
            >
              আমাদের সাংবাদিক দল
            </h3>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {settings.journalists.map((j) => (
                <div key={j.id} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-white">
                    {j.name}
                  </span>
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    {j.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === Bottom bar === */}
        <div className="mt-10 pt-5" style={{ borderTop: "1px solid #1f1f1f" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: copyright */}
            <p className="text-xs" style={{ color: "#6b7280" }}>
              © {currentYear} {settings.siteName}। সকল স্বত্ব সংরক্ষিত।
            </p>

            {/* Center: inline legal links */}
            <div
              className="flex items-center flex-wrap justify-center gap-1 text-xs"
              style={{ color: "#6b7280" }}
            >
              <button
                type="button"
                data-ocid="footer.bottom.contact.link"
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs"
                style={{ color: "#6b7280" }}
                onClick={() => scrollToSection("#contact-section")}
              >
                যোগাযোগ
              </button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                data-ocid="footer.bottom.privacy.link"
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs"
                style={{ color: "#6b7280" }}
                onClick={() => scrollToSection("#privacy-section")}
              >
                গোপনীয়তা নীতি
              </button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                data-ocid="footer.bottom.terms.link"
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs"
                style={{ color: "#6b7280" }}
                onClick={() => scrollToSection("#terms-section")}
              >
                শর্তাবলী
              </button>
            </div>

            {/* Right: caffeine attribution */}
            <p className="text-xs" style={{ color: "#6b7280" }}>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#d97706" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
