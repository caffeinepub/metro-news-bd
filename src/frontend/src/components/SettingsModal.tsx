import { Globe, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
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
import type { Journalist, SocialLink } from "../context/SiteSettingsContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const JOURNALIST_ROLES = [
  "সম্পাদক",
  "সহ-সম্পাদক",
  "প্রতিবেদক",
  "ফটোগ্রাফার",
  "ক্যামেরাম্যান",
  "বিজ্ঞাপন ব্যবস্থাপক",
];

const SOCIAL_PLATFORMS = [
  "Facebook",
  "YouTube",
  "X",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "WhatsApp",
  "Telegram",
  "Pinterest",
  "Other",
];

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "facebook") return <SiFacebook size={14} />;
  if (p === "youtube") return <SiYoutube size={14} />;
  if (p === "x" || p === "twitter") return <SiX size={13} />;
  if (p === "instagram") return <SiInstagram size={14} />;
  if (p === "tiktok") return <SiTiktok size={14} />;
  if (p === "linkedin") return <SiLinkedin size={14} />;
  if (p === "whatsapp") return <SiWhatsapp size={14} />;
  if (p === "telegram") return <SiTelegram size={14} />;
  if (p === "pinterest") return <SiPinterest size={14} />;
  return <Globe size={14} />;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2d2d2d",
  color: "white",
} as const;

