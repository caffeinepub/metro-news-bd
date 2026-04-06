# বালীগাঁও নিউজ

## Current State
- Sticky header with white background, minimalist design, logo on left, site name and tagline
- Desktop nav bar (horizontal) below the header with 14 nav links
- Mobile hamburger menu drawer
- Breaking news ticker (red scrolling bar)
- Hero slider, Editor's Picks, Latest News grid (dark cards on dark background)
- Weather section, External News section (3 tabs: national, online, international)
- Settings modal, News Post modal
- Footer
- Dark background (#0b0b0b) for main content with dark cards

## Requested Changes (Diff)

### Add
- Device preview switch button in the nav bar area: Mobile icon = show mobile-width preview, Desktop icon = show full-width layout. This is a toggle switch that simulates device width.
- Breaking news section redesigned as highlighted scrolling ticker OR highlighted cards at the top (improve visual presentation)
- Each news card should show: image, title, short excerpt/summary
- Clicking a card opens a modal with detailed summary and source link below

### Modify
- Navigation: Desktop = horizontal nav bar (already exists, keep), Mobile = hamburger icon (already exists, keep). Ensure they work cleanly.
- Add device preview switch button next to the nav bar (desktop/mobile toggle icons) — in the header or nav bar row.
- Breaking news ticker: upgrade to be more visually prominent — either animated scrolling ticker with red highlight or highlighted card layout.
- News cards (LatestNews, HeroSlider, ExternalNews, EditorsPicks): ensure each card shows image + title + short excerpt. Currently many cards have dark backgrounds (#1a1a1a); update to white/light card style with shadow to match the minimalist white+dark-gray theme.
- App.tsx main background: change from #0b0b0b (dark) to white/light gray to match the updated white theme from header.
- Section headings and dividers: update from dark theme colors to light theme colors.

### Remove
- Dark background on main content area (was #0b0b0b)
- Dark card styles (#1a1a1a background) — replace with white cards with shadows

## Implementation Plan
1. Update App.tsx: change background from #0b0b0b to #f8f9fa (light gray), update dividers to light colors
2. Update Header.tsx: Add device preview switch button (Mobile icon / Desktop icon toggle) next to or in the nav bar. When mobile mode active, wrap main content in a constrained width container.
3. Update BreakingNewsTicker.tsx: Enhance with better visual design — larger height, bolder label, smoother animation
4. Update LatestNews.tsx: change card style from dark (#1a1a1a) to white with shadow; ensure image + title + excerpt visible on card
5. Update HeroSlider, EditorsPicks, ExternalNewsSection: same card style update to light theme
6. Ensure device preview switch in App.tsx wraps content when mobile mode is active (e.g., max-width: 390px centered)
