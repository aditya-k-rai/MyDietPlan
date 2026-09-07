# NutriAI — Mobile App, Cross-Platform Sync & Progress Tracking
## Addendum to System Specification | Version 2.0

> Supplements the existing NutriAI Full System Prompt (v1.0)
> Covers: React Native Mobile App · Web + Mobile Data Sync · Admin Panel (Web Only) ·
>         Progress Tracking · Soaking & Meal Alarms · Custom Consumption Logging

---

## OVERVIEW OF ADDITIONS

The NutriAI platform now ships as **two client applications sharing one backend**:

| Surface | Framework | Admin Panel | Mobile Extras |
|---|---|---|---|
| **Web App** | Next.js 15 | ✅ Yes | ❌ No |
| **Mobile App** | React Native (Expo) | ❌ No | ✅ Yes |
| **Backend API** | NestJS | Serves both | Serves both |

The single NestJS backend serves both clients. All user data (plans, calendar, foods, progress, alarms) is stored centrally in PostgreSQL and stays in sync in real time. The mobile app adds three exclusive features not available on web:

1. **Progress Section** — tick off consumed foods, log how much you actually ate
2. **Alarm System** — soaking reminders and meal-time notifications
3. **Extra Consumption Logging** — add unplanned food; nutrients calculated and stacked

---

## SECTION A — MONOREPO ARCHITECTURE

Use **Turborepo** to manage the entire project as a single monorepo with shared packages.

```
nutriai/
├── apps/
│   ├── web/              ← Next.js 15 (Web App + Admin Panel)
│   ├── mobile/           ← React Native Expo (Mobile App)
│   └── api/              ← NestJS Backend
│
├── packages/
│   ├── types/            ← Shared TypeScript types & Zod schemas
│   ├── api-client/       ← Shared TanStack Query hooks + API calls
│   ├── utils/            ← Shared utility functions (nutrient calc, unit conversion)
│   ├── constants/        ← Shared constants (allergy IDs, disease codes, etc.)
│   └── config/           ← Shared ESLint, TypeScript base config
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### What is Shared (packages/)
- All TypeScript interfaces and types (User, DietPlan, Food, Disease, etc.)
- Zod validation schemas (same schema validates web forms AND mobile inputs)
- All API call functions and TanStack Query hooks — same hooks work in both Next.js and React Native
- Nutrition calculation utilities (macro math, TDEE, BMI formulas, unit converters)
- All constant lists (disease IDs, allergy IDs, food categories, calculator formulas)

### What is Platform-Specific
- Web: Next.js routing, Tailwind CSS, Framer Motion, Admin panel components
- Mobile: Expo navigation, NativeWind / React Native StyleSheet, Reanimated, Push Notifications, SQLite offline store, Alarm scheduling

---

## SECTION B — MOBILE TECH STACK (EXACT)

### Core
- **Framework**: React Native with **Expo SDK 52+** (Expo Router v4 for file-based navigation)
- **Language**: TypeScript (strict, matches web)
- **Navigation**: Expo Router (file-based, same mental model as Next.js App Router)
- **Styling**: **NativeWind v4** (Tailwind CSS syntax for React Native) + custom StyleSheet for complex layouts

### State & Data
- **Global State**: Zustand (same store shape as web — shared from `packages/`)
- **Server State**: TanStack Query v5 (same hooks from `packages/api-client`)
- **Offline Storage**: Expo SQLite (via `expo-sqlite`) — local cache of current plan, today's progress, pending sync queue
- **Secure Storage**: Expo SecureStore — store auth tokens, user credentials

### UI Components
- **Component Library**: React Native Paper or custom design system (mirroring web shadcn/ui tokens)
- **Bottom Sheets**: `@gorhom/bottom-sheet` (for food detail popup, quantity selector, food picker)
- **Animations**: React Native Reanimated v3
- **Charts**: Victory Native XL or `react-native-gifted-charts`
- **Gestures**: React Native Gesture Handler

### Platform Features
- **Push Notifications + Local Alarms**: `expo-notifications` (local scheduled notifications)
- **Background Tasks**: `expo-background-fetch` + `expo-task-manager`
- **Haptics**: `expo-haptics` (vibration on tick, warning pulse)
- **Health / Wearable**: `react-native-health` (Apple HealthKit) + `@perfood/react-native-health-connect` (Google Health Connect / Samsung Health)

### Build & Distribution
- **OTA Updates**: Expo EAS Update (push JS updates without App Store review)
- **App Build**: Expo EAS Build (cloud build for iOS + Android)
- **Store**: Google Play Store + Apple App Store
- **CI/CD**: GitHub Actions → EAS Build → Store submission

---

## SECTION C — CROSS-PLATFORM DATA SYNC ARCHITECTURE

### Single Source of Truth
**PostgreSQL (via NestJS backend)** is the single source of truth. Both web and mobile read from and write to the same database through the same API. There is no separate mobile database — only a local offline cache.

### Real-Time Sync (WebSockets)
- Backend runs a **Socket.io** server alongside the REST API
- When the user is active on both web and mobile simultaneously:
  - Any change on web (e.g., updating a meal) fires a `plan:updated` socket event
  - Mobile receives it and re-fetches or patches local TanStack Query cache
  - Vice versa: ticking a food on mobile fires `progress:updated` → web reflects it instantly
- Socket rooms are namespaced per user: `user:{userId}`

### Offline-First on Mobile
Mobile users may lose connectivity (common in India on 4G). Handle this with an **offline sync queue**:

```
SyncQueue (Expo SQLite table)
  id         TEXT PRIMARY KEY
  action     TEXT  -- 'tick_food' | 'log_extra' | 'update_quantity' | 'set_alarm'
  payload    TEXT  -- JSON stringified action data
  status     TEXT  -- 'pending' | 'synced' | 'failed'
  createdAt  TEXT
  retries    INTEGER DEFAULT 0
