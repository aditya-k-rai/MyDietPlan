# NutriAI — Full System Specification & Developer Prompt

> Version 1.0 | Project Type: Full-Stack Web Application | Scope: Production-Grade
> Target: AI-Powered Nutrition, Diet Planning, and Medical Nutrition Platform

---

## OVERVIEW & VISION

Build a world-class, production-ready, AI-powered nutrition and diet planning web application. This platform must serve everyone — from healthy individuals to patients with complex medical conditions. It must function simultaneously as a Diet Planner, Nutrition Calculator, Meal Planner, AI Diet Coach, Fitness Calculator, and Medical Nutrition Planner. The platform must be SEO-dominant, medically aware, mobile-first, and built to scale to millions of users.

The AI at the core is powered by **Qwen via OpenRouter** with a strict daily/weekly usage cap per user. The platform is free to use with a Google-only sign-in, and has a premium tier for Dietitian Consultations and subscriptions.

---

## SECTION 1 — TECH STACK (EXACT)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode, no `any`)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animation**: Framer Motion
- **State Management**: Zustand (global), TanStack Query v5 (server state)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts + Nivo
- **Calendar**: FullCalendar or custom drag-and-drop calendar
- **PDF Export**: react-pdf / @react-pdf/renderer
- **Excel Export**: SheetJS (xlsx)

### Backend
- **Framework**: NestJS (TypeScript, modular architecture)
- **ORM**: Prisma ORM
- **API Style**: REST + tRPC for type-safe internal communication

### Databases
- **Primary DB**: PostgreSQL 16
- **Cache**: Redis 7
- **Search Engine**: Elasticsearch 8 or Meilisearch
- **Time-Series (optional)**: TimescaleDB for wearable data

### AI / LLM
- **Primary Model**: Qwen (via OpenRouter API)
- **Usage Cap**: 3 diet plan generations per user per day, 5 per week
- **Fallback**: Rule-based nutrition engine for plan generation if cap exceeded

### Nutrition Data Sources
- USDA FoodData Central API
- Open Food Facts API
- ICMR-NIN (Indian Food Composition Tables)
- Custom curated database (seeded and maintained manually/admin)

### Authentication
- Google OAuth 2.0 only (via NextAuth.js v5 / Auth.js)
- No passwords, no other providers

### Hosting
- **Frontend**: Vercel
- **Backend**: Railway or Fly.io
- **CDN**: Cloudflare
- **Storage**: Cloudflare R2 (assets, exports, user files)
- **Email**: Resend or SendGrid

---

## SECTION 2 — AUTHENTICATION & ONBOARDING FLOW

### 2.1 Sign-In
- One and only one method: **Google Sign-In**
- After Google OAuth success, check if user profile is complete
- If first login → redirect to **Onboarding Form** before accessing the app

### 2.2 Onboarding Form (Required after first Google login)
All fields below must be collected in a single, clean, multi-step form:

**Step 1 — Identity (Required)**
- Full Name (text input, pre-filled from Google display name, editable)
- Phone Number:
  - Country Code: Scrollable dropdown selector with flag + dial code (e.g., 🇮🇳 +91, 🇺🇸 +1)
  - Phone number input (numeric, validated per country format)
- Location:
  - City / Area (text)
  - Pincode / ZIP Code (numeric, 6-digit for India, 5-digit for US, etc.)
  - Country (auto-detected from IP, editable)

**Step 2 — Health Profile (Recommended, skippable but shown)**
- Age (number input, 1–120)
- Height (input with unit toggle: cm / ft+in)
- Weight (input with unit toggle: kg / lbs)
- Prompt user: "Adding these helps AI personalize your diet plan. You can update anytime."

**Step 3 — Quick Setup (Optional)**
- Any known allergies (multi-select from allergy list)
- Any known diseases/conditions (multi-select from disease list)
- Primary goal (Weight Loss / Weight Gain / Muscle Gain / Maintenance / Medical / General Health)

**Validation**: All required fields validated client-side with Zod. Onboarding cannot be skipped (Step 1 is mandatory). Steps 2 and 3 have a "Skip for now" option.

### 2.3 Session
- JWT-based sessions via Auth.js
- Sessions expire in 30 days (refresh token)
- All API routes protected via middleware

---

## SECTION 3 — DATABASE SCHEMA (PRISMA)

Design the Prisma schema to include the following core models. Every model must include `createdAt` and `updatedAt` timestamps.

### Core Models

