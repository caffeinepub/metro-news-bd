import {
  Menu,
  Monitor,
  PenSquare,
  Search,
  Settings,
  Smartphone,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "../context/SiteSettingsContext";

const navLinks = [
  { label: "হোম", href: "#home" },
  { label: "স্থানীয় খবর", href: "#local-news" },
  { label: "জাতীয় খবর", href: "#national" },
  { label: "আন্তর্জাতিক খবর", href: "#international" },
  { label: "শিক্ষা", href: "#education" },
  { label: "স্বাস্থ্য", href: "#health" },
  { label: "কৃষি", href: "#agriculture" },
  { label: "খেলাধুলা", href: "#sports" },
  { label: "ধর্মীয় অনুষ্ঠান", href: "#religion" },
  { label: "ফিচার স্টোরি", href: "#feature" },
  { label: "মাল্টিমিডিয়া", href: "#multimedia" },
  { label: "আবহাওয়া", href: "#weather" },
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "যোগাযোগ", href: "#contact" },
];

interface HeaderProps {
  onPostClick?: () => void;
  onSettingsClick?: () => void;
  previewMode?: "desktop" | "mobile";
  onPreviewChange?: (mode: "desktop" | "mobile") => void;
}

function IconBtn({
  onClick,
  ariaLabel,
  children,
  ocid,
}: {
  onClick?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  ocid?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-2 rounded-md transition-colors"
      style={{
        color: "#6b7280",
        backgroundColor: hovered ? "#f3f4f6" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

export function Header({
  onPostClick,
  onSettingsClick,
  previewMode = "desktop",
  onPreviewChange,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("হোম");
  const [searchFocused, setSearchFocused] = useState(false);
  const { settings } = useSiteSettings();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* Main header row */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div
          className="flex items-center justify-between gap-4"
          style={{ height: 64 }}
        >
          {/* === LEFT: Logo + Site Name + Tagline === */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Logo box */}
            <div
              className="flex items-center justify-center shrink-0 rounded-md overflow-hidden"
              style={{
                width: 44,
                height: 44,
                border: "2px solid #dc2626",
                background: "#fef2f2",
              }}
            >
              {settings.logoBase64 ? (
                <img
                  src={settings.logoBase64}
                  alt={settings.siteName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-bold select-none"
                  style={{
                    color: "#dc2626",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  বা
                </span>
              )}
            </div>

            {/* Site name + tagline */}
            <div className="leading-tight min-w-0">
              <div
                className="font-bold truncate"
                style={{
                  color: "#111827",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  letterSpacing: "0.03em",
                }}
              >
                {settings.siteName}
              </div>
              <div
                className="hidden sm:block text-xs uppercase truncate"
                style={{
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {settings.tagline}
              </div>
            </div>
          </div>

          {/* === CENTER: accent rule (desktop) === */}
          <div
            className="hidden lg:block flex-1 mx-4 h-px"
            style={{ backgroundColor: "#f3f4f6" }}
          />

          {/* === RIGHT: Action buttons === */}
          <div className="flex items-center gap-1 shrink-0">
            <IconBtn
              ocid="header.search_input"
              ariaLabel="সার্চ"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} />
            </IconBtn>

            <IconBtn
              ocid="header.settings.button"
              ariaLabel="সেটিংস"
              onClick={onSettingsClick}
            >
              <Settings size={18} />
            </IconBtn>

            {/* Post News button — desktop */}
            {onPostClick && (
              <PostBtn
                onClick={onPostClick}
                ocid="header.post_news.button"
                className="hidden sm:inline-flex"
              />
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              data-ocid="header.mobile_menu.toggle"
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: "#374151" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="মেনু"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Desktop Nav Bar ===== */}
      <div
        className="hidden lg:block border-t"
        style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
      >
        <nav
          className="max-w-[1200px] mx-auto px-4 sm:px-6"
          aria-label="Primary navigation"
        >
          <div className="flex items-center">
            {/* Nav links */}
            <div className="flex items-center flex-1 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = activeNav === link.label;
                return (
                  <NavLink
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    isActive={isActive}
                    onClick={() => setActiveNav(link.label)}
                  />
                );
              })}
            </div>

            {/* Device Preview Switch — right end of nav bar */}
            {onPreviewChange && (
              <div
                className="flex items-center gap-1 ml-2 pl-3 shrink-0"
                style={{ borderLeft: "1px solid #e5e7eb" }}
                data-ocid="header.preview_switch.toggle"
                aria-label="ডিভাইস ভিউ সুইচ"
              >
                <button
                  type="button"
                  data-ocid="header.preview_mobile.button"
                  aria-label="মোবাইল ভিউ"
                  title="মোবাইল ভিউ"
                  onClick={() => onPreviewChange("mobile")}
                  className="p-1.5 rounded transition-all duration-200"
                  style={{
                    backgroundColor:
                      previewMode === "mobile" ? "#dc2626" : "#f3f4f6",
                    color: previewMode === "mobile" ? "#ffffff" : "#6b7280",
                  }}
                >
                  <Smartphone size={15} />
                </button>
                <button
                  type="button"
                  data-ocid="header.preview_desktop.button"
                  aria-label="ডেস্কটপ ভিউ"
                  title="ডেস্কটপ ভিউ"
                  onClick={() => onPreviewChange("desktop")}
                  className="p-1.5 rounded transition-all duration-200"
                  style={{
                    backgroundColor:
                      previewMode === "desktop" ? "#dc2626" : "#f3f4f6",
                    color: previewMode === "desktop" ? "#ffffff" : "#6b7280",
                  }}
                >
                  <Monitor size={15} />
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ===== Search Bar ===== */}
      {searchOpen && (
        <div
          className="border-t"
          style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="text"
                placeholder="খবর খুঁজুন..."
                className="w-full border rounded-md pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: searchFocused ? "#dc2626" : "#d1d5db",
                  color: "#111827",
                }}
                data-ocid="header.search_field.input"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== Mobile Nav Drawer ===== */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden border-t"
          style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
          aria-label="Mobile navigation"
        >
          {/* tagline visible on mobile */}
          <div
            className="px-5 pt-3 pb-1 text-xs uppercase sm:hidden"
            style={{
              color: "#9ca3af",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
          >
            {settings.tagline}
          </div>

          <div className="max-w-[1200px] mx-auto px-3 pb-4 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid={`mobile.nav.${link.label}.link`}
                  onClick={() => {
                    setActiveNav(link.label);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
                  style={{
                    color: isActive ? "#dc2626" : "#374151",
                    backgroundColor: isActive ? "#fef2f2" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="my-2 h-px" style={{ backgroundColor: "#f3f4f6" }} />

            {onSettingsClick && (
              <button
                type="button"
                data-ocid="mobile.settings.button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSettingsClick();
                }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
                style={{ color: "#6b7280" }}
              >
                <Settings size={15} />
                সেটিংস
              </button>
            )}

            {onPostClick && (
              <PostBtn
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPostClick();
                }}
                ocid="mobile.post_news.button"
                className="w-full justify-center mt-1"
                label="সংবাদ পোস্ট করুন"
              />
            )}

            {/* Device Preview Switch — visible in mobile drawer */}
            {onPreviewChange && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 mt-1"
                data-ocid="mobile.preview_switch.toggle"
              >
                <span style={{ color: "#6b7280", fontSize: 12 }}>ভিউ:</span>
                <button
                  type="button"
                  data-ocid="mobile.preview_mobile.button"
                  aria-label="মোবাইল ভিউ"
                  title="মোবাইল ভিউ"
                  onClick={() => onPreviewChange("mobile")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-200"
                  style={{
                    backgroundColor:
                      previewMode === "mobile" ? "#dc2626" : "#f3f4f6",
                    color: previewMode === "mobile" ? "#ffffff" : "#6b7280",
                    border:
                      previewMode === "mobile"
                        ? "1px solid #dc2626"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <Smartphone size={13} />
                  <span>মোবাইল</span>
                </button>
                <button
                  type="button"
                  data-ocid="mobile.preview_desktop.button"
                  aria-label="ডেস্কটপ ভিউ"
                  title="ডেস্কটপ ভিউ"
                  onClick={() => onPreviewChange("desktop")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-200"
                  style={{
                    backgroundColor:
                      previewMode === "desktop" ? "#dc2626" : "#f3f4f6",
                    color: previewMode === "desktop" ? "#ffffff" : "#6b7280",
                    border:
                      previewMode === "desktop"
                        ? "1px solid #dc2626"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <Monitor size={13} />
                  <span>ডেস্কটপ</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

// ---- Small sub-components to avoid inline handler assignments ----

function NavLink({
  label,
  href,
  isActive,
  onClick,
}: {
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      data-ocid={`nav.${label}.link`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-3 py-3 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2"
      style={{
        color: isActive ? "#dc2626" : hovered ? "#111827" : "#374151",
        borderBottomColor: isActive ? "#dc2626" : "transparent",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </a>
  );
}

function PostBtn({
  onClick,
  ocid,
  className = "",
  label = "সংবাদ পোস্ট",
}: {
  onClick: () => void;
  ocid?: string;
  className?: string;
  label?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${className}`}
      style={{
        border: "1.5px solid #dc2626",
        color: hovered ? "#fff" : "#dc2626",
        backgroundColor: hovered ? "#dc2626" : "transparent",
      }}
    >
      <PenSquare size={13} />
      {label}
    </button>
  );
}
