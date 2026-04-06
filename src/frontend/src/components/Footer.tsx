import { Globe, Mail, MapPin, Phone, User } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiPinterest,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { useSiteSettings } from "../context/SiteSettingsContext";

const sectionLinks = [
  "স্থানীয়",
  "জাতীয়",
  "বিশ্ব",
  "রাজনীতি",
  "ব্যবসা",
  "খেলাধুলা",
  "বিনোদন",
  "মতামত",
];

const resourceLinks = [
  "আমাদের সম্পর্কে",
  "যোগাযোগ",
  "বিজ্ঞাপন দিন",
  "গোপনীয়তা নীতি",
  "শর্তাবলী",
  "আর্কাইভ",
];

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "facebook") return <SiFacebook size={16} />;
  if (p === "youtube") return <SiYoutube size={16} />;
  if (p === "x" || p === "twitter") return <SiX size={14} />;
  if (p === "instagram") return <SiInstagram size={16} />;
  if (p === "tiktok") return <SiTiktok size={16} />;
  if (p === "linkedin") return <SiLinkedin size={16} />;
  if (p === "whatsapp") return <SiWhatsapp size={16} />;
  if (p === "telegram") return <SiTelegram size={16} />;
  if (p === "pinterest") return <SiPinterest size={16} />;
  return <Globe size={16} />;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const { settings } = useSiteSettings();

  return (
    <footer
      className="w-full mt-12"
      style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #2d2d2d" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex items-center justify-center w-8 h-8 rounded overflow-hidden font-bold text-base"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2d2d2d",
                }}
              >
                {settings.logoBase64 ? (
                  <img
                    src={settings.logoBase64}
                    alt={settings.siteName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <span className="text-white">বা</span>
                    <span className="news-red">নি</span>
                  </>
                )}
              </div>
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                {settings.siteName}
              </span>
            </div>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: "#9c9c9c" }}
            >
              {settings.aboutText}
            </p>
            {/* Contact Info */}
            <div className="flex flex-col gap-2">
              {settings.email && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9c9c9c" }}
                >
                  <Mail size={12} className="shrink-0" />
                  <span className="text-xs">{settings.email}</span>
                </div>
              )}
              {settings.phone && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9c9c9c" }}
                >
                  <Phone size={12} className="shrink-0" />
                  <span className="text-xs">{settings.phone}</span>
                </div>
              )}
              {settings.address && (
                <div
                  className="flex items-start gap-2"
                  style={{ color: "#9c9c9c" }}
                >
                  <MapPin size={12} className="shrink-0 mt-0.5" />
                  <span className="text-xs">{settings.address}</span>
                </div>
              )}
              {settings.editorName && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9c9c9c" }}
                >
                  <User size={12} className="shrink-0" />
                  <span className="text-xs">সম্পাদক: {settings.editorName}</span>
                </div>
              )}
              {settings.establishedYear && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#9c9c9c" }}
                >
                  <span className="text-xs">
                    প্রতিষ্ঠা: {settings.establishedYear}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sections column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              বিভাগ
            </h3>
            <ul className="space-y-2">
              {sectionLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#content"
                    className="text-xs transition-colors hover:text-white"
                    style={{ color: "#9c9c9c" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              রিসোর্স
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#content"
                    className="text-xs transition-colors hover:text-white"
                    style={{ color: "#9c9c9c" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social media column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              সোশ্যাল মিডিয়া
            </h3>
            <div className="flex flex-col gap-3">
              {settings.socialLinks.map((link, idx) => (
                <a
                  key={link.id}
                  href={link.url}
                  data-ocid={`footer.social.link.${idx + 1}`}
                  className="flex items-center gap-2.5 text-xs transition-colors group"
                  style={{ color: "#9c9c9c" }}
                  aria-label={link.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="group-hover:text-white transition-colors">
                    {getPlatformIcon(link.platform)}
                  </span>
                  <span className="group-hover:text-white transition-colors">
                    {link.handle || link.platform}
                  </span>
                </a>
              ))}
              {settings.socialLinks.length === 0 && (
                <p className="text-xs" style={{ color: "#6b6b6b" }}>
                  কোনো সোশ্যাল মিডিয়া যোগ করা হয়নি
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Journalists section if any */}
        {settings.journalists.length > 0 && (
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid #2d2d2d" }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              আমাদের সাংবাদিক দল
            </h3>
            <div className="flex flex-wrap gap-4">
              {settings.journalists.map((j) => (
                <div key={j.id} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-white">
                    {j.name}
                  </span>
                  <span className="text-xs" style={{ color: "#6b6b6b" }}>
                    {j.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid #2d2d2d", color: "#6b6b6b" }}
        >
          <p>
            © {currentYear} {settings.siteName}। সকল স্বত্ব সংরক্ষিত।
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