```
User
  id, googleId, email, name, phone, countryCode, city, pincode, country
  age, height, heightUnit, weight, weightUnit
  goal, activityLevel, workoutType
  planCreatedCount (daily), planCreatedWeekCount
  lastOnline, isRestricted, restrictedReason
  isPremium, premiumExpiry
  createdAt, updatedAt

DietPlan
  id, userId
  title, description
  generatedBy (AI / manual)
  status (active / archived)
  meals (JSON or relation → PlanMeal)
  totalCalories, totalProtein, totalCarbs, totalFat
  createdAt, updatedAt

PlanMeal
  id, planId
  mealType (breakfast / lunch / dinner / snack)
  time (e.g., "8:00 AM")
  foods (relation → PlanFood[])

PlanFood
  id, mealId
  foodId (relation → Food)
  quantity, unit
  calories, protein, carbs, fat (computed at add time)

Food
  id, name, aliases[]
  category, subcategory
  per100g: { calories, protein, carbs, fat, fiber, ... all nutrients }
  glycemicIndex, glycemicLoad
  allergens[]
  diseases[] (foods to avoid/prefer per disease)
  unit (g / ml / piece)
  isVerified, source (USDA / ICMR / custom)
  createdAt, updatedAt

Disease
  id, name, aliases[]
  description, severity
  foodsToAvoid[], foodsToPrefer[]
  nutrients_to_limit[], nutrients_to_prioritize[]
  medications[] (relation)

Medication
  id, name, genericName, category
  foodInteractions[] (relation → MedicationFoodInteraction)

MedicationFoodInteraction
  id, medicationId, foodId
  severity (low / medium / high / critical)
  warningMessage, mechanism, continueAllowed (bool)

Allergy
  id, name, category
  crossReactives[] (other allergens it cross-reacts with)
  foods[] (foods that contain this allergen)

Calculator (logs)
  id, userId, type, inputs (JSON), result (JSON), createdAt

WearableSync
  id, userId, provider (apple / google / samsung)
  steps, heartRate, activeCalories, date

WeeklyPlan
  id, userId
  weekStart (Date)
  days (JSON: { monday: [...meals], ... })

MonthlyPlan
  id, userId
  month, year
  weeks (relation → WeeklyPlan[])

AdminLog
  id, adminId, action, targetUserId, meta (JSON), createdAt
```

---

## SECTION 4 — FOOD DATABASE (1,000 ELEMENTS)

### Scope
- 1,000 food **elements** (ingredients, not dishes)
- Examples: Soya Chunks, Peanuts, Brown Rice, Spinach, Almond, Chicken Breast, Tofu, Lentils (Dal), Quinoa, Millets, Sweet Potato, Oats, Eggs, Paneer, etc.
- Include Indian, global, and region-specific ingredients
- Each element is a raw/minimally-processed food unit (not a recipe or dish)

### Per Food Element — Full Nutrient Profile
Store the following per 100g / 100ml / 1 piece (whichever applies):

**Macronutrients**
- Calories (kcal)
- Protein (g)
- Total Fat (g) — Saturated, Monounsaturated, Polyunsaturated, Trans
- Total Carbohydrates (g) — Sugar, Fiber, Starch
- Water (g)
- Alcohol (g)
- Ash (g)

**Micronutrients — Vitamins**
- Vitamin A (RAE, mcg), Vitamin B1 (Thiamine), B2 (Riboflavin), B3 (Niacin), B5 (Pantothenic Acid), B6 (Pyridoxine), B7 (Biotin), B9 (Folate), B12 (Cobalamin)
- Vitamin C, D (D2 + D3), E (alpha-tocopherol), K (K1 + K2)
- Choline

**Micronutrients — Minerals**
- Calcium, Iron, Magnesium, Phosphorus, Potassium, Sodium, Zinc
- Copper, Manganese, Selenium, Fluoride, Chromium, Molybdenum, Iodine

**Fatty Acids**
- Omega-3 (ALA, EPA, DHA)
- Omega-6 (LA, GLA, AA)
- Omega-9

**Amino Acids (Full Profile)**
- Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Threonine, Tryptophan, Valine
- Non-essential: Alanine, Arginine, Aspartic Acid, Cysteine, Glutamic Acid, Glycine, Proline, Serine, Tyrosine

**Phytonutrients / Antioxidants**
- Polyphenols, Flavonoids (subtypes: quercetin, kaempferol, etc.)
- Carotenoids (beta-carotene, lutein, lycopene, zeaxanthin)
- Phytosterols, Glucosinolates, Isoflavones, Tannins, Lignans, Curcuminoids, Resveratrol

**Glycemic Scores**
- Glycemic Index (GI)
- Glycemic Load (GL)
- Insulin Index (II)

**Digestibility & Quality Scores**
- PDCAAS (Protein Digestibility Corrected Amino Acid Score)
- DIAAS (Digestible Indispensable Amino Acid Score)
- Overall Digestibility Score

**Metadata per Food**
- Allergens[] (tags from the 100+ allergy list)
- Disease Compatibility Tags (e.g., diabetic_safe: false, ckd_avoid: true)
- Best time to eat (morning / pre-workout / post-workout / evening / anytime)
- Worst time to eat
- Effect of cooking (raw vs boiled vs fried — nutrient retention %)
- Healthy alternatives[] (IDs of similar foods)
- Scientific references (PubMed links, text)
- Benefits[] (plain-language string array)
- Risks[] (plain-language string array)

---

## SECTION 5 — DISEASE DATABASE (100 CONDITIONS)

### Structure per Disease
- Name, common aliases, ICD-10 code
- Description (plain language)
- Severity level
- Foods strictly to avoid (with reason)
- Foods recommended / beneficial (with reason)
- Nutrients to limit (e.g., sodium for hypertension)
- Nutrients to prioritize (e.g., potassium for hypertension)
- Related medications (linked)
- Symptoms list
- Dietary strategy summary