```

**Offline Behavior:**
1. User ticks a food while offline → write to `SyncQueue` and update local SQLite cache immediately (optimistic UI)
2. When connectivity returns, `expo-background-fetch` triggers `processSyncQueue()`
3. Each pending action is replayed against the API in order
4. On success: mark `synced`, remove from queue
5. On conflict: last-write-wins for quantity edits; for ticks, server state takes precedence with a conflict resolution prompt

### Sync State Indicators (Mobile UI)
- Green dot: Synced
- Yellow dot: Syncing...
- Red dot: Offline — changes saved locally
- Tapping the indicator shows "X actions pending sync"

### Session & Auth Sync
- Google OAuth happens on device via `expo-auth-session` + `expo-web-browser`
- JWT stored in `expo-secure-store`
- Same JWT accepted by the NestJS API as on web
- Token refresh handled automatically via TanStack Query's `onError` interceptor

---

## SECTION D — ADMIN PANEL (WEB ONLY)

The Admin Panel lives exclusively at `/admin` in the Next.js web app. The mobile app has no admin screens. All admin actions affect data that is immediately visible on both web and mobile for the target user.

### Admin Can See on Mobile Users:
- Last time user opened the mobile app (stored in `User.lastOnline` + `User.lastPlatform`)
- Whether a user is on Free or Premium on mobile
- All plans created via mobile (tagged `source: "mobile"`)
- Today's progress data for any user (foods ticked, quantities consumed, extra logs)
- Active alarms set by the user (view only — admin cannot modify alarms)
- Offline queue status (how many unsynced actions are pending)

### Admin Control Panel — Mobile-Specific Columns Added to User Table

| New Column | Description |
|---|---|
| Last Platform | Web / Mobile / Both |
| App Version | Installed Expo app version |
| Progress Today | % of today's plan completed |
| Alarms Active | Count of active alarms |
| Offline Pending | Unsynced action count |

### Admin Can Do (affects mobile + web both):
- Restrict user → immediately blocks mobile app too (API returns 403)
- Unrestrict user → mobile access restored on next app open
- View full progress history (day-by-day consumption logs)
- View all alarms the user has set (read only)
- Push a notification to a specific user's device (admin broadcast feature)
- View every extra consumption log entry

---

## SECTION E — MOBILE APP SCREENS & NAVIGATION

### Tab Bar (Bottom Navigation — 5 Tabs)

```
[ Home ] [ Plan ] [ Progress ] [ Calculator ] [ Profile ]
   🏠       📋        ✅            🧮             👤
```

### Screen Map

```
(Tab 1) Home
  └── Dashboard — today's summary, calorie ring, water ring, meal timeline

(Tab 2) Plan
  ├── Today's Plan — meals list with foods
  ├── Weekly Calendar (mobile view)
  ├── Monthly Calendar (mobile view)
  └── AI Generator — same flow as web

(Tab 3) Progress ← MOBILE EXCLUSIVE
  ├── Today Progress Screen
  │   ├── Meal Cards with Tick Buttons
  │   ├── Extra Food Log
  │   └── Nutrient Summary (Planned vs. Actual)
  ├── Progress History (past 30 days)
  └── Streak & Badges

(Tab 4) Calculators
  └── All 18 calculators (same as web, native UI)

(Tab 5) Profile
  ├── Edit Profile
  ├── Health Data
  ├── Allergies & Diseases
  ├── Alarms & Reminders ← MOBILE EXCLUSIVE
  ├── Wearable Sync
  ├── Subscription
  └── Settings
