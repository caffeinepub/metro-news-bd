import {
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useCreateArticle } from "../hooks/useQueries";

const NEWS_CATEGORIES = [
  "রাজনৈতিক",
  "ক্রীড়া",
  "অর্থনীতি",
  "শিক্ষা",
  "স্রাস্থ্য",
  "কৃষি",
  "ধর্মীয় অনুষ্ঠান",
  "স্থানীয় খবর",
  "জাতীয় খবর",
  "আন্তর্জাতিক খবর",
  "বিনোদন",
  "অপরাধ",
];

interface NewsPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewsPostModal({
  isOpen,
  onClose,
  onSuccess,
}: NewsPostModalProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createArticleMutation = useCreateArticle();

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setAuthor("");
    setCategory("");
    setIsFeatured(false);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!title.trim() || !summary.trim() || !author.trim() || !category) {
      setSubmitError("সকল তারকাচিহ্নিত (*) ক্ষেত্র পূরণ করুন।");
      return;
    }

    let imageUrl = "";

    try {
      if (imageFile) {
        setIsUploading(true);
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
        imageUrl = blob.getDirectURL();
        setIsUploading(false);
      }

      await createArticleMutation.mutateAsync({
        title: title.trim(),
        summary: summary.trim(),
        category,
        imageUrl,
        author: author.trim(),
        isFeatured,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        resetForm();
        onSuccess();
      }, 1200);
    } catch (err) {
      setIsUploading(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "সংবাদ প্রকাশ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  const isLoading = isUploading || createArticleMutation.isPending;

  const handleDropzoneClick = () => fileInputRef.current?.click();
  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      data-ocid="news_post.modal"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={handleBackdropKeyDown}
    >
      <div
        className="relative w-full max-w-2xl my-8 rounded-lg shadow-2xl"
        style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
      >
        {/* Modal header */}
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
              সংবাদ প্রকাশ করুন
            </h2>
          </div>
          <button
            type="button"
            data-ocid="news_post.close_button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="news-title"
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#9c9c9c" }}
            >
              শিরোনাম{" "}
              <span style={{ color: "oklch(0.4764 0.2183 22.8)" }}>*</span>
            </label>
            <input
              id="news-title"
              type="text"
              data-ocid="news_post.title.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="সংবাদের শিরোনাম লিখুন..."
              className="w-full px-4 py-3 rounded text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2d2d2d",
              }}
              disabled={isLoading}
              maxLength={200}
            />
          </div>

          {/* Summary / Content */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="news-summary"
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#9c9c9c" }}
            >
              সংবাদ বিবরণ{" "}
              <span style={{ color: "oklch(0.4764 0.2183 22.8)" }}>*</span>
            </label>
            <textarea
              id="news-summary"
              data-ocid="news_post.summary.textarea"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="সংবাদের বিস্তারিত লিখুন..."
              rows={5}
              className="w-full px-4 py-3 rounded text-sm text-white placeholder-gray-600 focus:outline-none resize-none transition-colors"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2d2d2d",
              }}
              disabled={isLoading}
            />
          </div>

          {/* Author + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="news-author"
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#9c9c9c" }}
              >
                লেখকের নাম{" "}
                <span style={{ color: "oklch(0.4764 0.2183 22.8)" }}>*</span>
              </label>
              <input
                id="news-author"
                type="text"
                data-ocid="news_post.author.input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="লেখকের নাম..."
                className="w-full px-4 py-3 rounded text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2d2d2d",
                }}
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="news-category"
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#9c9c9c" }}
              >
                ক্যাটাগরি{" "}
                <span style={{ color: "oklch(0.4764 0.2183 22.8)" }}>*</span>
              </label>
              <select
                id="news-category"
                data-ocid="news_post.category.select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2d2d2d",
                  color: category ? "white" : "#6b6b6b",
                }}
                disabled={isLoading}
              >
                <option value="" disabled style={{ color: "#6b6b6b" }}>
                  ক্যাটাগরি বেছে নিন
                </option>
                {NEWS_CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="news-image-file"
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#9c9c9c" }}
            >
              ছবি আপলোড করুন
            </label>

            {imagePreview ? (
              <div
                className="relative rounded overflow-hidden"
                style={{ maxHeight: "200px" }}
              >
                <img
                  src={imagePreview}
                  alt="প্রিভিউ"
                  className="w-full object-cover"
                  style={{ maxHeight: "200px" }}
                />
                <button
                  type="button"
                  data-ocid="news_post.remove_image.button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                  aria-label="ছবি সরান"
                >
                  <X size={16} />
                </button>
                {isUploading && (
                  <div
                    className="absolute bottom-0 left-0 h-1 transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      backgroundColor: "oklch(0.4764 0.2183 22.8)",
                    }}
                  />
                )}
              </div>
            ) : (
              <button
                type="button"
                data-ocid="news_post.dropzone"
                className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded cursor-pointer transition-colors border-dashed border-2"
                style={{
                  backgroundColor: "#1a1a1a",
                  borderColor: "#3d3d3d",
                }}
                onClick={handleDropzoneClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file?.type.startsWith("image/")) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#2d2d2d" }}
                >
                  <ImageIcon size={22} style={{ color: "#6b6b6b" }} />
                </div>
                <p className="text-sm" style={{ color: "#9c9c9c" }}>
                  ছবি টানুন বা{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.4764 0.2183 22.8)" }}
                  >
                    ব্রাউজ করুন
                  </span>
                </p>
                <p className="text-xs" style={{ color: "#6b6b6b" }}>
                  JPG, PNG, WEBP সমর্থিত
                </p>
              </button>
            )}
            <input
              ref={fileInputRef}
              id="news-image-file"
              type="file"
              accept="image/*"
              data-ocid="news_post.upload_button"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Featured checkbox */}
          <label
            className="flex items-center gap-3 cursor-pointer group"
            htmlFor="news-featured"
          >
            <div
              className="relative w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                backgroundColor: isFeatured
                  ? "oklch(0.4764 0.2183 22.8)"
                  : "#1a1a1a",
                border: `2px solid ${
                  isFeatured ? "oklch(0.4764 0.2183 22.8)" : "#3d3d3d"
                }`,
              }}
              aria-hidden="true"
            >
              {isFeatured && (
                <svg
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title>নির্বাচিত</title>
                  <path
                    d="M1 4L4 7L10 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <input
              id="news-featured"
              type="checkbox"
              data-ocid="news_post.featured.checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="sr-only"
              disabled={isLoading}
            />
            <div>
              <p className="text-sm font-medium text-white">
                ফিচার্ড সংবাদ হিসেবে প্রকাশ করুন
              </p>
              <p className="text-xs" style={{ color: "#6b6b6b" }}>
                এই সংবাদটি হোমপেজের শীর্ষে প্রদর্শিত হবে
              </p>
            </div>
          </label>

          {/* Error message */}
          {submitError && (
            <div
              data-ocid="news_post.error_state"
              className="flex items-start gap-2.5 px-4 py-3 rounded"
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{submitError}</p>
            </div>
          )}

          {/* Success message */}
          {submitSuccess && (
            <div
              data-ocid="news_post.success_state"
              className="flex items-center gap-2.5 px-4 py-3 rounded"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <p className="text-sm text-green-400">
                সংবাদ সফলভাবে প্রকাশিত হয়েছে!
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div
            className="flex items-center justify-between gap-3 pt-2 border-t"
            style={{ borderColor: "#2d2d2d" }}
          >
            <button
              type="button"
              data-ocid="news_post.cancel_button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium rounded transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2d2d2d",
                color: "#9c9c9c",
              }}
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              data-ocid="news_post.submit_button"
              disabled={isLoading || submitSuccess}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 disabled:opacity-60"
              style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {isUploading
                    ? `আপলোড হচ্ছে... ${uploadProgress}%`
                    : "প্রকাশ হচ্ছে..."}
                </>
              ) : (
                <>
                  <Upload size={15} />
                  প্রকাশ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