### Example Disease List (100 total — include all of these and more)
Diabetes Type 1, Diabetes Type 2, Pre-Diabetes, Chronic Kidney Disease (CKD) Stage 1–5, Liver Disease (NAFLD, Cirrhosis), GERD / Acid Reflux, PCOS, Hypertension, High Cholesterol (Hyperlipidemia), IBS, Crohn's Disease, Ulcerative Colitis, Peptic Ulcer, Hypothyroidism, Hyperthyroidism, Fatty Liver, Cancer (general oncology diet), Pregnancy, Lactation, Anemia (Iron-Deficiency, B12), Osteoporosis, Gout, Celiac Disease, Lactose Intolerance, Food Protein-Induced Enterocolitis (FPIES), Heart Disease / CAD, Heart Failure, Post-Cardiac Surgery, Pancreatitis, Gallstones, Appendicitis (recovery), Autism (nutritional considerations), ADHD (diet support), Alzheimer's / Dementia, Parkinson's, Multiple Sclerosis, Epilepsy (including Ketogenic Diet protocol), Lupus (SLE), Rheumatoid Arthritis, Fibromyalgia, Chronic Fatigue Syndrome, Eczema / Atopic Dermatitis, Psoriasis, Acne (dietary triggers), Rosacea, HIV / AIDS (nutritional support), Tuberculosis (nutritional support), Post-COVID / Long COVID, Burns Recovery, Post-Surgery Recovery (general), Bariatric Surgery (post-op), Gastroparesis, Dumping Syndrome, Short Bowel Syndrome, Eosinophilic Esophagitis, Primary Hyperoxaluria, Phenylketonuria (PKU), Maple Syrup Urine Disease, Hemochromatosis, Wilson's Disease, Cystic Fibrosis, Sickle Cell Disease, Thalassemia, Polycythemia Vera, Myeloma, Depression (nutritional psychiatry), Anxiety (dietary support), Schizophrenia (diet support), Bipolar Disorder, Eating Disorders (Anorexia, Bulimia — with care), Obesity, Metabolic Syndrome, Insulin Resistance, Sarcopenia, Cachexia, Malnutrition, Underweight, Overweight, Childhood Obesity, Senior Nutritional Decline, Athlete Overtraining, Kidney Stones (Oxalate / Uric Acid / Calcium), Interstitial Cystitis, Prostate Health, Endometriosis, Menopause, Perimenopause, Male Infertility (diet), Female Infertility (diet), High Uric Acid, Dengue Recovery, Typhoid Recovery, Jaundice Recovery, Post-Chemotherapy Nutrition, Post-Radiation Nutrition.

---

## SECTION 6 — ALLERGY DATABASE (100+ ALLERGENS)

### Structure per Allergen
- Name, category (food group), severity level
- Foods that contain this allergen
- Hidden sources (e.g., soy in processed snacks)
- Cross-reactive allergens (e.g., latex-fruit syndrome)
- Symptoms on exposure
- Safe alternatives

### Allergy Categories & Examples
**Top 14 Major (EU + India)**
Milk (Dairy), Eggs, Fish, Crustacean Shellfish, Tree Nuts, Peanuts, Wheat / Gluten, Soy, Sesame, Mustard, Celery, Lupin, Molluscs, Sulphur Dioxide / Sulphites

**Extended List (100+ total)**
Corn / Maize, Latex (cross-reacts with banana, avocado, kiwi), Sunflower Seeds, Poppy Seeds, Hemp Seeds, Buckwheat, Amaranth, Carmine (E120 dye), Annatto, Aspartame, MSG, Nitrates / Nitrites, Alcohol, Caffeine, Histamine (Histamine Intolerance), Tyramine, Salicylates, Lectins, Oxalates, FODMAPs, Nightshades (tomato, potato, pepper, eggplant), Garlic, Onion, Fructose (Fructose Malabsorption), Sorbitol, Mango, Papaya, Pineapple, Lychee, Chickpea, Lentils, Kidney Beans, Coconut, Cinnamon, Vanilla, Ginger, Turmeric, Cloves, Black Pepper, Saffron, Yeast, Baker's Yeast, Brewer's Yeast, Carrot, Peach, Apple, Cherry, Plum, Apricot, Almond (cross-reactive), Walnut, Cashew, Pistachio, Macadamia, Brazil Nut, Hazelnut, Pine Nut, Chestnut, Quinoa, Millet, Rye, Barley, Oats (gluten-free), Kamut, Spelt, Triticale, Rice (rare), Potato, Sweet Potato, Tapioca, Arrowroot, Avocado, Banana, Kiwi, Strawberry, Blueberry, Raspberry, Grape, Pomegranate, Jackfruit, Durian, Spirulina, Chlorella, Bee Pollen, Royal Jelly, Propolis, Collagen, Gelatin, Casein, Whey, Lactalbumin, Lactoglobulin, Carrageenan, Xanthan Gum, Guar Gum, Locust Bean Gum, Pectin.

---

## SECTION 7 — AI DIET PLAN GENERATOR

### 7.1 User Input Form
Present a clean, step-by-step intake form:

| Field | Type | Notes |
|---|---|---|
| Age | Number | 1–100 |
| Gender | Select | Male / Female / Other |
| Weight | Number + unit | kg or lbs |
| Height | Number + unit | cm or ft/in |
| Disease(s) | Multi-select | From disease DB (100) |
| Allergies | Multi-select | From allergy DB (100+) |
| Activity Level | Select | Sedentary / Light / Moderate / Active / Very Active |
| Workout Type | Multi-select | Gym / Yoga / Running / Cycling / Swimming / CrossFit / Powerlifting / Hypertrophy / Bodybuilding |
| Workout Frequency | Select | 1–7 days/week |
| Goal | Select | Weight Loss / Weight Gain / Muscle Gain / Maintenance / Medical Management / General Health |
| Food Preference | Multi-select | Vegetarian / Vegan / Non-Veg / Jain / Halal / Kosher / Keto / Paleo |
| Cuisine Preference | Multi-select | Indian / Mediterranean / Asian / Continental / etc. |
| Meals per Day | Select | 3 / 4 / 5 / 6 |
| Current Medications | Text + multi-select | Free text + from medication DB |
| Budget (optional) | Select | Low / Medium / High |

