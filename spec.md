# বালীগাঁও নিউজ - Settings Panel

## Current State
- Full news portal with Header, Footer, BreakingNewsTicker, HeroSlider, EditorsPicks, LatestNews, CategoryNewsSection, ExternalNewsSection components.
- Branding is hardcoded: site name, tagline, email, address, editor.
- Footer has hardcoded social media links (Facebook, X, YouTube, Instagram).
- No settings panel exists.
- Backend stores Articles, BreakingNews, ExternalNews.
- blob-storage component is available.

## Requested Changes (Diff)

### Add
- **Settings page/modal** accessible from a gear icon in the Header.
- **Site Settings** form sections:
  1. **সাইটের তথ্য (Site Info)**: site name, tagline, email, address, editor name, about text, phone number, established year.
  2. **লোগো আপলোড (Logo)**: upload image, preview, store as base64 in localStorage/context.
  3. **সাংবাদিক (Journalists)**: add/edit/remove journalists with fields: name, email, role/designation, phone.
  4. **সোশ্যাল মিডিয়া (Social Media)**: add/edit/remove social media links: platform name, URL, handle.
- **SiteSettingsContext**: React context that stores all settings in localStorage and provides them globally.
- Header reads logo and site name/tagline from context.
- Footer reads email, address, editor, social media links from context.
- All changes saved via "সংরক্ষণ করুন" (Save) button; auto-persist to localStorage.

### Modify
- **Header**: add Settings gear icon button; read logo/site name/tagline from SiteSettingsContext.
- **Footer**: read contact info and social media links from SiteSettingsContext.
- **App.tsx**: wrap with SiteSettingsProvider, wire onSettingsClick state.

### Remove
- Nothing removed, only enhanced.

## Implementation Plan
1. Create `src/frontend/src/context/SiteSettingsContext.tsx` - defines SiteSettings type, default values, context, provider with localStorage persistence.
2. Create `src/frontend/src/components/SettingsModal.tsx` - full-screen settings modal with 4 tabs: Site Info, Logo, Journalists, Social Media.
3. Update `Header.tsx` - add gear icon, accept `onSettingsClick` prop, read logo/name/tagline from context.
4. Update `Footer.tsx` - read contact info and social media from context.
5. Update `App.tsx` - wrap with SiteSettingsProvider, add settings modal state and rendering.
6. Validate and build.
