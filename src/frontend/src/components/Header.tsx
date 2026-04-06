import { Menu, Search, Tv, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "হোম", href: "#home" },
  { label: "স্থানীয় খবর", href: "#local" },
  { label: "জাতীয় খবর", href: "#national" },
  { label: "আন্তর্জাতিক খবর", href: "#international" },
  { label: "শিক্ষা", href: "#education" },
  { label: "স্বাস্থ্য", href: "#health" },
  { label: "কৃষি", href: "#agriculture" },
  { label: "খেলাধুলা", href: "#sports" },
  { label: "ধর্মীয় অনুষ্ঠান", href: "#religion" },
  { label: "ফিচার স্টোরি", href: "#feature" },
  { label: "মাল্টিমিডিয়া", href: "#multimedia" },
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "যোগাযোগ", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("হোম");

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "#050505", borderBottom: "1px solid #2d2d2d" }}
    >
      {/* Main header row */}
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex items-center justify-center w-10 h-10 rounded font-bold text-xl"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d" }}
          >
            <span className="text-white">ম</span>
            <span className="news-red">ন</span>
          </div>
          <div className="leading-tight">
            <div className="text-white font-bold text-lg tracking-widest uppercase">
              মেট্রো নিউজ
            </div>
            <div
              className="text-xs tracking-wider uppercase"
              style={{ color: "#9c9c9c" }}
            >
              সত্যের সন্ধানে, সংবাদের পথে
            </div>
          </div>
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live TV */}
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide"
            style={{ color: "#9c9c9c" }}
          >
            <Tv size={13} />
            <span>লাইভ টিভি</span>
          </div>

          {/* Search */}
          <button
            type="button"
            data-ocid="header.search_input"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded"
            aria-label="সার্চ করুন"
          >
            <Search size={18} />
          </button>

          {/* Subscribe */}
          <button
            type="button"
            data-ocid="header.subscribe.button"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          >
            সাবস্ক্রাইব
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            data-ocid="header.mobile_menu.toggle"
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="মেনু"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Nav Bar (full-width below logo row) */}
      <div
        className="hidden lg:block border-t w-full"
        style={{ backgroundColor: "#0d0d0d", borderColor: "#2d2d2d" }}
      >
        <nav
          className="max-w-[1200px] mx-auto px-4"
          aria-label="Primary navigation"
        >
          <div className="flex items-center flex-wrap">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label}.link`}
                onClick={() => setActiveNav(link.label)}
                className={`px-3 py-3 text-[12px] font-medium tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                  activeNav === link.label
                    ? "text-white"
                    : "text-gray-400 hover:text-white border-transparent"
                }`}
                style={
                  activeNav === link.label
                    ? {
                        borderBottomColor: "oklch(0.4764 0.2183 22.8)",
                        color: "oklch(0.4764 0.2183 22.8)",
                      }
                    : { borderBottomColor: "transparent" }
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div
          className="border-t"
          style={{ backgroundColor: "#0a0a0a", borderColor: "#2d2d2d" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 py-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="খবর খুঁজুন..."
                className="w-full bg-transparent border rounded pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                style={{ borderColor: "#2d2d2d" }}
                data-ocid="header.search_input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden border-t"
          style={{ backgroundColor: "#0a0a0a", borderColor: "#2d2d2d" }}
          aria-label="Mobile navigation"
        >
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`mobile.nav.${link.label}.link`}
                onClick={() => {
                  setActiveNav(link.label);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 text-sm font-medium tracking-wide rounded transition-colors ${
                  activeNav === link.label
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                style={
                  activeNav === link.label
                    ? {
                        backgroundColor: "oklch(0.4764 0.2183 22.8 / 0.2)",
                        color: "oklch(0.4764 0.2183 22.8)",
                      }
                    : {}
                }
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              data-ocid="mobile.subscribe.button"
              className="mt-2 text-center px-3 py-2.5 text-sm font-bold uppercase tracking-widest text-white rounded hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            >
              সাবস্ক্রাইব
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