### 7.2 AI Generation (Qwen via OpenRouter)

**System Prompt to send to Qwen:**
```
You are a certified medical nutritionist and dietitian AI. Generate a personalized daily diet plan in strict JSON format based on the user profile below. The plan must:
- Respect all diseases, allergies, and medications listed
- Achieve the user's stated goal (caloric surplus/deficit as needed)
- Use only real, whole foods from the food element database
- Provide breakfast, lunch, dinner, and [N] snacks based on meals_per_day
- For each food item: specify name, quantity (in grams/ml/pieces), meal time, calories, protein, carbs, fat
- Flag any food that conflicts with diseases or allergies
- Provide alternatives for every flagged food
- Calculate total daily macros and calories
- Provide a short rationale for the plan
- Output ONLY valid JSON matching the schema provided. No markdown, no explanation outside the JSON.

User Profile: {user_profile_json}
Food Database Subset: {relevant_foods_json}
Disease Constraints: {disease_constraints_json}
Allergy Constraints: {allergy_constraints_json}
```

**Output JSON Schema:**
```json
{
  "plan_title": "string",
  "total_calories": 0,
  "total_protein_g": 0,
  "total_carbs_g": 0,
  "total_fat_g": 0,
  "rationale": "string",
  "meals": [
    {
      "meal_type": "breakfast | lunch | dinner | snack",
      "time": "8:00 AM",
      "foods": [
        {
          "food_name": "string",
          "food_id": "string",
          "quantity": 0,
          "unit": "g | ml | piece",
          "calories": 0,
          "protein_g": 0,
          "carbs_g": 0,
          "fat_g": 0,
          "is_flagged": false,
          "flag_reason": null,
          "alternative": null
        }
      ],
      "meal_calories": 0
    }
  ],
  "warnings": ["string"],
  "shopping_list": ["string"]
}
```

### 7.3 Usage Limits (Enforced Server-Side)
- **Daily limit**: 3 plan generations per user (resets at midnight IST)
- **Weekly limit**: 5 plan generations per user (resets Monday midnight)
- Track via Redis: `plan_limit:daily:{userId}:{date}` and `plan_limit:weekly:{userId}:{weekNumber}`
- When limit reached: show a friendly modal — "You've used your 3 free AI plans today. Your limit resets at midnight. Come back tomorrow or upgrade to Premium."
- Do NOT block PDF/Excel export from existing plans — export is always free and unlimited

### 7.4 User Customization After Generation
After the AI generates the plan, the user can:
- **Change quantity** of any food (slider + number input; macros recalculate in real-time)
- **Swap a food** — click any food item → search bar appears → pick a replacement from the food database → macros update
- **Remove a food** from any meal
- **Add a food** to any meal from the food database
- **Change meal time** (time picker per meal)
- **Move a food** between meals (drag and drop)
- All edits trigger real-time macro/calorie recalculation
- A "Reset to AI default" button restores the original generated plan

---

## SECTION 8 — FOOD INTERACTION ENGINE

### 8.1 Disease-Food Interaction

When a user has a disease in their profile and selects or views a food:

**Flow:**
1. User selects / long-presses food in their plan or food search
2. System checks: `food.diseaseCompatibility[user.diseases]`
3. If conflict found:
   - Food element turns **red** with a pulsing warning border
   - A popup / bottom sheet appears:
     ```
     ⚠️ Warning
     [Food Name] is not recommended for [Disease Name]
     Reason: [e.g., High Glycemic Index — Raises Blood Sugar Rapidly]
     Recommended Alternative: [e.g., Stevia / Brown Rice / Cauliflower Rice]
     [Remove Food] [Keep Anyway] [See Alternative]
     ```
4. If the user clicks "See Alternative" → shows a list of safe replacements with similar macros
5. Food remains in plan with a red badge if user selects "Keep Anyway"

**Color Coding System:**
- 🟢 Green: Safe / Recommended for your conditions
- 🟡 Yellow: Consume in moderation
- 🔴 Red: Avoid — conflicts with your disease/allergy
- 🔵 Blue: Excellent choice for your specific goal
- ⚫ Grey: Neutral / No data

### 8.2 Medication-Food Interaction

When user has listed a medication and selects a food:

**Flow:**
1. System checks `medication.foodInteractions[food_id]`
2. If conflict found → popup:
   ```
   💊 Medication Interaction Alert
   You are taking [Medication Name]
   [Food Name] may interact with this medication
   Reason: [e.g., Spinach is high in Vitamin K, which reduces Warfarin's blood-thinning effect]
   Severity: HIGH
   [Remove Food] [Continue Anyway]
   ```
3. If severity is CRITICAL: user cannot add food without explicitly confirming twice
4. Interaction stored in a `MedicationFoodInteraction` log per user session

---

## SECTION 9 — FOOD DETAILS POPUP / DRAWER

### Trigger
- Long-press (mobile) or right-click / hover-info-button (desktop) on any food

### Content Structure

**Header**
- Food name (large), category tag, verified badge
- Photo (from Cloudflare R2 or fallback placeholder)
- Per: [100g] selector (user can change portion to see values)

