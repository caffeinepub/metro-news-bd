# বালীগাঁও নিউজ

## Current State

Fully functional Bengali news website with:
- Sticky header with logo, nav (14 links including 'স্থানীয় খবর' anchor), settings gear, post button, device preview switch
- Breaking news ticker, hero slider, editor's picks, latest news grid
- CategoryNewsSection showing backend articles grouped by category
- WeatherSection (Open-Meteo API, Bengali)
- ExternalNewsSection with 3 tabs (22 sources), manual refresh
- NewsPostModal: logged-in form to submit articles (title, summary, author, category, image, featured toggle)
- NewsDetailModal: pop-up showing image, title, category, summary, source link
- SettingsModal: logo, journalist info, social media management (localStorage)
- Footer with contact, about, advertise, privacy, terms, social icons
- Backend: ICP Motoko actor with createArticle, getAllArticles, getFeaturedArticles, fetchExternalNews, getExternalNews

Currently "স্থানীয় খবর" in the nav just anchors to the latest news section — there is no dedicated Local News section with its own login-protected editor and article display.

## Requested Changes (Diff)

### Add
- `LocalNewsSection` component: a dedicated section on the homepage (between LatestNews and WeatherSection) with:
  - Section heading "স্থানীয় সংবাদ" with a red accent bar
  - Login panel: password-protected entry (simple password in localStorage/env), toggled by a "সংবাদকর্মী লগইন" button visible in the section
  - News editor form (visible only when logged in): title input, body/summary textarea, source link input, category dropdown (same 12 categories as NewsPostModal), image upload (FileReader → base64 for local display since no blob upload needed for local-only posts), publish button
  - Local news list: displays all locally-published articles in a card grid sorted by newest first; each card shows image (or category placeholder), headline, category badge, author, time
  - Clicking a card opens the existing `NewsDetailModal` with all details + source link
  - Articles stored in localStorage (key: `localNews`) so they persist across page reloads without needing backend calls
  - Logout button visible when logged in
  - Admin password: "baligaon2024" (hardcoded in component, can be changed in settings later)

### Modify
- `App.tsx`: add `LocalNewsSection` between `LatestNews` and `WeatherSection`
- `Header.tsx`: update `href` for "স্থানীয় খবর" nav link from `#local` to `#local-news` so it scrolls to the new section
- `CategoryNewsSection`: also check localStorage `localNews` and merge with backend articles so local articles appear in category sections too

### Remove
- Nothing removed

## Implementation Plan

1. Create `src/frontend/src/components/LocalNewsSection.tsx`
   - localStorage read/write helpers for `localNews` array
   - Login state with password check ("baligaon2024")
   - Post form with: title, summary/body, sourceUrl, sourceName, category select, image upload (base64), publish button
   - Card grid rendering local articles, clicking opens NewsDetailModal
   - Logout button

2. Update `App.tsx`
   - Import and render `<LocalNewsSection />` between LatestNews and WeatherSection dividers

3. Update `Header.tsx`
   - Change href of "স্থানীয় খবর" to `#local-news`

4. Update `CategoryNewsSection.tsx`
   - Read `localNews` from localStorage and merge into articles for display
