# বালীগাঁও নিউজ

## Current State
- Footer exists with dark (#0a0a0a) background, 4-column grid: branding/contact, sections, resources, social media
- Footer has resourceLinks list with যোগাযোগ, আমাদের সম্পর্কে, বিজ্ঞাপন দিন, গোপনীয়তা নীতি, শর্তাবলী — but they are not visually prominent
- Social media icons in footer are text-based with icons, but not styled as icon-only buttons
- Header has desktop/mobile preview switch in the nav bar
- Interface is mostly responsive but footer and some sections could be improved on mobile landscape
- All functionality (news posting, settings, weather, aggregated news, modals) intact

## Requested Changes (Diff)

### Add
- Footer: dedicated section with clearly labeled links for যোগাযোগ, আমাদের সম্পর্কে, বিজ্ঞাপন দিন, গোপনীয়তা নীতি, শর্তাবলী as clickable buttons/links
- Footer: social media icons displayed as circular/rounded icon buttons (not text + icon)
- Mobile/Desktop switch button prominently accessible — ensure it works on both mobile and desktop views
- Full responsive support for mobile portrait, mobile landscape, and desktop

### Modify
- Footer redesign: modern, professional layout with white/light background or attractive dark theme; distinct sections for contact info, about/legal links, and social icons
- Footer social media: icon-only circular buttons with hover effects, visible branding colors
- Footer bottom bar: copyright + legal links in a clean bottom strip
- Ensure mobile/desktop preview switch is visible and functional in header nav bar on all screen sizes
- Responsive breakpoints: fine-tune padding, font sizes, grid columns for mobile portrait (320-480px), mobile landscape (480-768px), tablet (768-1024px), desktop (1024px+)

### Remove
- Nothing removed — all functionality preserved

## Implementation Plan
1. Redesign Footer.tsx:
   - Update layout to have a clear top section with: branding+contact, quick links (sections), legal links (যোগাযোগ, আমাদের সম্পর্কে, বিজ্ঞাপন দিন, গোপনীয়তা নীতি, শর্তাবলী), social icons row
   - Social media: render as icon-only circular buttons in a row/grid with hover color effects
   - Bottom bar: copyright text + legal quick links
   - Responsive: 1 col mobile, 2 col tablet, 4 col desktop
2. Ensure Header device preview switch is usable on all screen sizes (already in desktop nav; consider adding to mobile menu too)
3. Review and improve responsive breakpoints across the layout
4. All existing settings context (SiteSettingsContext) data still used in footer