```

---

## SECTION F — MOBILE EXCLUSIVE FEATURE 1: PROGRESS SECTION

### F.1 Overview

The Progress tab is the daily food consumption tracker. It shows the user's plan for today and lets them:
- Mark each food as eaten (with a tick)
- Specify the exact amount they consumed in grams/ml/pieces
- Add any extra food they ate outside the plan
- See a live "Planned vs. Actual" nutrient comparison

### F.2 Today Progress Screen — Layout

```
┌─────────────────────────────────────┐
│  Today's Progress        Tue 4 Aug  │
│  ──────────────────────────────────  │
│  🍽️  1,420 / 1,800 kcal consumed   │
│  [████████████░░░░░░░░] 79%          │
│                                      │
│  Protein  87g / 120g  [████████░░]   │
│  Carbs    165g / 200g [████████░░]   │
│  Fat      48g / 60g   [█████████░]   │
└─────────────────────────────────────┘

┌─── BREAKFAST ─────────────── 8:00 AM ┐
│  [✅] Oats           80g   310 kcal  │
│  [✅] Banana (Eaten: 1 piece) 89 kcal│
│  [⭕] Almond         20g   116 kcal  │  ← not ticked yet
└──────────────────────────────────────┘

┌─── LUNCH ──────────────────── 1:00 PM ┐
│  [⭕] Brown Rice     150g  195 kcal   │
│  [⭕] Paneer         100g  265 kcal   │
│  [⭕] Spinach        50g   23 kcal    │
└───────────────────────────────────────┘

┌─── SNACK ──────────────────── 4:00 PM ┐
│  [⭕] Peanuts        30g   170 kcal   │
└───────────────────────────────────────┘

┌─── DINNER ─────────────────── 8:00 PM ┐
│  [⭕] Dal Moong      200g  148 kcal   │
│  [⭕] Roti (Wheat)   2 pcs  200 kcal  │
└───────────────────────────────────────┘

  [+ Add Extra Food Eaten]

  [View Full Nutrient Breakdown]