**Tab 1: Nutrition**
Display all nutrients in a well-designed table / visual bars:
- Calories, Protein, Fat (Saturated / Unsaturated / Trans), Carbs (Sugar / Fiber / Starch), Water
- All vitamins (A, B1–B12, C, D, E, K)
- All minerals (Ca, Fe, Mg, P, K, Na, Zn, Cu, Mn, Se, I, Cr, Mo, F)
- Amino Acid profile (bar chart)
- Omega 3/6/9
- Fatty Acid breakdown
- Phytonutrients / Antioxidants / Polyphenols / Carotenoids

**Tab 2: Scores**
- Glycemic Index (with visual dial: Low / Medium / High)
- Glycemic Load
- PDCAAS score
- DIAAS score
- Digestibility %

**Tab 3: Details**
- Benefits (bulleted)
- Risks / Cautions (bulleted)
- Best time to eat
- Worst time to eat
- Effect of cooking (comparison table: raw vs boiled vs fried)
- Best combinations (synergistic foods)
- Worst combinations (antagonistic foods)

**Tab 4: Compatibility**
- Your disease compatibility (green/red/yellow tags)
- Your allergy status
- Medication interactions (if any)

**Tab 5: References**
- Scientific study references (PubMed links)
- Data source (USDA / ICMR / custom)

---

## SECTION 10 — FOOD AI (SMART ALTERNATIVE SUGGESTER)

### Feature
A search bar in the diet planner and food search page with AI-powered smart suggestions.

### Behavior

User types: **"Rice"**

System responds with:
```
You searched for: Rice
─────────────────────────────────
💡 Smarter Alternatives:

🌾 Brown Rice          → Higher Fiber, Lower GI than White Rice
🟡 Quinoa              → Complete Protein, All 9 Essential Amino Acids
🌿 Millets (Bajra/Jowar) → Richer in Iron & Magnesium, Gluten-Free
🍠 Sweet Potato        → Lower GI, Rich in Vitamin A & Potassium
🫛 Cauliflower Rice    → Very Low Carb, Good for Diabetes
─────────────────────────────────
Or continue with: White Rice (Basmati / Raw / Boiled)
```

### Implementation
- First match food from DB using Elasticsearch/Meilisearch
- Feed matched food's nutrient profile + user's disease/goal profile to a lightweight rule engine
- Rank alternatives by: (1) better nutrient profile for user's goal, (2) disease-safer options, (3) allergy-safe options
- Display reason for each suggestion (plain language)
- User can click any suggestion to get full food details or add to plan

---

## SECTION 11 — CALCULATORS

Implement every calculator below as a dedicated page and widget:

| Calculator | Inputs | Output |
|---|---|---|
| BMI | Height, Weight | BMI value, category, health risk |
| BMR | Age, Gender, Height, Weight | Calories burned at rest (Mifflin-St Jeor + Harris-Benedict) |
| TDEE | BMR + Activity Level | Total Daily Energy Expenditure |
| Lean Body Mass | Weight, Body Fat % | Lean mass in kg/lbs |
| Body Fat % | Gender, waist, hip, neck, height | Body fat %, category |
| Ideal Weight | Height, Gender, Frame | Ideal weight range (multiple formulas) |
| Water Intake | Weight, Activity, Climate | Liters/day |
| Protein Intake | Weight, Goal, Activity | g/day with meal distribution |
| Carb Intake | TDEE, Goal, Macro split | g/day |
| Fat Intake | TDEE, Goal, Macro split | g/day |
| Micronutrient Needs | Age, Gender, Condition | RDA table for all micros |
| Calories Burned | Activity type, Duration, Weight | kcal burned |
| VO₂ Max | Age, Resting HR or fitness test | ml/kg/min estimate |
| One Rep Max | Weight lifted, Reps | 1RM (Epley, Brzycki, Lombardi formulas) |
| Macro Split | TDEE, Goal | Carb/Protein/Fat % |
| Fasting Window | Meal timing | Fasting hours, eating window |
| Intermittent Fasting | IF protocol (16:8, 18:6, 5:2, OMAD) | Schedule, calorie window |
| Sleep Needs | Age, Activity | Hours recommended + sleep cycle calculator |

Each calculator must:
- Save the result to the user's `Calculator` log in DB
- Show a history of past calculations
- Allow sharing result as an image card

---

## SECTION 12 — WEEKLY & MONTHLY CALENDAR PLANNER

### Overview
A visual, interactive meal planning calendar with drag-and-drop support.

### Weekly View
- 7-column grid (Mon–Sun)
- Each day shows: Breakfast / Lunch / Dinner / Snacks
- Each meal slot is clickable → opens food picker
- Drag food between meals or days
- Color coding: green (on-target calories), yellow (over by <10%), red (over by >10%), blue (under target)
- Daily calorie/macro summary bar at the bottom of each column
- **Copy Week to Monthly Plan** button: duplicates this week into the Monthly calendar view

### Monthly View
- Standard calendar grid (4–5 week rows)
- Each day cell shows a compact summary: total calories, 2–3 food icons
- Click on any day → expand to see full day's meals
- **Copy Month to Next Month** button: clones all meals to the following month
- Supports recurring meals: right-click a meal → "Repeat every [day/week/month]"
- Highlight today's date

### Calendar Actions
- **Add Meal**: Click any meal slot → food search picker
- **Edit Food**: Click any food in a slot → edit quantity or swap
- **Delete Food**: Swipe left (mobile) or delete icon
- **Move Food**: Drag and drop between slots or days
- **Clear Day**: Right-click a day → clear all meals
- **Copy Day**: Right-click a day → copy to another day

### Data Persistence
- All calendar data saved to `WeeklyPlan` and `MonthlyPlan` in PostgreSQL
- Redis cache for current week's plan (fast load)

