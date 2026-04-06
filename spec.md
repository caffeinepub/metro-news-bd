# বালীগাঁও নিউজ

## Current State

ব্লকচেইন (ICP) স্টোরেজ ইম্পলিমেন্ট করা আছে। `actor.addLocalNews()` এবং `actor.getAllLocalNews()` কাজ করে। কিন্তু সমস্যা:
1. `useActor` hook-এর actor null থাকার সময় `loadArticles` early return করে — সংবাদ দেখা যায় না
2. Migration শর্ত `result.length === 0` — blockchain-এ কিছু থাকলে localStorage-এর পুরনো সংবাদ migrate হয় না
3. Actor fetching state সঠিকভাবে handle করা হয়নি

## Requested Changes (Diff)

### Add
- `loadArticles` কে actor ready হওয়া পর্যন্ত retry করার mechanism
- Blockchain থেকে সবসময় fresh data load করার auto-refresh (30 সেকেন্ড)
- Loading state এ সঠিক spinner দেখানো যখন actor initialize হচ্ছে

### Modify
- `loadArticles` function: actor null/fetching হলে proper waiting state দেখাবে, retry করবে
- Migration logic: localStorage-এ সংবাদ থাকলে সবসময় blockchain-এ migrate করবে (result.length শর্ত সরাবে)
- useEffect dependency: `actorFetching` পরিবর্তন হলেও reload করবে

### Remove
- Migration-এ `result.length === 0` শর্ত

## Implementation Plan

1. `LocalNewsSection.tsx`-এ `loadArticles` function fix:
   - actor null হলে early return না করে loading state দেখাবে
   - actorFetching true থাকলে spinner দেখাবে
2. Migration bug fix: localStorage-এ সংবাদ থাকলে সবসময় blockchain-এ push করবে
3. useEffect-এ actorFetching dependency সঠিকভাবে যুক্ত করবে
4. Auto-reload: setInterval দিয়ে প্রতি ৩০ সেকেন্ডে blockchain থেকে refresh
