
# Profile Page Redesign

Transform the user profile page from a simple activity feed into a comprehensive showcase of the user's drink journey with statistics, collections, and top drinks.

## Current State
The profile page (`/u/:username`) currently only shows:
- Profile header (avatar, name, bio, follow stats, follow button)
- A single "Activity" tab showing recent drink activity

## Proposed New Design

### Profile Header (Keep & Enhance)
Keep the existing header with avatar, display name, username, bio, follower/following counts, and follow button. Add a **total drinks count** stat next to followers/following.

### New Tab Structure
Replace the single "Activity" tab with a multi-tab layout:

| Tab | Content |
|-----|---------|
| **Overview** | Stats highlights + top drinks showcase |
| **Collections** | User's public collections grid |
| **Activity** | Existing activity feed (moved here) |

---

## Tab 1: Overview (Default Tab)

### Statistics Section
A grid of stat cards showing:
- **Total Drinks Logged** - count of all drinks (excluding wishlist)
- **Favorite Type** - most frequently logged drink type with icon
- **Average Rating** - mean of all ratings
- **Top Rated** - highest rated drink name
- **Member Since** - profile creation date

### Top Drinks Showcase
A horizontal scrollable list or grid showing the user's **top 6 highest-rated drinks**:
- Drink image (or type icon fallback)
- Name
- Rating stars
- Type badge

Clicking a drink opens the standard DrinkDetailModal in read-only mode.

### Privacy Considerations
- For **own profile**: Show all stats and drinks
- For **public profiles**: Show stats and top drinks
- For **followers-only profiles**: Show stats and top drinks only if following
- For **private profiles**: Show "Stats are private" message

---

## Tab 2: Collections

Display the user's **public collections** in a grid layout using the existing `CollectionCard` component.

### Privacy & Data Access
- Only show collections where `is_public = true`
- Uses existing `collections_public` view to avoid exposing user_id
- Clicking a collection navigates to `/c/:shareId` (shared collection page)

### Empty State
"No public collections" message with appropriate icon.

---

## Tab 3: Activity (Existing)
Move the current activity feed here as a secondary tab. Keep all existing functionality including:
- Activity cards
- Privacy visibility checks
- Drink detail modal on click

---

## Technical Implementation

### New Data Fetching

**Profile Stats Query** (for Overview tab):
```sql
-- Count drinks, calculate average rating, find top type
SELECT 
  COUNT(*) FILTER (WHERE is_wishlist = false) as total_drinks,
  AVG(rating) FILTER (WHERE rating > 0) as avg_rating,
  MAX(rating) as top_rating
FROM drinks 
WHERE user_id = :userId
```

**Top Drinks Query**:
```sql
SELECT * FROM drinks 
WHERE user_id = :userId 
  AND is_wishlist = false 
  AND rating IS NOT NULL
ORDER BY rating DESC, date_added DESC
LIMIT 6
```

**Public Collections Query**:
```sql
SELECT * FROM collections_public 
WHERE user_id = :userId 
  AND is_public = true
```

### RLS Considerations

**Problem**: Current drinks table RLS only allows users to see their own drinks. This prevents visitors from seeing another user's top drinks or stats.

**Solution Options**:
1. **Create a `drinks_public` view** with `security_definer` that only exposes non-sensitive fields (name, type, rating, image_url, created_at) for users with public activity visibility
2. **Use an edge function** to aggregate stats without exposing individual drink records
3. **Add SELECT RLS policy** allowing public drink viewing based on the owner's `activity_visibility` setting

**Recommended approach**: Create a `drinks_public` view similar to `profiles_public` that:
- Only returns drinks for users with `activity_visibility = 'public'` OR followers if `= 'followers'`
- Excludes sensitive fields like notes, location, price
- Respects privacy settings

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/UserProfile.tsx` | Complete refactor with tabs, stats, collections grid |
| `src/hooks/useProfileStats.ts` | **NEW** - Hook for fetching profile statistics |
| `src/components/ProfileStatsCard.tsx` | **NEW** - Stats display component |
| `src/components/TopDrinksShowcase.tsx` | **NEW** - Top drinks grid component |

### Database Migration
Create a new view for public drink access:
```sql
CREATE OR REPLACE VIEW public.drinks_public 
WITH (security_invoker=on) AS
SELECT 
  d.id,
  d.user_id,
  d.name,
  d.type,
  d.rating,
  d.image_url,
  d.date_added,
  d.is_wishlist
FROM public.drinks d
JOIN public.profiles p ON p.user_id = d.user_id
WHERE 
  p.activity_visibility = 'public'
  OR (
    p.activity_visibility = 'followers' 
    AND EXISTS (
      SELECT 1 FROM follows f 
      WHERE f.following_id = d.user_id 
        AND f.follower_id = auth.uid()
        AND f.status = 'accepted'
    )
  );
```

---

## UI Mockup

```text
┌─────────────────────────────────────────────────┐
│ ← @username                            [Share] │
├─────────────────────────────────────────────────┤
│  ┌──────┐                                       │
│  │Avatar│  Display Name                         │
│  │      │  @username                            │
│  └──────┘  Bio text here...                     │
│                                                 │
│  42 drinks  │  156 followers  │  89 following   │
│                                                 │
│  [Follow] or [Edit Profile]                     │
├─────────────────────────────────────────────────┤
│  [ Overview ]  [ Collections ]  [ Activity ]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  STATS                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ 42      │ │ 🥃      │ │ 4.2★    │            │
│  │ Drinks  │ │ Whiskey │ │ Avg     │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│                                                 │
│  TOP DRINKS                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐           │
│  │ 🥃 │ │ 🍺 │ │ 🍷 │ │ 🍸 │ │ 🥃 │ │ 🍺 │        │
│  │5★ │ │5★ │ │5★ │ │4★ │ │4★ │ │4★ │           │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Summary

This redesign transforms the profile page into a proper showcase of each user's drink journey:

1. **Overview tab** - At-a-glance stats and top drinks
2. **Collections tab** - Browsable public collections  
3. **Activity tab** - Chronological activity feed (existing)

All privacy settings are respected, using the same visibility logic already in place for the activity feed.