---

## SECTION 13 — WEARABLE INTEGRATION

### Providers
- Apple Health (via HealthKit Web / iOS app bridge)
- Google Fit (via Google Fit REST API)
- Samsung Health (via Samsung Health SDK / REST)

### Data Pulled
- Steps per day
- Active calories burned
- Resting heart rate
- Sleep duration and quality
- Workout sessions (type, duration, calories)
- Weight (if synced to wearable)

### Usage in App
- Wearable data feeds into TDEE calculation (more accurate calorie needs)
- Workout sessions auto-populate the Workout log
- "You burned 450 kcal today — your plan has been adjusted to +200 kcal" notification
- Weekly activity summary widget on dashboard

---

## SECTION 14 — WORKOUT INTEGRATION

### Supported Workout Types
Gym, Yoga, Running, Cycling, Swimming, CrossFit, Powerlifting, Hypertrophy, Bodybuilding

### Per Workout Entry
- Type, date, duration (min), intensity (low/medium/high/max)
- Calories burned (calculated or from wearable)
- Specific exercises (optional: exercise name, sets, reps, weight)

### Nutrition Adjustment
- Pre-workout meal suggestion: show recommended foods 60–90 min before workout
- Post-workout meal suggestion: show high-protein recovery foods within 30–60 min after
- Intra-workout hydration suggestion
- On rest days: auto-reduce TDEE by ~15–20% and adjust plan

---

## SECTION 15 — PREMIUM FEATURES

### Free Tier (All Users)
- Full AI diet plan access (3/day, 5/week limit)
- PDF Export (unlimited, free)
- Excel Export (unlimited, free)
- Full food database access
- All calculators
- Weekly + Monthly planner
- Food interaction engine
- Allergy warnings
- Wearable sync (basic)

### Premium Tier (Paid Subscription)
**Monthly Plan** — Users can subscribe monthly
**Yearly Plan** — Discounted annual rate

**Premium Includes:**
- Dietitian Consultation: Book 1-on-1 video/chat sessions with certified dietitians
- Priority AI response (no daily limit cap)
- Advanced wearable analytics
- Customized disease-specific meal protocols
- Verified nutrition professional badge
- Premium dashboard with health trend graphs
- Priority support

### Payment
- Razorpay (India) + Stripe (International)
- Subscription managed via webhook events
- Store: `User.isPremium`, `User.premiumExpiry`, `User.subscriptionId`

---

## SECTION 16 — ADMIN DASHBOARD

### Access
- Admin users are flagged in DB: `User.role = "admin"`
- Admin panel accessible at `/admin` (protected route, admin-only)
- Separate login check beyond Google auth

### Admin Dashboard Sections

**Section A: Overview Stats**
- Total users, Active today, New this week
- Total plans created, Plans created today
- Premium subscribers count
- AI usage today (total API calls)

**Section B: User Management Table**

Columns in the users table:
| Column | Description |
|---|---|
| User ID | Unique ID |
| Name | Full name |
| Email | Google email |
| Phone | With country code |
| Location | City + Pincode |
| Age / Height / Weight | If filled |
| Plans Created | Total count |
| Plans This Week | Count |
| Last Online | Timestamp (e.g., "2 hours ago") |
| Last Plan Created | Timestamp |
| Status | Active / Restricted |
| Premium | Yes / No |
| Actions | View / Restrict / Unrestrict / Delete |

**Filters & Search:**
- Search by name, email, phone
- Filter by: Restricted / Premium / Active in last 7 days / New users
- Sort by: Last Online, Plans Created, Date Joined

**Section C: User Detail View**

Clicking any user opens a full detail panel:
- Complete profile (all onboarding fields)
- Health data (age, height, weight, diseases, allergies, medications, goal)
- Full list of ALL diet plans they have created:
  - Plan title, creation timestamp, total calories, meals
  - Full plan expandable: shows every meal, every food, quantities, macros
  - Admin can read-only view the complete plan
- Activity log (logins, plan creates, exports)
- Wearable sync status
- Calculator history

**Section D: Restriction Controls**

Admin can:
- **Restrict User**: Blocks the user from creating new plans and accessing premium features. Requires admin to enter a reason. User sees: "Your account has been restricted. Contact support."
- **Unrestrict User**: Removes restriction with optional note
- **Soft Delete**: Hides user from list but retains data (GDPR-safe)
- **Hard Delete**: Permanently removes user and all their data (irreversible, requires confirmation)

All admin actions logged in `AdminLog` table with: adminId, action, targetUserId, reason, timestamp

**Section E: Plan Viewer**

Dedicated section for browsing all plans across all users:
- List of all plans created on the platform
- Filter by: Date, User, Goal Type, Disease, Calories Range
- Click any plan → see full structured view of meals, foods, quantities, macros
- Export any plan as PDF (admin function)

**Section F: Content Management**
- Add / Edit / Delete food items in the food database
- Add / Edit / Delete diseases
- Add / Edit / Delete medications and interactions
- Add / Edit / Delete allergies
- Bulk import via CSV / JSON upload

**Section G: AI Usage Monitor**
- Total API calls made today / this week / this month
- Cost estimate (based on token usage)
- Per-user usage breakdown
- Users approaching or who have hit daily/weekly limits

---

## SECTION 17 — SEO ARCHITECTURE

### Implementation

