import { Mail, MapPin, User } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

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

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

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
                className="flex items-center justify-center w-8 h-8 rounded font-bold text-base"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2d2d2d",
                }}
              >
                <span className="text-white">বা</span>
                <span className="news-red">নি</span>
              </div>
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                বালীগাঁও নিউজ
              </span>
            </div>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: "#9c9c9c" }}
            >
              বালীগাঁও নিউজ বালিগাঁও, লাখাই, হবিগঞ্জ-এর একটি নির্ভরযোগ্য স্থানীয় সংবাদ মাধ্যম।
              আমরা প্রতিদিন সর্বশেষ, নিরপেক্ষ ও তথ্যভিত্তিক সংবাদ পরিবেশন করে থাকি।
            </p>
            {/* Contact Info */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2"
                style={{ color: "#9c9c9c" }}
              >
                <Mail size={12} className="shrink-0" />
                <span className="text-xs">baligawnews@gmail.com</span>
              </div>
              <div
                className="flex items-start gap-2"
                style={{ color: "#9c9c9c" }}
              >
                <MapPin size={12} className="shrink-0 mt-0.5" />
                <span className="text-xs">বালিগাঁও, লাখাই, হবিগঞ্জ</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: "#9c9c9c" }}
              >
                <User size={12} className="shrink-0" />
                <span className="text-xs">সম্পাদক: এম.ডি ব্রাইট</span>
              </div>
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
              <a
                href="https://facebook.com/baligawnews"
                data-ocid="footer.facebook.link"
                className="flex items-center gap-2.5 text-xs transition-colors group"
                style={{ color: "#9c9c9c" }}
                aria-label="Facebook"
              >
                <SiFacebook
                  size={16}
                  className="group-hover:text-white transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  @baligawnews
                </span>
              </a>
              <a
                href="https://x.com/baligawnews"
                data-ocid="footer.twitter.link"
                className="flex items-center gap-2.5 text-xs transition-colors group"
                style={{ color: "#9c9c9c" }}
                aria-label="X (Twitter)"
              >
                <SiX
                  size={14}
                  className="group-hover:text-white transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  @baligawnews
                </span>
              </a>
              <a
                href="https://youtube.com/@baligawnews"
                data-ocid="footer.youtube.link"
                className="flex items-center gap-2.5 text-xs transition-colors group"
                style={{ color: "#9c9c9c" }}
                aria-label="YouTube"
              >
                <SiYoutube
                  size={16}
                  className="group-hover:text-white transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  বালীগাঁও নিউজ
                </span>
              </a>
              <a
                href="https://instagram.com/baligawnews"
                data-ocid="footer.instagram.link"
                className="flex items-center gap-2.5 text-xs transition-colors group"
                style={{ color: "#9c9c9c" }}
                aria-label="Instagram"
              >
                <SiInstagram
                  size={16}
                  className="group-hover:text-white transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  @baligawnews
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid #2d2d2d", color: "#6b6b6b" }}
        >
          <p>© {currentYear} বালীগাঁও নিউজ। সকল স্বত্ব সংরক্ষিত।</p>
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
