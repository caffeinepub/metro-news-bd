# বালীগাঁও নিউজ - External News Aggregator

## Current State

A Bengali local news website with:
- Sticky header with 13 navigation categories
- Breaking news ticker, Hero slider, Editor's Picks, Latest News grid, Footer
- Backend: Motoko actor with Article & BreakingNews types; createArticle, getAllArticles, getFeaturedArticles endpoints
- Frontend: App.tsx renders all sections; NewsPostModal for posting local news; CategoryNewsSection displays backend articles by category
- No external news fetching or aggregation currently exists

## Requested Changes (Diff)

### Add
- Backend: New `ExternalNews` type with fields: id, title, summary, sourceUrl, sourceName, category, fetchedAt
- Backend: HTTP outcalls (using http_request) to fetch RSS feeds from Bangladeshi national news sources (Prothom Alo, Daily Star, Bdnews24, Kaler Kantho) and international sources (BBC Bengali, DW Bengali)
- Backend: `fetchExternalNews()` function that fetches and parses RSS XML from multiple sources, categorizes headlines into: রাজনৈতিক, অর্থনৈতিক, ক্রীড়া, শিক্ষা, স্বাস্থ্য, কৃষি, ধর্মীয় অনুষ্ঠান, আন্তর্জাতিক খবর, জাতীয় খবর
- Backend: `getExternalNews()` query to return cached external news
- Backend: `getLastFetchedTime()` query to return timestamp of last fetch
- Frontend: New `ExternalNewsSection` component showing fetched headlines grouped by category
- Frontend: Clicking a headline opens a modal/drawer with summary + source link (opens in new tab)
- Frontend: Manual "Refresh" button that calls fetchExternalNews() and refreshes the display
- Frontend: Auto-refresh using React Query's `refetchInterval` set to 6 hours (twice daily)
- Frontend: Last updated timestamp shown near the Refresh button
- Frontend: Loading skeleton while fetching

### Modify
- App.tsx: Add ExternalNewsSection after the CategoryNewsSection
- useQueries.ts: Add `useGetExternalNews`, `useFetchExternalNews` (mutation), `useGetLastFetchedTime` hooks
- Header.tsx: No changes needed

### Remove
- Nothing removed

## Implementation Plan

1. Select `http-outcalls` component for backend RSS fetching capability
2. Regenerate Motoko backend with ExternalNews type, RSS fetching from multiple Bengali news sources, category-based storage, getExternalNews and fetchExternalNews endpoints
3. Create ExternalNewsSection React component with:
   - Category tabs or grouped sections
   - Headline cards with source badge
   - Click-to-expand modal showing summary + source link
   - Manual Refresh button with loading state
   - "শেষ আপডেট" timestamp display
4. Wire auto-refresh using React Query refetchInterval (6 hours)
5. Integrate into App.tsx below existing category section