**Technical SEO (Next.js App Router)**
- `generateMetadata()` on every page
- Dynamic OG images (`@vercel/og`)
- Canonical URLs on all pages
- `robots.txt` and `sitemap.xml` (auto-generated, >100,000 URLs)
- `hreflang` for international pages

**Schema.org Markup (JSON-LD on every relevant page)**
- `NutritionInformation` schema on every food page
- `MedicalCondition` schema on every disease page
- `FAQPage` schema on calculators and food pages
- `HowTo` schema on guide pages
- `BreadcrumbList` on all interior pages
- `WebSite` + `SearchAction` on homepage
- `Organization` and `MedicalOrganization` on about page
- `Article` schema on blog pages

**Programmatic SEO Pages (100,000+ indexed pages)**
- `/food/[slug]` — one page per food item (1,000 pages)
- `/food/[slug]/nutrition` — detailed nutrition page
- `/disease/[slug]` — one page per disease (100 pages)
- `/disease/[slug]/diet-plan` — diet plan for each disease
- `/disease/[slug]/foods-to-avoid` — avoid list per disease
- `/disease/[slug]/foods-to-eat` — recommended list per disease
- `/allergy/[slug]` — one page per allergy (100+ pages)
- `/calculator/[type]` — one page per calculator (18+ pages)
- `/food/[slug]/vs/[slug2]` — food comparison pages (thousands)
- `/diet-plan/[goal]` — plans by goal (weight-loss, muscle-gain, etc.)
- `/diet-plan/[goal]/[cuisine]` — cuisine-specific plans
- `/blog/[slug]` — AI-generated blog articles (target: 10,000+ articles)
- `/recipes/[slug]` — future expansion
- `/nutrition/[nutrient]` — nutrient-specific pages (Vitamin D, Iron, etc.)
- `/[country]/[city]/dietitian` — location SEO (dietitian finder pages)

**Core Web Vitals Targets**
- LCP < 2.5s
- FID / INP < 200ms
- CLS < 0.1
- Lighthouse score ≥ 95 on all pages

**AEO / GEO / Voice Search**
- Answer Box-optimized headings (H2: "What foods should a diabetic avoid?")
- FAQ sections on every disease and food page
- Conversational content structure for voice queries
- LLM-friendly: clean HTML, structured facts, no JS-rendered-only content
- `speakable` schema for voice assistants

---

## SECTION 18 — UI/UX DESIGN PRINCIPLES