```

### F.3 Tick Button Behavior — Full Flow

**Step 1: User taps the circle ⭕ next to a food item**
- Haptic feedback (light vibration)
- A **bottom sheet** slides up from the bottom

**Step 2: Quantity Consumed Bottom Sheet**

```
┌────────────────────────────────────┐
│  How much did you eat?             │
│                                    │
│  🥜 Almond                         │
│  Planned: 20g (116 kcal)          │
│                                    │
│  [ ← ] [  18g  ] [ → ]  ← stepper │
│  ───────────────────────────────   │
│  [■■■■■■■■■░░░░] Slider 0–50g     │
│                                    │
│  Actual: 18g → 104 kcal           │
│          Protein: 3.8g            │
│          Fat: 9.2g                 │
│          Carbs: 2.6g               │
│                                    │
│  Did you eat anything extra?       │
│  [+ Add extra item]                │
│                                    │
│  [Cancel]          [✅ Mark Eaten] │
└────────────────────────────────────┘
```

**Step 3: On "Mark Eaten"**
- The ⭕ becomes a ✅ (animated checkmark, green fill)
- The consumed quantity and nutrients are recorded in `ProgressLog`
- The top progress bars and calorie ring update in real time
- If consumed < planned: difference shown as "(−X kcal below plan)"
- If consumed > planned: bar exceeds and shows in amber "(+X kcal above plan)"

**Partial Consumption Edge Cases:**
- User can re-tap ✅ to edit quantity (opens the same bottom sheet pre-filled)
- User can long-press ✅ → "Mark as Skipped" → food shown in grey with a strikethrough, 0 nutrients added

### F.4 Database: ProgressLog Table

```prisma
model ProgressLog {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  date             DateTime // day only (no time) for grouping
  planFoodId       String?  // reference to PlanFood (nullable for extra items)
  foodId           String   // reference to Food
  food             Food     @relation(fields: [foodId], references: [id])
  mealType         String   // breakfast/lunch/dinner/snack
  plannedQuantity  Float?   // in grams/ml/pieces
  consumedQuantity Float    // actual consumed
  unit             String   // g / ml / piece
  status           String   // 'eaten' | 'skipped' | 'extra' | 'partial'
  isExtra          Boolean  @default(false) // true if NOT from plan
  consumedCalories Float
  consumedProtein  Float
  consumedCarbs    Float
  consumedFat      Float
  consumedFiber    Float
  // (store all other macros/micros as JSON for full accuracy)
  extraNutrients   Json?
  loggedAt         DateTime @default(now())
  syncedAt         DateTime?
  source           String   @default("mobile") // 'mobile' | 'web'
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### F.5 Live Nutrient Summary Panel

After tapping "View Full Nutrient Breakdown" at the bottom of the Progress screen:

```
┌──────── Today's Nutrition Summary ────────┐
│                    Planned    Consumed     │
│ Calories           1,800      1,420 ✅    │
│ Protein            120g       87g  🟡     │
│ Carbohydrates      200g       165g ✅     │
│ Fat                60g        48g  ✅     │
│ Fiber              30g        18g  🔴     │
│ Water              2,500ml    1,200ml 🔴  │
│                                           │
│ Vitamin D          600IU      310IU 🟡    │
│ Calcium            1000mg     620mg 🟡    │
│ Iron               18mg       14mg  🟡    │
│ ... (all nutrients)                       │
│                                           │
│ Legend: ✅ ≥90%  🟡 60–89%  🔴 <60%      │
└───────────────────────────────────────────┘
```

### F.6 Progress History Screen (Past 30 Days)

- Calendar heatmap: each day colored by plan completion % (green = 90%+, amber = 60–89%, red = <60%, grey = no data)
- Tapping any past day: shows that day's ProgressLog (read-only)
- Weekly averages: avg calories consumed, avg protein, avg compliance %
- Streak counter: "🔥 5-day streak — keep going!"

### F.7 Badges & Streaks

| Badge | Condition |
|---|---|
| 🌱 First Plan | Completed first day |
| 🔥 Week Warrior | 7-day streak |
| 💪 Protein Pro | Hit protein goal 5 days in a row |
| 💧 Hydration Hero | Logged water 7 days straight |
| 🎯 Perfect Day | 100% plan compliance on any day |
| 🧘 Consistent | 30-day streak |

---

## SECTION G — MOBILE EXCLUSIVE FEATURE 2: ALARM SYSTEM

### G.1 Two Types of Alarms

**Type 1 — Soaking Alarm** 🫗
Foods like chickpeas, kidney beans, lentils, almonds, walnuts, and chia seeds benefit from soaking 6–12 hours before eating. The soaking alarm fires well before the meal so the user remembers to soak in advance.

**Type 2 — Meal/Eating Alarm** 🍽️
A reminder to eat a specific meal at its scheduled time.

### G.2 Soaking Alarm — Full Logic

**Automatic Detection:**
When the AI generates a diet plan or the user adds a food to their plan, the system checks: `food.requiresSoaking === true` and `food.soakDurationHours` (e.g., Chickpeas = 8 hours, Almonds = 8 hours, Rajma = 12 hours, Chia = 30 minutes).

If a food requires soaking AND has a scheduled meal time, the app automatically suggests a soaking alarm:

```
┌──────────────────────────────────────────┐
│  💧 Soaking Reminder Suggested           │
│                                          │
│  Your lunch includes Chickpeas (100g)    │
│  which should soak for 8 hours.          │
│                                          │
│  Lunch is at 1:00 PM                     │
│  → Soak alarm suggested at: 5:00 AM     │
│                                          │
│  Adjust time:  [04:30]  [05:00]  [05:30] │
│                                          │
│  [Skip]          [✅ Set Soaking Alarm]  │
└──────────────────────────────────────────┘
```

**Manual Soaking Alarm Setup:**
User can go to Profile → Alarms → Add Soaking Alarm:
- Select food from their plan or search database
- Set soak duration (pre-filled from food DB, editable)
- Set the meal time (when they plan to eat)
- App calculates: `meal_time − soak_duration = alarm_time`
- Confirm and schedule

### G.3 Meal/Eating Alarm — Full Logic

**Automatic Setup:**
When a plan is generated with meal times (e.g., Breakfast 8:00 AM), the app asks:

```
┌──────────────────────────────────────────┐
│  🍽️ Set Meal Reminders?                  │
│                                          │
│  Breakfast  8:00 AM   [✅ ON]  [Edit]    │
│  Lunch      1:00 PM   [✅ ON]  [Edit]    │
│  Snack      4:30 PM   [✅ ON]  [Edit]    │
│  Dinner     8:00 PM   [✅ ON]  [Edit]    │
│                                          │
│  Remind me  [15 min before] ▼           │
│                                          │
│  [Skip All]         [Save All Alarms]   │
└──────────────────────────────────────────┘
```

**Reminder lead time options:**
At meal time / 5 min before / 10 min before / 15 min before / 30 min before

**Manual Meal Alarm Setup:**
User can go to Profile → Alarms → Add Meal Alarm:
- Select meal type (Breakfast / Lunch / Dinner / Snack / Water)
- Set time (time picker)
- Set repeat: Once / Daily / Weekdays / Weekends / Custom days
- Set lead time
- Optional: Add a note (e.g., "Don't forget to take your iron tablet 30 min before")

### G.4 Water Reminder Alarm

Additional sub-type: Water Intake Reminder
- Set a repeating notification every X hours (e.g., every 2 hours from 8 AM to 10 PM)
- Each notification: "💧 Time to drink water! Tap to log your intake."
- Tapping the notification opens a quick-log modal (250ml / 350ml / 500ml / custom)
- Water intake tracked in `ProgressLog` with `mealType: "water"`

### G.5 Alarm Implementation (expo-notifications)

```typescript
// packages/mobile/src/alarms/scheduleAlarm.ts

import * as Notifications from 'expo-notifications';

export async function scheduleSoakingAlarm(params: {
  foodName: string;
  soakAt: Date;        // soak_time = meal_time - soak_duration
  mealTime: Date;
  foodId: string;
}) {
  const { foodName, soakAt, mealTime, foodId } = params;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🫗 Time to Soak Your ${foodName}!`,
      body: `Soak now so it's ready by ${format(mealTime, 'h:mm a')}`,
      data: { type: 'soak', foodId },
      sound: true,
    },
    trigger: {
      date: soakAt,
    },
  });
}