const lbl =
  "text-xs font-bold uppercase tracking-widest text-[#9c9c9c] mb-1 block";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<
    "site" | "logo" | "journalists" | "social"
  >("site");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState({ ...settings });

  // Journalist form state
  const [showJournalistForm, setShowJournalistForm] = useState(false);
  const [editingJournalistId, setEditingJournalistId] = useState<string | null>(
    null,
  );
  const [journalistForm, setJournalistForm] = useState<Omit<Journalist, "id">>({
    name: "",
    email: "",
    role: JOURNALIST_ROLES[0],
    phone: "",
  });

  // Social form state
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState<Omit<SocialLink, "id">>({
    platform: "Facebook",
    url: "",
    handle: "",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setLocalSettings({ ...settings });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalSettings((prev) => ({
        ...prev,
        logoBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Journalist operations
  const startAddJournalist = () => {
    setEditingJournalistId(null);
    setJournalistForm({
      name: "",
      email: "",
      role: JOURNALIST_ROLES[0],
      phone: "",
    });
    setShowJournalistForm(true);
  };

  const startEditJournalist = (j: Journalist) => {
    setEditingJournalistId(j.id);
    setJournalistForm({
      name: j.name,
      email: j.email,
      role: j.role,
      phone: j.phone,
    });
    setShowJournalistForm(true);
  };

  const saveJournalist = () => {
    if (!journalistForm.name.trim()) return;
    if (editingJournalistId) {
      setLocalSettings((prev) => ({
        ...prev,
        journalists: prev.journalists.map((j) =>
          j.id === editingJournalistId ? { id: j.id, ...journalistForm } : j,
        ),
      }));
    } else {
      const newId = crypto.randomUUID();
      setLocalSettings((prev) => ({
        ...prev,
        journalists: [...prev.journalists, { id: newId, ...journalistForm }],
      }));
    }
    setShowJournalistForm(false);
    setEditingJournalistId(null);
  };

  const deleteJournalist = (id: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      journalists: prev.journalists.filter((j) => j.id !== id),
    }));
  };

  // Social operations
  const startAddSocial = () => {
    setEditingSocialId(null);
    setSocialForm({ platform: "Facebook", url: "", handle: "" });
    setShowSocialForm(true);
  };

  const startEditSocial = (s: SocialLink) => {
    setEditingSocialId(s.id);
    setSocialForm({ platform: s.platform, url: s.url, handle: s.handle });
    setShowSocialForm(true);
  };

  const saveSocial = () => {
    if (!socialForm.url.trim()) return;
    if (editingSocialId) {
      setLocalSettings((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((s) =>
          s.id === editingSocialId ? { id: s.id, ...socialForm } : s,
        ),
      }));
    } else {
      const newId = crypto.randomUUID();
      setLocalSettings((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { id: newId, ...socialForm }],
      }));
    }
    setShowSocialForm(false);
    setEditingSocialId(null);
  };

  const deleteSocial = (id: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((s) => s.id !== id),
    }));
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: "site", label: "সাইটের তথ্য" },
    { id: "logo", label: "লোগো" },
    { id: "journalists", label: "সাংবাদিক" },
    { id: "social", label: "সোশ্যাল মিডিয়া" },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      data-ocid="settings.modal"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl my-8 rounded-lg shadow-2xl"
        style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#2d2d2d" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-6 rounded-sm"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            />
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">
              সেটিংস
            </h2>
          </div>
          <button
            type="button"
            data-ocid="settings.close_button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b overflow-x-auto"
          style={{ borderColor: "#2d2d2d" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`settings.${tab.id}.tab`}
              onClick={() => handleTabChange(tab.id)}
              className="px-5 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2"
              style={{
                color:
                  activeTab === tab.id
                    ? "oklch(0.4764 0.2183 22.8)"
                    : "#9c9c9c",
                borderBottomColor:
                  activeTab === tab.id
                    ? "oklch(0.4764 0.2183 22.8)"
                    : "transparent",
                backgroundColor: "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-6 py-5 min-h-[300px]">
          {/* Tab 1: Site Info */}
          {activeTab === "site" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="s-sitename" className={lbl}>
                    সাইটের নাম
                  </label>
                  <input
                    id="s-sitename"
                    type="text"
                    data-ocid="settings.site_name.input"
                    value={localSettings.siteName}
                    onChange={(e) =>
                      setLocalSettings((p) => ({
                        ...p,
                        siteName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="সাইটের নাম"
                  />
                </div>
                <div>
                  <label htmlFor="s-tagline" className={lbl}>
                    ট্যাগলাইন
                  </label>
                  <input
                    id="s-tagline"
                    type="text"
                    data-ocid="settings.tagline.input"
                    value={localSettings.tagline}
                    onChange={(e) =>
                      setLocalSettings((p) => ({
                        ...p,
                        tagline: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="ট্যাগলাইন"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="s-email" className={lbl}>
                    ইমেইল
                  </label>
                  <input
                    id="s-email"
                    type="email"
                    data-ocid="settings.email.input"
                    value={localSettings.email}
                    onChange={(e) =>
                      setLocalSettings((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label htmlFor="s-phone" className={lbl}>
                    ফোন নম্বর
                  </label>
                  <input
                    id="s-phone"
                    type="tel"
                    data-ocid="settings.phone.input"
                    value={localSettings.phone}
                    onChange={(e) =>
                      setLocalSettings((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="s-address" className={lbl}>
                  ঠিকানা
                </label>
                <textarea
                  id="s-address"
                  data-ocid="settings.address.textarea"
                  value={localSettings.address}
                  onChange={(e) =>
                    setLocalSettings((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none resize-none"
                  style={inputStyle}
                  placeholder="সম্পূর্ণ ঠিকানা"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="s-editor" className={lbl}>
                    সম্পাদকের নাম
                  </label>
                  <input
                    id="s-editor"
                    type="text"
                    data-ocid="settings.editor_name.input"
                    value={localSettings.editorName}
                    onChange={(e) =>
                      setLocalSettings((p) => ({
                        ...p,
                        editorName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="সম্পাদকের নাম"
                  />
                </div>
                <div>
                  <label htmlFor="s-year" className={lbl}>
                    প্রতিষ্ঠার বছর
                  </label>
                  <input
                    id="s-year"
                    type="text"
                    data-ocid="settings.established_year.input"
                    value={localSettings.establishedYear}
                    onChange={(e) =>
                      setLocalSettings((p) => ({
                        ...p,
                        establishedYear: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                    placeholder="যেমন: ২০২০"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="s-about" className={lbl}>
                  আমাদের সম্পর্কে
                </label>
                <textarea
                  id="s-about"
                  data-ocid="settings.about_text.textarea"
                  value={localSettings.aboutText}
                  onChange={(e) =>
                    setLocalSettings((p) => ({
                      ...p,
                      aboutText: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded text-sm placeholder-gray-600 focus:outline-none resize-none"
                  style={inputStyle}
                  placeholder="প্রতিষ্ঠান সম্পর্কে সংক্ষিপ্ত বিবরণ"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Logo */}
          {activeTab === "logo" && (
            <div className="flex flex-col gap-5">
              <p className="text-xs" style={{ color: "#9c9c9c" }}>
                PNG, JPG বা SVG ফরম্যাটে লোগো আপলোড করুন। লোগো আপলোড করলে পুরো
                ওয়েবসাইটে স্বয়ংক্রিয়ভাবে দেখা যাবে।
              </p>

              {localSettings.logoBase64 ? (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="flex items-center justify-center p-4 rounded-lg"
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #2d2d2d",
                    }}
                  >
                    <img
                      src={localSettings.logoBase64}
                      alt="লোগো প্রিভিউ"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-ocid="settings.logo.upload_button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                    >
                      <Upload size={14} />
                      লোগো পরিবর্তন করুন
                    </button>
                    <button
                      type="button"
                      data-ocid="settings.logo.delete_button"
                      onClick={() =>
                        setLocalSettings((p) => ({ ...p, logoBase64: "" }))
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #3d3d3d",
                        color: "#9c9c9c",
                      }}
                    >
                      <Trash2 size={14} />
                      লোগো মুছুন
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="settings.logo.dropzone"
                  className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg cursor-pointer transition-colors border-dashed border-2"
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#3d3d3d" }}
                  onClick={() => logoInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLocalSettings((p) => ({
                          ...p,
                          logoBase64: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  <div
                    className="p-4 rounded-full"
                    style={{ backgroundColor: "#2d2d2d" }}
                  >
                    <Upload size={24} style={{ color: "#6b6b6b" }} />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#9c9c9c" }}
                    >
                      লোগো টানুন বা{" "}
                      <span style={{ color: "oklch(0.4764 0.2183 22.8)" }}>
                        ব্রাউজ করুন
                      </span>
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#6b6b6b" }}>
                      PNG, JPG, SVG সমর্থিত
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={logoInputRef}
                id="s-logo-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFileChange}
              />
            </div>
          )}

          {/* Tab 3: Journalists */}
          {activeTab === "journalists" && (
            <div className="flex flex-col gap-4">
              {showJournalistForm && (
                <div
                  className="p-4 rounded-lg flex flex-col gap-3"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2d2d2d",
                  }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                  >
                    {editingJournalistId ? "সাংবাদিক সম্পাদনা" : "নতুন সাংবাদিক"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="j-name" className={lbl}>
                        নাম *
                      </label>
                      <input
                        id="j-name"
                        type="text"
                        data-ocid="settings.journalist_name.input"
                        value={journalistForm.name}
                        onChange={(e) =>
                          setJournalistForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm placeholder-gray-600 focus:outline-none"
                        style={inputStyle}
                        placeholder="সাংবাদিকের নাম"
                      />
                    </div>
                    <div>
                      <label htmlFor="j-email" className={lbl}>
                        ইমেইল
                      </label>
                      <input
                        id="j-email"
                        type="email"
                        data-ocid="settings.journalist_email.input"
                        value={journalistForm.email}
                        onChange={(e) =>
                          setJournalistForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm placeholder-gray-600 focus:outline-none"
                        style={inputStyle}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="j-role" className={lbl}>
                        পদবী
                      </label>
                      <select
                        id="j-role"
                        data-ocid="settings.journalist_role.select"
                        value={journalistForm.role}
                        onChange={(e) =>
                          setJournalistForm((p) => ({
                            ...p,
                            role: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none appearance-none"
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        {JOURNALIST_ROLES.map((role) => (
                          <option
                            key={role}
                            value={role}
                            style={{ backgroundColor: "#1a1a1a" }}
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="j-phone" className={lbl}>
                        ফোন
                      </label>
                      <input
                        id="j-phone"
                        type="tel"
                        data-ocid="settings.journalist_phone.input"
                        value={journalistForm.phone}
                        onChange={(e) =>
                          setJournalistForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm placeholder-gray-600 focus:outline-none"
                        style={inputStyle}
                        placeholder="ফোন নম্বর"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      data-ocid="settings.journalist_form.cancel_button"
                      onClick={() => {
                        setShowJournalistForm(false);
                        setEditingJournalistId(null);
                      }}
                      className="px-4 py-1.5 rounded text-xs font-medium transition-colors"
                      style={{ backgroundColor: "#2d2d2d", color: "#9c9c9c" }}
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      data-ocid="settings.journalist_form.save_button"
                      onClick={saveJournalist}
                      className="px-4 py-1.5 rounded text-xs font-bold text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </div>
              )}

              {localSettings.journalists.length === 0 && !showJournalistForm ? (
                <div
                  data-ocid="settings.journalists.empty_state"
                  className="flex flex-col items-center justify-center py-10 text-center"
                  style={{ color: "#6b6b6b" }}
                >
                  <p className="text-sm mb-1">কোনো সাংবাদিক যোগ করা হয়নি</p>
                  <p className="text-xs">নিচের বাটনে ক্লিক করে সাংবাদিক যোগ করুন</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {localSettings.journalists.map((journalist, idx) => (
                    <div
                      key={journalist.id}
                      data-ocid={`settings.journalists.item.${idx + 1}`}
                      className="flex items-start justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2d2d2d",
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">
                            {journalist.name}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                "oklch(0.4764 0.2183 22.8 / 0.2)",
                              color: "oklch(0.4764 0.2183 22.8)",
                            }}
                          >
                            {journalist.role}
                          </span>
                        </div>
                        {journalist.email && (
                          <p className="text-xs" style={{ color: "#9c9c9c" }}>
                            {journalist.email}
                          </p>
                        )}
                        {journalist.phone && (
                          <p className="text-xs" style={{ color: "#9c9c9c" }}>
                            {journalist.phone}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          data-ocid={`settings.journalists.edit_button.${idx + 1}`}
                          onClick={() => startEditJournalist(journalist)}
                          className="p-1.5 rounded text-gray-400 hover:text-white transition-colors text-xs"
                          aria-label="সম্পাদনা"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          data-ocid={`settings.journalists.delete_button.${idx + 1}`}
                          onClick={() => deleteJournalist(journalist.id)}
                          className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors"
                          aria-label="মুছে দিন"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showJournalistForm && (
                <button
                  type="button"
                  data-ocid="settings.journalists.add_button"
                  onClick={startAddJournalist}
                  className="inline-flex items-center gap-2 self-start px-4 py-2 rounded text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #3d3d3d",
                    color: "#9c9c9c",
                  }}
                >
                  <Plus size={14} />
                  নতুন সাংবাদিক যোগ করুন
                </button>
              )}
            </div>
          )}

          {/* Tab 4: Social Media */}
          {activeTab === "social" && (
            <div className="flex flex-col gap-4">
              {showSocialForm && (
                <div
                  className="p-4 rounded-lg flex flex-col gap-3"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2d2d2d",
                  }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                  >
                    {editingSocialId ? "সোশ্যাল মিডিয়া সম্পাদনা" : "নতুন সোশ্যাল মিডিয়া"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="s-platform" className={lbl}>
                        প্ল্যাটফর্ম
                      </label>
                      <select
                        id="s-platform"
                        data-ocid="settings.social_platform.select"
                        value={socialForm.platform}
                        onChange={(e) =>
                          setSocialForm((p) => ({
                            ...p,
                            platform: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none appearance-none"
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        {SOCIAL_PLATFORMS.map((plat) => (
                          <option
                            key={plat}
                            value={plat}
                            style={{ backgroundColor: "#1a1a1a" }}
                          >
                            {plat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="s-handle" className={lbl}>
                        হ্যান্ডেল / নাম
                      </label>
                      <input
                        id="s-handle"
                        type="text"
                        data-ocid="settings.social_handle.input"
                        value={socialForm.handle}
                        onChange={(e) =>
                          setSocialForm((p) => ({
                            ...p,
                            handle: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded text-sm placeholder-gray-600 focus:outline-none"
                        style={inputStyle}
                        placeholder="@handle বা পেইজের নাম"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="s-url" className={lbl}>
                        URL *
                      </label>
                      <input
                        id="s-url"
                        type="url"
                        data-ocid="settings.social_url.input"
                        value={socialForm.url}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, url: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded text-sm placeholder-gray-600 focus:outline-none"
                        style={inputStyle}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      data-ocid="settings.social_form.cancel_button"
                      onClick={() => {
                        setShowSocialForm(false);
                        setEditingSocialId(null);
                      }}
                      className="px-4 py-1.5 rounded text-xs font-medium transition-colors"
                      style={{ backgroundColor: "#2d2d2d", color: "#9c9c9c" }}
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      data-ocid="settings.social_form.save_button"
                      onClick={saveSocial}
                      className="px-4 py-1.5 rounded text-xs font-bold text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </div>
              )}

              {localSettings.socialLinks.length === 0 && !showSocialForm ? (
                <div
                  data-ocid="settings.social.empty_state"
                  className="flex flex-col items-center justify-center py-10 text-center"
                  style={{ color: "#6b6b6b" }}
                >
                  <p className="text-sm mb-1">কোনো সোশ্যাল মিডিয়া যোগ করা হয়নি</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {localSettings.socialLinks.map((link, idx) => (
                    <div
                      key={link.id}
                      data-ocid={`settings.social.item.${idx + 1}`}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2d2d2d",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span style={{ color: "#9c9c9c" }}>
                          {getPlatformIcon(link.platform)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {link.platform}
                            </span>
                            {link.handle && (
                              <span
                                className="text-xs"
                                style={{ color: "#9c9c9c" }}
                              >
                                {link.handle}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs truncate"
                            style={{ color: "#6b6b6b", maxWidth: "300px" }}
                          >
                            {link.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          data-ocid={`settings.social.edit_button.${idx + 1}`}
                          onClick={() => startEditSocial(link)}
                          className="p-1.5 rounded text-gray-400 hover:text-white transition-colors text-xs"
                          aria-label="সম্পাদনা"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          data-ocid={`settings.social.delete_button.${idx + 1}`}
                          onClick={() => deleteSocial(link.id)}
                          className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors"
                          aria-label="মুছে দিন"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showSocialForm && (
                <button
                  type="button"
                  data-ocid="settings.social.add_button"
                  onClick={startAddSocial}
                  className="inline-flex items-center gap-2 self-start px-4 py-2 rounded text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #3d3d3d",
                    color: "#9c9c9c",
                  }}
                >
                  <Plus size={14} />
                  নতুন সোশ্যাল মিডিয়া যোগ করুন
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer / Save */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-4 border-t"
          style={{ borderColor: "#2d2d2d" }}
        >
          {saveSuccess ? (
            <span
              data-ocid="settings.success_state"
              className="text-sm font-medium"
              style={{ color: "#4ade80" }}
            >
              ✓ সফলভাবে সংরক্ষিত হয়েছে!
            </span>
          ) : (
            <span className="text-xs" style={{ color: "#6b6b6b" }}>
              পরিবর্তন সংরক্ষণ করতে বাটনে ক্লিক করুন
            </span>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="settings.cancel_button"
              onClick={onClose}
              className="px-4 py-2 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2d2d2d",
                color: "#9c9c9c",
              }}
            >
              বন্ধ করুন
            </button>
            <button
              type="button"
              data-ocid="settings.save_button"
              onClick={handleSave}
              className="px-5 py-2 rounded text-sm font-bold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