### Design System
- **Primary Color**: Deep Emerald Green (#065F46) — trust, health, nature
- **Accent**: Warm Amber (#F59E0B) — energy, nutrition
- **Danger/Alert**: Red (#DC2626) for food conflicts
- **Success**: Green (#16A34A)
- **Background**: Off-white (#FAFAF9) light / Deep slate (#0F172A) dark
- **Font**: Sora or Manrope (display), Inter (body), JetBrains Mono (data/numbers)

### Design Principles
- Mobile-first, responsive (360px → 4K)
- Every screen works on Indian Android devices (mid-range, 4G)
- Dark mode supported (system default + manual toggle)
- Accessibility: WCAG 2.1 AA minimum
- Reduced motion support (`prefers-reduced-motion`)
- All interactive food elements have haptic-ready touch targets (min 44×44px)
- Loading states on every async action (skeleton screens, not spinners)
- Error states are actionable (not just "Something went wrong")

### Key UX Flows
1. **First Visit → Sign In → Onboarding → Dashboard** (< 3 minutes)
2. **Create AI Plan → Customize → Export PDF** (< 5 minutes)
3. **Search Food → View Details → Add to Plan** (< 30 seconds)
4. **Check Medication Interaction** (1 tap from food detail)
5. **Admin: Find User → View All Plans → Restrict** (< 2 minutes)

---

## SECTION 19 — API ROUTE STRUCTURE (NestJS)

```
POST   /auth/google            - Google OAuth callback
GET    /auth/me                - Get current user
POST   /auth/onboarding        - Complete onboarding form

GET    /foods                  - Search/list foods (Elasticsearch)
GET    /foods/:id              - Get food detail
GET    /foods/:id/interactions - Get disease+medication interactions for a food
POST   /foods                  - Admin: create food
PUT    /foods/:id              - Admin: update food

GET    /diseases               - List diseases
GET    /diseases/:id           - Disease detail + food lists

GET    /medications            - List medications
GET    /medications/:id/interactions - Get food interactions

POST   /ai/generate-plan       - Generate AI diet plan (rate-limited)
GET    /ai/usage               - Get user's current AI usage count

GET    /plans                  - Get current user's plans
GET    /plans/:id              - Get specific plan
POST   /plans                  - Save a plan
PUT    /plans/:id              - Update/customize plan
DELETE /plans/:id              - Delete plan
POST   /plans/:id/export/pdf   - Export plan as PDF
POST   /plans/:id/export/excel - Export plan as Excel

GET    /calendar/weekly        - Get weekly plan
PUT    /calendar/weekly        - Save/update weekly plan
GET    /calendar/monthly       - Get monthly plan
PUT    /calendar/monthly       - Save/update monthly plan
POST   /calendar/weekly/copy-to-month - Copy week to month
POST   /calendar/monthly/copy-next    - Copy month to next month

POST   /calculators/calculate  - Run any calculator
GET    /calculators/history    - Get user's calculator history

GET    /wearable/status        - Check wearable connection status
POST   /wearable/sync          - Sync data from wearable
POST   /wearable/connect       - OAuth connect wearable

GET    /admin/users            - Admin: list all users
GET    /admin/users/:id        - Admin: get user + all plans
POST   /admin/users/:id/restrict   - Admin: restrict user
POST   /admin/users/:id/unrestrict - Admin: unrestrict user
DELETE /admin/users/:id        - Admin: delete user
GET    /admin/plans            - Admin: list all plans
GET    /admin/plans/:id        - Admin: view plan detail
GET    /admin/stats            - Admin: platform stats
GET    /admin/ai-usage         - Admin: AI usage monitor
```

---

## SECTION 20 — ENVIRONMENT VARIABLES

```env
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Auth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ELASTICSEARCH_URL=https://...

# AI
OPENROUTER_API_KEY=xxx
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct

# Storage
CLOUDFLARE_R2_BUCKET=xxx
CLOUDFLARE_R2_ACCESS_KEY=xxx
CLOUDFLARE_R2_SECRET_KEY=xxx
CLOUDFLARE_R2_ENDPOINT=xxx

# Nutrition Data
USDA_API_KEY=xxx
OPEN_FOOD_FACTS_APP_ID=xxx

# Payments
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
STRIPE_SECRET_KEY=xxx

# Wearable APIs
GOOGLE_FIT_CLIENT_ID=xxx
GOOGLE_FIT_CLIENT_SECRET=xxx
SAMSUNG_HEALTH_APP_ID=xxx
APPLE_HEALTH_TEAM_ID=xxx

# Email
RESEND_API_KEY=xxx
```

---

## SECTION 21 — PHASE-WISE DEVELOPMENT PLAN

### Phase 1 — Foundation (Weeks 1–3)
- [ ] Next.js 15 + NestJS project scaffold (monorepo with Turborepo)
- [ ] PostgreSQL + Prisma schema setup
- [ ] Google OAuth + Auth.js integration
- [ ] Onboarding form (Name, Phone, Location, Age, Height, Weight)
- [ ] Basic dashboard layout
- [ ] Seed 200 food elements from USDA API
- [ ] Basic food search (Meilisearch)

### Phase 2 — Core Features (Weeks 4–7)
- [ ] Full food database (1,000 elements) with all nutrients
- [ ] Disease database (100 conditions)
- [ ] Allergy database (100+ allergens)
- [ ] Medication database + food interactions
- [ ] Food detail popup (all tabs)
- [ ] Disease-food interaction engine (color coding)
- [ ] Medication-food interaction warnings
- [ ] AI plan generator (Qwen via OpenRouter) + usage rate limiting
- [ ] Plan customization UI (edit quantities, swap foods)
- [ ] PDF + Excel export

### Phase 3 — Advanced Features (Weeks 8–11)
- [ ] All 18 calculators
- [ ] Weekly + Monthly calendar planner
- [ ] Copy week to month / month to next month
- [ ] Food AI (smart alternative suggester)
- [ ] Workout integration (log + nutrition adjustment)
- [ ] Wearable sync (Google Fit, Samsung Health)
- [ ] Apple Health integration (iOS only)

### Phase 4 — Admin + SEO (Weeks 12–14)
- [ ] Full Admin Dashboard (user table, user detail, plan viewer, restriction controls)
- [ ] Admin content management (food/disease/allergy CRUD)
- [ ] Programmatic SEO pages (food, disease, calculator pages)
- [ ] JSON-LD schema on all pages
- [ ] Sitemap auto-generation (100,000+ URLs)
- [ ] Core Web Vitals optimization
- [ ] OG image generation

### Phase 5 — Premium + Polish (Weeks 15–16)
- [ ] Razorpay + Stripe subscription integration
- [ ] Dietitian consultation booking system
- [ ] Dark mode
- [ ] Progressive Web App (PWA) manifest + service worker
- [ ] Final performance audit (Lighthouse ≥ 95)
- [ ] Final accessibility audit (WCAG 2.1 AA)
- [ ] Production deployment (Vercel + Railway + Cloudflare)

---

## SECTION 22 — IMPORTANT CONSTRAINTS & NOTES

1. **No recipes in this version**: The food section shows only food elements, their nutrients, quantity, and best time to eat. Recipe generation is a future feature.

2. **AI is Qwen via OpenRouter** — not OpenAI. API calls must use OpenRouter's base URL: `https://openrouter.ai/api/v1/messages` with the `Authorization: Bearer {OPENROUTER_API_KEY}` header.

3. **Rate Limits are server-enforced**: Never trust client-side. All AI call limits (3/day, 5/week) are checked in the NestJS middleware before forwarding to OpenRouter.

4. **Google Sign-In Only**: No password field, no email magic link, no other OAuth provider. The onboarding form after Google login is mandatory for Step 1 (Name, Phone, Location).

5. **Export is always free**: PDF and Excel export of any saved plan is free and unlimited regardless of subscription tier.

6. **Admin cannot be self-registered**: Admin role must be set directly in the database. No admin registration flow in the UI.

7. **User restriction is non-destructive**: A restricted user's data (plans, profile) is retained. They simply cannot generate new plans or access premium features.

8. **Color coding is real-time**: Food color (green/yellow/red/blue) is computed client-side based on the user's loaded disease + allergy profile to avoid extra API calls.

9. **All units are user-selectable**: Every weight/volume input should support metric and imperial. Store all values in metric (kg, cm, g, ml) in the database and convert for display.

10. **Privacy**: Phone numbers and pincode are stored encrypted. User health data is never shared with third parties. Admin can view but not export user health data in bulk.

---

*End of NutriAI System Specification — Version 1.0*
*This document is the authoritative source of truth for the entire platform build.*