export async function scheduleMealAlarm(params: {
  mealType: string;   // 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  mealTime: Date;
  leadMinutes: number; // 0 | 5 | 10 | 15 | 30
  repeat: 'once' | 'daily' | WeekdayMap;
}) {
  const triggerTime = subMinutes(params.mealTime, params.leadMinutes);

  const messages: Record<string, { title: string; body: string }> = {
    Breakfast: { title: '🌅 Breakfast Time!', body: 'Start your day right — your plan is ready.' },
    Lunch:     { title: '🍽️ Lunch Time!', body: 'Time to fuel up. Check your plan.' },
    Dinner:    { title: '🌙 Dinner Time!', body: 'Evening meal time — check your plan.' },
    Snack:     { title: '🥜 Snack Time!', body: 'Quick snack — keep your energy up!' },
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      ...messages[params.mealType],
      data: { type: 'meal', mealType: params.mealType },
      sound: true,
    },
    trigger: params.repeat === 'daily'
      ? { hour: triggerTime.getHours(), minute: triggerTime.getMinutes(), repeats: true }
      : { date: triggerTime },
  });
}
```

### G.6 Alarm Management Screen

`Profile → Alarms & Reminders`

```
┌────────── Alarms & Reminders ──────────┐
│                                        │
│  🍽️ MEAL REMINDERS                     │
│  ─────────────────────────────────     │
│  Breakfast  7:45 AM  Daily  [ON 🟢]   │
│  Lunch      12:45 PM Daily  [ON 🟢]   │
│  Snack      4:30 PM  Daily  [OFF ⚫]   │
│  Dinner     7:45 PM  Daily  [ON 🟢]   │
│  [+ Add Meal Alarm]                    │
│                                        │
│  🫗 SOAKING REMINDERS                  │
│  ─────────────────────────────────     │
│  Chickpeas — Soak at 5:00 AM  [ON 🟢] │
│    → For Lunch at 1:00 PM             │
│  Almonds — Soak at 10:00 PM   [ON 🟢] │
│    → For Breakfast at 6:00 AM         │
│  [+ Add Soaking Alarm]                 │
│                                        │
│  💧 WATER REMINDERS                    │
│  ─────────────────────────────────     │
│  Every 2 hours, 8 AM – 10 PM [ON 🟢]  │
│  [Edit]                                │
└────────────────────────────────────────┘
```

### G.7 Alarm Database Schema

```prisma
model Alarm {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  type          String   // 'meal' | 'soak' | 'water' | 'medication' | 'custom'
  label         String   // e.g., "Breakfast", "Soak Chickpeas"
  alarmTime     String   // HH:MM 24hr format (e.g., "07:30")
  leadMinutes   Int      @default(0)
  repeatDays    String   // JSON: ["mon","tue","wed","thu","fri","sat","sun"] or "daily" or "once"
  isActive      Boolean  @default(true)
  foodId        String?  // for soaking alarms
  food          Food?    @relation(fields: [foodId], references: [id])
  mealType      String?  // for meal alarms
  soakDuration  Int?     // hours — for soaking alarms
  mealTime      String?  // HH:MM — meal this soaking is for
  expoToken     String?  // push token snapshot at scheduling time
  note          String?  // optional user note
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Push notification tokens are stored in `User.expoPushTokens` (array — user may have multiple devices).

---

## SECTION H — MOBILE EXCLUSIVE FEATURE 3: EXTRA CONSUMPTION LOGGING

### H.1 What It Is

Beyond the planned diet, users often eat additional food. The extra logging feature lets them record anything they ate outside the plan, and the nutrients are automatically calculated and added to their day's actual totals.

### H.2 Entry Points

1. **Inside Tick Bottom Sheet**: "Did you eat anything extra?" → [+ Add extra item]
2. **Progress Screen bottom**: [+ Add Extra Food Eaten] button
3. **Home Screen quick-add**: FAB (Floating Action Button) → "Log Food"

### H.3 Extra Food Log Flow

**Step 1: Open Extra Food Logger**
```
┌────────── Log Extra Food ──────────────┐
│  What else did you eat?                │
│                                        │
│  🔍 Search food...                     │
│  ─────────────────────────────────     │
│  Recent: Biscuit  Chai  Apple         │
│  ─────────────────────────────────     │
│  [Scan Barcode] 📷                     │
└────────────────────────────────────────┘
```

**Step 2: Search Result Selected (e.g., "Biscuit")**
```
┌────────── Biscuit (Parle-G) ──────────┐
│  Per 100g: 458 kcal                   │
│                                        │
│  Which meal was this with?             │
│  [Breakfast] [Lunch] [Snack] [Dinner] │
│  [Between meals / Other]              │
│                                        │
│  How much did you eat?                │
│                                        │
│  Quantity: [30] g                     │
│  [■■░░░░░░░░] Slider 0–200g           │
│                                        │
│  → 137 kcal  Protein: 2g  Carbs: 21g │
│     Fat: 5g  Fiber: 0.4g              │
│                                        │
│  When did you eat this?               │
│  [Now]  [Custom time picker]           │
│                                        │
│  [Cancel]        [✅ Log This Food]   │
└────────────────────────────────────────┘
```

**Step 3: After Logging**
- Food appears in the Progress screen under its assigned meal (or under "Other")
- Marked with a 📍 pin icon to distinguish it from planned foods
- Progress bars and calorie ring update immediately
- The day's nutrient summary (planned vs. actual) now includes the extra food's nutrients
- Synced to server → visible in Admin panel → visible on web Progress view

### H.4 "What Else He Had" — Nutrient Accumulation Logic

```typescript
// packages/utils/src/nutrition/accumulate.ts

export function accumulateDayNutrients(progressLogs: ProgressLog[]): DayNutrientSummary {
  // Sum ALL logs for the day: planned + partially eaten + extra
  return progressLogs
    .filter(log => log.status !== 'skipped')
    .reduce((acc, log) => {
      const scale = log.consumedQuantity / 100; // per-100g values
      return {
        calories:  acc.calories  + (log.food.calories  * scale),
        protein:   acc.protein   + (log.food.protein   * scale),
        carbs:     acc.carbs     + (log.food.carbs     * scale),
        fat:       acc.fat       + (log.food.fat       * scale),
        fiber:     acc.fiber     + (log.food.fiber     * scale),
        // ... all nutrients
        vitaminC:  acc.vitaminC  + (log.food.vitaminC  * scale),
        iron:      acc.iron      + (log.food.iron      * scale),
        calcium:   acc.calcium   + (log.food.calcium   * scale),
        // ... etc
      };
    }, initialNutrientState);
}
```

**The accumulated total is always:**
```
Actual Day Total = Σ (planned foods eaten × consumed_quantity)
                 + Σ (extra foods logged × logged_quantity)
```

### H.5 Conflict with Disease/Allergy on Extra Food

When the user tries to log an extra food that conflicts with their disease or allergy profile:

```
┌────────── ⚠️ Health Alert ─────────────┐
│  Biscuit (Parle-G) contains:           │
│                                        │
│  🔴 HIGH SUGAR — Not recommended for   │
│     Diabetes Type 2                    │
│     (GI: 82 — High Glycemic)          │
│                                        │
│  🟡 Contains GLUTEN — You have marked  │
│     Wheat Allergy                      │
│                                        │
│  [Safer Alternative: Rice Cake]        │
│                                        │
│  [Remove]   [Log Anyway — I understand]│
└────────────────────────────────────────┘
```

---

## SECTION I — MOBILE HOME DASHBOARD

The Home tab is the first thing users see. Design it as a personal health command center.

### Layout

```
┌─── Good Morning, Aditya! ──── Tue 4 Aug ─┐
│                                           │
│  ┌── Calorie Ring ──┐  ┌── Stats ──────┐  │
│  │   1,420          │  │ 🥩 Protein    │  │
│  │   ─────  kcal    │  │   87 / 120g   │  │
│  │   1,800  goal    │  │ 🍞 Carbs      │  │
│  │   [ring chart]   │  │  165 / 200g   │  │
│  └──────────────────┘  │ 🧈 Fat        │  │
│                         │   48 / 60g    │  │
│                         └───────────────┘  │
│  ──────────────────────────────────────    │
│  💧 Water   1,200 / 2,500 ml [████░░░░]   │
│                                            │
│  🔥 Streak: 5 days   🎯 Today: 79%        │
│  ─────────────────────────────────────     │
│  UPCOMING MEALS                            │
│  🕑 Snack at 4:30 PM — 30 min away        │
│  Peanuts 30g • Banana 1 pc                │
│  [View Plan]  [Start Progress]            │
│  ─────────────────────────────────────     │
│  RECENT ALARMS                             │
│  ✅ Soaked Chickpeas (for Lunch)          │
│  🔔 Dinner reminder in 3h 22m             │
└────────────────────────────────────────────┘
```

---

## SECTION J — MOBILE-SPECIFIC API ENDPOINTS (ADDITIONS TO V1.0)

Add these endpoints to the existing NestJS API:

```
# Progress
GET    /progress/:date                  - Get progress for a specific date
POST   /progress/tick                   - Tick a planned food as eaten
PUT    /progress/:logId                 - Update consumed quantity
POST   /progress/extra                  - Log extra food eaten
DELETE /progress/:logId                 - Remove a log entry
GET    /progress/history?days=30        - Get last N days of progress logs
GET    /progress/summary/:date          - Get nutrient summary for a day

# Alarms
GET    /alarms                          - Get all alarms for current user
POST   /alarms                          - Create alarm (meal / soak / water)
PUT    /alarms/:id                      - Update alarm (time, repeat, active)
DELETE /alarms/:id                      - Delete alarm
POST   /alarms/:id/toggle               - Toggle alarm on/off
GET    /alarms/soaking-suggestions/:planId - Auto-suggest soaking alarms for a plan

# Device (push notifications)
POST   /devices/register                - Register Expo push token
DELETE /devices/:token                  - Unregister push token on logout

# Sync
GET    /sync/status                     - Get server-side sync status for user
POST   /sync/batch                      - Batch submit offline sync queue actions

# Admin (mobile data)
GET    /admin/users/:id/progress        - Admin: view user's progress logs
GET    /admin/users/:id/alarms          - Admin: view user's alarms (read only)
POST   /admin/notify/:userId            - Admin: send push notification to user
GET    /admin/devices                   - Admin: list all registered device tokens
```

---

## SECTION K — UPDATED DATABASE SCHEMA (ADDITIONS)

Additional Prisma models to add to the v1.0 schema:

```prisma
// Push Notification Token
model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  platform  String   // 'ios' | 'android'
  appVersion String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Offline Sync Queue (stored locally in Expo SQLite, mirrored here after sync)
model SyncQueueEntry {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  action     String   // 'tick_food' | 'log_extra' | 'update_qty' | 'set_alarm' | 'delete_alarm'
  payload    Json
  status     String   // 'pending' | 'synced' | 'failed'
  retries    Int      @default(0)
  errorMsg   String?
  syncedAt   DateTime?
  createdAt  DateTime @default(now())
}

// User Streak
model UserStreak {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastActiveDate  DateTime?
  updatedAt       DateTime @updatedAt
}

// User Badge
model UserBadge {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  badgeId    String   // 'first_plan' | 'week_warrior' | 'protein_pro' | etc.
  earnedAt   DateTime @default(now())
  @@unique([userId, badgeId])
}

// Add to Food model:
// requiresSoaking   Boolean @default(false)
// soakDurationHours Float?   // e.g., 8.0 for chickpeas, 0.5 for chia

// Add to User model:
// lastPlatform      String?  // 'web' | 'mobile'
// expoPushTokens    DeviceToken[]
// progressLogs      ProgressLog[]
// alarms            Alarm[]
// streak            UserStreak?
// badges            UserBadge[]
// syncQueue         SyncQueueEntry[]
```

---

## SECTION L — UPDATED PHASE PLAN (WITH MOBILE)

### Phase 1 — Foundation (Weeks 1–3) — SAME AS V1.0
Web + Backend scaffold, auth, onboarding, basic food DB, basic food search.

### Phase 2 — Core Web Features (Weeks 4–7) — SAME AS V1.0
Full food/disease/allergy/medication DBs, interaction engine, AI plan generator, PDF/Excel export, calculators.

### Phase 3 — Calendar + Advanced Web (Weeks 8–10) — SAME AS V1.0
Weekly/Monthly planner, Food AI, workout integration, wearable sync.

### Phase 4 — Mobile App Foundations (Weeks 11–13) ← NEW
- [ ] Expo project setup (Expo Router, NativeWind, Zustand shared)
- [ ] Shared `packages/types`, `packages/api-client`, `packages/utils` wired to mobile
- [ ] Google OAuth on mobile (expo-auth-session)
- [ ] Onboarding flow on mobile (same fields as web)
- [ ] All 5 tabs scaffold (Home, Plan, Progress, Calculator, Profile)
- [ ] Today's Plan view (mobile-native UI)
- [ ] Weekly + Monthly Calendar (mobile-native)
- [ ] Food detail bottom sheet (mobile-native)
- [ ] Disease + medication interaction warnings (same engine, native UI)
- [ ] All 18 calculators (native UI)

### Phase 5 — Mobile Exclusive Features (Weeks 14–15) ← NEW
- [ ] Progress Section — Today Progress screen with tick buttons
- [ ] Quantity consumed bottom sheet (slider + stepper + nutrient preview)
- [ ] Extra food logging flow (search → quantity → assign to meal)
- [ ] Nutrient accumulation engine (planned + extra → actual totals)
- [ ] Progress History (30-day calendar heatmap)
- [ ] Streak tracker + Badges
- [ ] Alarm System — meal alarm scheduler (expo-notifications)
- [ ] Alarm System — soaking alarm with auto-suggestion logic
- [ ] Alarm System — water reminder (repeating)
- [ ] Alarm Management Screen (CRUD alarms)
- [ ] Push notification token registration + DeviceToken table
- [ ] Offline sync queue (Expo SQLite + background sync via expo-background-fetch)

### Phase 6 — Sync, Admin & SEO (Weeks 16–17) ← UPDATED
- [ ] WebSocket sync (Socket.io) — real-time web ↔ mobile
- [ ] Admin Panel (web-only) — extended with mobile columns (last platform, progress %, alarms, device tokens)
- [ ] Admin broadcast push notification
- [ ] SEO pages + schema markup + sitemap
- [ ] Admin content management

### Phase 7 — Premium, Polish & Launch (Weeks 18–19) ← UPDATED
- [ ] Razorpay + Stripe subscription on web + mobile
- [ ] EAS Build setup (iOS + Android)
- [ ] App Store + Play Store listing setup
- [ ] OTA update pipeline (EAS Update)
- [ ] Dark mode (web + mobile)
- [ ] Performance audit (Lighthouse ≥ 95 web; Hermes profiler mobile)
- [ ] Accessibility audit (web WCAG 2.1 AA; mobile iOS/Android a11y)
- [ ] Final QA on physical devices (Samsung mid-range, iPhone SE, Pixel)
- [ ] Production deployment

---

## SECTION M — KEY CONSTRAINTS FOR MOBILE

1. **Progress is mobile-first, web-second**: The Progress Section is a mobile-exclusive tab. On web, a simpler "Daily Log" widget shows a read-only summary of what the user marked on mobile. The tick interaction itself is mobile only.

2. **Alarms are device-local + server-backed**: `expo-notifications` schedules alarms on-device. The alarm config is also saved to the server so that if the user reinstalls the app or switches phones, all alarms are restored from the server.

3. **Background sync must be battery-efficient**: Use `expo-background-fetch` with a minimum interval of 15 minutes. Do not run continuous background processes. The sync queue is designed for eventual consistency, not real-time.

4. **Soaking foods must be tagged in the food DB**: Add `requiresSoaking: Boolean` and `soakDurationHours: Float` to the Food model and seed data for all foods that benefit from soaking (chickpeas, kidney beans, black lentils, green moong, almonds, walnuts, chia, flaxseeds, quinoa, cashews, pumpkin seeds, sesame, oats, brown rice — minimum 30 foods tagged at launch).

5. **Offline experience is non-negotiable**: The app must be fully functional offline for viewing today's plan, ticking progress, and logging extra food. All offline actions sync when connectivity returns. If sync fails 3 times, alert the user.

6. **Google Auth on mobile uses expo-auth-session**: The same Google OAuth client ID from the web app can be used on mobile (with `scheme` configured in `app.json`). Store the returned JWT in `expo-secure-store`, never in AsyncStorage.

7. **Android permissions**: Request `POST_NOTIFICATIONS` permission (Android 13+) at the point the user first tries to set an alarm, not on app launch. Explain why before the system prompt appears.

8. **iOS background notifications**: Register for remote notifications in `AppDelegate`. Set `UNNotificationPresentationOptions` to show banners even when the app is in foreground.

9. **Haptic feedback is mandatory** on all tick interactions, alarm toggles, and warning dismissals. Use `expo-haptics` with `ImpactFeedbackStyle.Medium` for ticks, `NotificationFeedbackType.Warning` for conflict warnings.

10. **No admin screen on mobile**: If someone attempts to navigate to `/admin` on mobile, redirect to the home screen. Admin routes are enforced at the Next.js middleware level and never exposed in the Expo app's navigation.

---

*End of NutriAI Mobile & Cross-Platform Addendum — Version 2.0*
*Read alongside: NutriAI_Full_System_Prompt.md (v1.0)*
*Together, these two documents form the complete authoritative specification for the full NutriAI platform.*
