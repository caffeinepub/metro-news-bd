# Local News Website

## Current State
New project. Only default scaffolding exists (empty Motoko backend, boilerplate React frontend).

## Requested Changes (Diff)

### Add
- Full homepage UI with: sticky header (logo, site name, tagline, nav), breaking news ticker bar, hero/top news slider, and latest news grid layout.
- Dark theme (black background, white text, red highlights) applied globally.
- Responsive layout that works on mobile, tablet, and desktop.
- Placeholder content only (no real news data); all content is static mock data in the frontend.

### Modify
- `index.css`: Add dark theme base styles, typography setup.
- `App.tsx` or equivalent root component: Wire up all homepage sections.

### Remove
- Default boilerplate placeholder content.

## Implementation Plan
1. Set up dark theme CSS tokens in `index.css`.
2. Create `Header` component: logo (MT mark), site name (e.g. "মেট্রো নিউজ"), tagline, horizontal nav links, search icon, subscribe button.
3. Create `BreakingNewsTicker` component: animated scrolling red banner with placeholder breaking news items.
4. Create `HeroSlider` component: auto-rotating slider with 3-4 featured news cards (large image, title, category badge, meta).
5. Create `EditorsPicks` sidebar component (shown alongside hero slider).
6. Create `LatestNews` grid section: 6-card responsive grid with thumbnail, category, title, excerpt, meta.
7. Create `Footer` component: 4-column links + social.
8. Compose all into `App.tsx` homepage layout.
9. All content is static mock data (Bengali placeholder text allowed).
