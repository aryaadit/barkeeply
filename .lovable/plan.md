

# Migrate Onboarding State to Database

## Overview
Move the onboarding progress tracking from browser localStorage to the user's profile in the database. This ensures onboarding state persists across all devices and browsers where the user logs in.

## Current State
- Onboarding state is stored in `localStorage` under the key `barkeeply_onboarding`
- State includes: `hasSeenWelcome`, `hasCompletedOnboarding`, `currentStep`, `dismissedSteps`
- State is lost when users clear browser data or switch devices

## Implementation Plan

### Step 1: Add onboarding columns to profiles table
Create a database migration to add onboarding fields to the `profiles` table:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `has_seen_welcome` | boolean | false | Tracks if user has completed welcome carousel |
| `onboarding_step` | text | 'welcome' | Current onboarding step |
| `dismissed_onboarding_steps` | text[] | {} | Array of dismissed step names |

### Step 2: Update the Profile TypeScript type
Add new fields to the `Profile` interface in `src/types/profile.ts`:
- `hasSeenWelcome: boolean`
- `onboardingStep: OnboardingStep`
- `dismissedOnboardingSteps: OnboardingStep[]`

### Step 3: Update useProfile hook
Modify `src/hooks/useProfile.ts` to:
- Fetch the new onboarding fields from the database
- Support updating onboarding state via `updateProfile`

### Step 4: Rewrite useOnboarding hook
Transform `src/hooks/useOnboarding.tsx` to:
- Remove localStorage logic entirely
- Consume onboarding state from `useProfile` hook
- Call `updateProfile` when state changes
- Maintain a local cache to avoid flickering during async updates
- Handle unauthenticated users gracefully (show carousel, don't persist)

### Step 5: Migrate existing localStorage state (optional one-time sync)
Add logic to check for existing localStorage data on first load after migration:
- If user has localStorage onboarding state and database has defaults, sync to database
- Clear localStorage after successful migration
- This ensures users don't re-see the welcome carousel after the update

---

## Technical Details

### Database Migration SQL
```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_seen_welcome boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step text DEFAULT 'welcome',
ADD COLUMN IF NOT EXISTS dismissed_onboarding_steps text[] DEFAULT '{}';
```

### Updated Profile Type
```typescript
export interface Profile {
  // ...existing fields...
  hasSeenWelcome: boolean;
  onboardingStep: string;
  dismissedOnboardingSteps: string[];
}
```

### Updated useOnboarding Hook Architecture
```text
┌─────────────────────────────────────────────────────────┐
│                   useOnboarding Hook                     │
├─────────────────────────────────────────────────────────┤
│  Reads from:                                             │
│    - useProfile() for persisted state                   │
│    - Local state for optimistic UI updates              │
│                                                          │
│  Writes to:                                              │
│    - updateProfile() to persist changes                 │
│    - Local state immediately for responsiveness         │
│                                                          │
│  Fallback:                                              │
│    - If no user logged in, use localStorage (guest)     │
│    - Sync localStorage → database on login              │
└─────────────────────────────────────────────────────────┘
```

### Files to Modify
1. **Database migration** - Add columns to `profiles` table
2. **`src/types/profile.ts`** - Add new type fields
3. **`src/hooks/useProfile.ts`** - Fetch and update new fields
4. **`src/hooks/useOnboarding.tsx`** - Rewrite to use profile instead of localStorage

### Edge Cases Handled
- **Guest users**: Will still see welcome carousel, but state won't persist
- **Existing users**: One-time migration from localStorage to database
- **Slow network**: Optimistic local updates prevent UI flickering
- **Multiple tabs**: Database source of truth prevents conflicts

