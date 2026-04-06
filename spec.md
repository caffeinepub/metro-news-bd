# বালীগাঁও নিউজ

## Current State
A fully-built local news portal homepage with:
- Sticky header with 13 nav categories, search, mobile hamburger menu
- Breaking news ticker (static data)
- Hero slider (static data, 3 slides)
- Editor's picks section (static data)
- Latest news grid (static data)
- Footer with contact info and branding
- Backend: Motoko actor with `createArticle`, `getAllArticles`, `getFeaturedArticles`, `createBreakingNews`, `getAllBreakingNews`, `addAdmin` methods
- Backend data model: Article {id, title, summary, category, imageUrl, author, publishedAt, isFeatured}

## Requested Changes (Diff)

### Add
- **News Post Form** ("সংবাদ পোস্ট করুন" button in header): A modal/panel form where user can:
  - Write news title (শিরোনাম)
  - Write news body/content (সংবাদ বিবরণ)
  - Upload a news image (ছবি আপলোড)
  - Select category from dropdown (রাজনৈতিক, ক্রীড়া, অর্থনীতি, শিক্ষা, স্বাস্থ্য, কৃষি, ধর্মীয় অনুষ্ঠান, স্থানীয় খবর, জাতীয় খবর, আন্তর্জাতিক খবর, বিনোদন, অপরাধ)
  - Enter author name (লেখকের নাম)
  - Publish button which calls backend `createArticle`
- **Category Sections on Homepage**: Below latest news, display published articles grouped by category. Each category with articles shows a section heading and a grid of article cards.
- **Dynamic latest news and hero slider**: Published articles from backend replace static data. Latest articles go to LatestNews, featured articles go to HeroSlider.
- Image upload using blob-storage component; uploaded image URL stored in article.

### Modify
- **Header**: Add "সংবাদ পোস্ট করুন" button that opens the post form modal
- **App.tsx**: Wire up backend calls, load articles on mount, pass to LatestNews/HeroSlider/CategorySections
- **LatestNews**: Accept articles as props instead of using static data
- **HeroSlider**: Accept slides as props, fallback to static data if empty
- **BreakingNewsTicker**: Load from backend `getAllBreakingNews`, fallback to static

### Remove
- Static mock data from LatestNews and HeroSlider (replace with props + fallback)

## Implementation Plan
1. Select `blob-storage` component for image uploads
2. Create `NewsPostModal` component: form with title, content, author, category dropdown, image upload, publish button calling backend `createArticle`
3. Update `Header` to show "সংবাদ পোস্ট করুন" button
4. Update `App.tsx`: load articles from backend on mount; pass to child components
5. Update `LatestNews` to accept `articles` prop
6. Update `HeroSlider` to accept `slides` prop with fallback
7. Update `BreakingNewsTicker` to load from backend with static fallback
8. Add `CategoryNewsSection` component: renders article cards grouped by category
9. Wire image upload in form using blob-storage hooks
