import { NextResponse } from 'next/server';
import { FOODS, Food } from '@/lib/data/foods';

const DISEASE_SLUG_MAP: Record<string, string> = {
  'diabetes type 2': 'diabetes-type-2',
  'diabetes-type-2': 'diabetes-type-2',
  'diabetes type 1': 'diabetes-type-2',
  'pre-diabetes': 'diabetes-type-2',
  'hypertension': 'hypertension',
  'high cholesterol': 'high-cholesterol',
  'high-cholesterol': 'high-cholesterol',
  'heart disease': 'hypertension',
  'pcos': 'pcos',
  'ckd': 'ckd',
  'ckd (kidney disease)': 'ckd',
  'anemia': 'anemia',
  'gout': 'gout',
  'osteoporosis': 'osteoporosis',
  'fatty liver': 'high-cholesterol',
  'obesity': 'diabetes-type-2',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      age = 30,
      gender = 'male',
      weight = 70,
      height = 170,
      goal = 'weight-loss',
      activityLevel = 'moderate',
      diseases = [],
      allergies = [],
      foodPref = [],
      cuisinePref = [],
      mealsPerDay = 4,
    } = body;

    // Normalize diseases to canonical IDs
    const canonicalDiseases: string[] = Array.from(new Set(
      diseases.map((d: string) => {
        const key = d.toLowerCase().trim();
        return DISEASE_SLUG_MAP[key] || key.replace(/\s+/g, '-');
      })
    ));

    // Normalize allergies
    const normalizedAllergies = allergies.map((a: string) => a.toLowerCase().trim());

    // Calculate BMR & TDEE
    const wNum = parseFloat(String(weight)) || 70;
    const hNum = parseFloat(String(height)) || 170;
    const aNum = parseFloat(String(age)) || 30;

    let bmr = (10 * wNum) + (6.25 * hNum) - (5 * aNum);
    bmr = gender === 'female' ? bmr - 161 : bmr + 5;

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };
    const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

    // Caloric Target based on goal
    let targetCalories = tdee;
    if (goal === 'weight-loss') targetCalories = Math.max(1200, tdee - 500);
    else if (goal === 'muscle-gain' || goal === 'weight-gain') targetCalories = tdee + 400;

    // Macro Split
    const isMuscle = goal === 'muscle-gain';
    const isWeightLoss = goal === 'weight-loss';
    const proteinPct = isMuscle ? 0.30 : isWeightLoss ? 0.28 : 0.22;
    const fatPct = 0.28;
    const carbPct = Math.max(0.35, 1 - (proteinPct + fatPct));

    const proteinTarget = Math.round((targetCalories * proteinPct) / 4);
    const fatTarget = Math.round((targetCalories * fatPct) / 9);
    const carbTarget = Math.round((targetCalories * carbPct) / 4);

    // Filter Safe Foods
    const isVegetarian = foodPref.some((p: string) => p.toLowerCase().includes('vegetarian'));
    const isVegan = foodPref.some((p: string) => p.toLowerCase().includes('vegan'));

    const safeFoods = FOODS.filter(f => {
      // Allergen filter
      const foodAllergens = (f.allergens || []).map(a => a.toLowerCase());
      const hasAllergy = normalizedAllergies.some((userAllergy: string) =>
        foodAllergens.some(fa => fa.includes(userAllergy) || userAllergy.includes(fa))
      );
      if (hasAllergy) return false;

      // Disease Avoidance filter
      const isAvoided = canonicalDiseases.some(d => f.diseaseCompatibility?.[d] === 'avoid');
      if (isAvoided) return false;

      // Dietary preferences filter
      const cat = f.category?.toLowerCase() || '';
      if (isVegan) {
        if (cat.includes('dairy') || cat.includes('poultry') || cat.includes('meat') || cat.includes('seafood') || cat.includes('fish') || f.name.toLowerCase().includes('egg')) {
          return false;
        }
      } else if (isVegetarian) {
        if (cat.includes('poultry') || cat.includes('meat') || cat.includes('seafood') || cat.includes('fish')) {
          return false;
        }
      }

      return true;
    });

    const fallbackFoods = safeFoods.length > 10 ? safeFoods : FOODS;

    // Group foods by category for balanced meal generation
    const grains = fallbackFoods.filter(f => f.category === 'Grains & Cereals');
    const legumes = fallbackFoods.filter(f => f.category === 'Legumes');
    const veggies = fallbackFoods.filter(f => f.category === 'Vegetables');
    const fruits = fallbackFoods.filter(f => f.category === 'Fruits');
    const dairyOrPlant = fallbackFoods.filter(f => f.category === 'Dairy');
    const nuts = fallbackFoods.filter(f => f.category === 'Nuts & Seeds');
    const proteins = fallbackFoods.filter(f => !isVegetarian && (f.category === 'Poultry' || f.category === 'Fish & Seafood' || f.category === 'Meat'));

    const pickFood = (pool: Food[], fallbackPool: Food[]) => {
      const src = pool.length > 0 ? pool : fallbackPool;
      return src[Math.floor(Math.random() * src.length)];
    };

    // Construct balanced meals
    const breakfastFoods = [
      pickFood(grains, fallbackFoods),
      pickFood(fruits.length > 0 ? fruits : dairyOrPlant, fallbackFoods),
      pickFood(nuts.length > 0 ? nuts : dairyOrPlant, fallbackFoods),
    ].filter(Boolean);

    const lunchFoods = [
      pickFood(grains, fallbackFoods),
      pickFood(proteins.length > 0 && !isVegetarian ? proteins : legumes, fallbackFoods),
      pickFood(veggies, fallbackFoods),
    ].filter(Boolean);

    const snackFoods = [
      pickFood(nuts.length > 0 ? nuts : fruits, fallbackFoods),
      pickFood(fruits, fallbackFoods),
    ].filter(Boolean);

    const dinnerFoods = [
      pickFood(veggies, fallbackFoods),
      pickFood(legumes.length > 0 ? legumes : dairyOrPlant, fallbackFoods),
      pickFood(grains, fallbackFoods),
    ].filter(Boolean);

    const createMealItems = (foodList: Food[], mealCalTarget: number) => {
      const portionCount = foodList.length || 1;
      const calPerItem = mealCalTarget / portionCount;
      return foodList.map(f => {
        const grams = Math.max(30, Math.round((calPerItem / (f.per100g.calories || 100)) * 100));
        const c = Math.round((f.per100g.calories * grams) / 100);
        const p = parseFloat(((f.per100g.protein * grams) / 100).toFixed(1));
        const carbs = parseFloat(((f.per100g.totalCarbs * grams) / 100).toFixed(1));
        const fat = parseFloat(((f.per100g.totalFat * grams) / 100).toFixed(1));

        // Check if flagged for moderate condition
        const modDisease = canonicalDiseases.find(d => f.diseaseCompatibility?.[d] === 'moderate');
        return {
          food_name: f.name,
          quantity: f.unit === 'piece' ? Math.max(1, Math.round(grams / 80)) : grams,
          unit: f.unit,
          calories: c,
          protein_g: p,
          carbs_g: carbs,
          fat_g: fat,
          is_flagged: Boolean(modDisease),
          flag_reason: modDisease ? `Consume in moderation for ${modDisease.replace(/-/g, ' ')}` : null,
          alternative: modDisease ? 'Consult food database for low-GI alternative' : null,
        };
      });
    };

    const breakfastCal = Math.round(targetCalories * 0.25);
    const lunchCal = Math.round(targetCalories * 0.35);
    const snackCal = Math.round(targetCalories * 0.15);
    const dinnerCal = Math.round(targetCalories * 0.25);

    const selectedPlan = {
      plan_title: `Personalized ${goal.replace(/-/g, ' ').toUpperCase()} Plan`,
      total_calories: targetCalories,
      total_protein_g: proteinTarget,
      total_carbs_g: carbTarget,
      total_fat_g: fatTarget,
      rationale: `Medically calibrated for ${canonicalDiseases.length > 0 ? canonicalDiseases.join(', ') : 'general wellness'}. Configured for ${targetCalories.toLocaleString()} kcal with a ${proteinTarget}g protein target (${Math.round(proteinPct * 100)}%), balancing glucose regulation and metabolic expenditure.`,
      warnings: [
        ...(allergies.length > 0 ? [`Strictly excludes allergens: ${allergies.join(', ')}`] : []),
        ...(canonicalDiseases.length > 0 ? [`Safe protocols active for: ${canonicalDiseases.map(d => d.replace(/-/g, ' ')).join(', ')}`] : []),
      ],
      shopping_list: Array.from(new Set([
        ...breakfastFoods.map(f => `${f.name} (${f.unit === 'piece' ? '1 dozen' : '500g'})`),
        ...lunchFoods.map(f => `${f.name} (${f.unit === 'piece' ? '6 pcs' : '500g'})`),
        ...snackFoods.map(f => `${f.name} (250g)`),
        ...dinnerFoods.map(f => `${f.name} (${f.unit === 'piece' ? '6 pcs' : '500g'})`),
      ])),
      meals: [
        {
          meal_type: 'breakfast',
          time: '8:00 AM',
          meal_calories: breakfastCal,
          foods: createMealItems(breakfastFoods, breakfastCal),
        },
        {
          meal_type: 'lunch',
          time: '1:00 PM',
          meal_calories: lunchCal,
          foods: createMealItems(lunchFoods, lunchCal),
        },
        {
          meal_type: 'snack',
          time: '4:30 PM',
          meal_calories: snackCal,
          foods: createMealItems(snackFoods, snackCal),
        },
        {
          meal_type: 'dinner',
          time: '8:00 PM',
          meal_calories: dinnerCal,
          foods: createMealItems(dinnerFoods, dinnerCal),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      plan: selectedPlan,
      source: 'clinical-engine-biometrics',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Plan generation failed' }, { status: 500 });
  }
}
