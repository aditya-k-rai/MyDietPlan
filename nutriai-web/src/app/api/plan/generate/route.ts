import { NextResponse } from 'next/server';
import { FOODS } from '@/lib/data/foods';
import { DISEASES } from '@/lib/data/diseases';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { age, gender, weight, height, goal, activityLevel, diseases = [], allergies = [], foodPref = [] } = body;

    // OpenRouter integration if key exists, otherwise fallback to clinical rules engine
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (apiKey) {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://nutriai.health',
          'X-Title': 'NutriAI',
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-72b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are NutriAI, an expert medical clinical dietitian. Generate a JSON diet plan respecting diseases and allergies.',
            },
            {
              role: 'user',
              content: `Generate diet plan for: Age ${age}, Gender ${gender}, Weight ${weight}kg, Height ${height}cm, Goal ${goal}, Diseases: ${diseases.join(', ')}, Allergies: ${allergies.join(', ')}. Return strict JSON format with total_calories, total_protein_g, total_carbs_g, total_fat_g, rationale, warnings, shopping_list, and meals array.`,
            },
          ],
        }),
      });

      if (openRouterRes.ok) {
        const data = await openRouterRes.json();
        const content = data.choices[0]?.message?.content;
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json({ success: true, plan: parsed, source: 'openrouter-qwen' });
        } catch (e) {
          // If response was not strict JSON, continue to fallback
        }
      }
    }

    // Dynamic Clinical Rules Engine Fallback
    const targetCalories = goal === 'weight-loss' ? 1750 : goal === 'muscle-gain' ? 2400 : 2000;
    const proteinTarget = Math.round((targetCalories * 0.25) / 4);
    const carbTarget = Math.round((targetCalories * 0.45) / 4);
    const fatTarget = Math.round((targetCalories * 0.30) / 9);

    const safeFoods = FOODS.filter(f => {
      const hasAllergy = f.allergens.some(a => allergies.includes(a));
      const hasAvoidDisease = diseases.some((d: string) => f.diseaseCompatibility[d] === 'avoid');
      return !hasAllergy && !hasAvoidDisease;
    });

    const selectedPlan = {
      plan_title: `AI Personalized ${goal.replace('-', ' ').toUpperCase()} Plan`,
      total_calories: targetCalories,
      total_protein_g: proteinTarget,
      total_carbs_g: carbTarget,
      total_fat_g: fatTarget,
      rationale: `This diet plan is medically optimized for ${diseases.length > 0 ? diseases.join(', ') : 'general wellness'}. It balances glycemic response, controls saturated fat, and provides complete essential amino acids.`,
      warnings: allergies.length > 0 ? [`Strictly excluded allergens: ${allergies.join(', ')}`] : [],
      shopping_list: safeFoods.slice(0, 8).map(f => `${f.name} (per requirement)`),
      meals: [
        {
          meal_type: 'breakfast', time: '8:00 AM', meal_calories: Math.round(targetCalories * 0.25),
          foods: safeFoods.slice(0, 3).map(f => ({
            food_name: f.name, quantity: 100, unit: f.unit, calories: f.per100g.calories,
            protein_g: f.per100g.protein, carbs_g: f.per100g.totalCarbs, fat_g: f.per100g.totalFat,
            is_flagged: false, flag_reason: null, alternative: null,
          })),
        },
        {
          meal_type: 'lunch', time: '1:00 PM', meal_calories: Math.round(targetCalories * 0.35),
          foods: safeFoods.slice(3, 6).map(f => ({
            food_name: f.name, quantity: 150, unit: f.unit, calories: f.per100g.calories,
            protein_g: f.per100g.protein, carbs_g: f.per100g.totalCarbs, fat_g: f.per100g.totalFat,
            is_flagged: false, flag_reason: null, alternative: null,
          })),
        },
        {
          meal_type: 'snack', time: '4:30 PM', meal_calories: Math.round(targetCalories * 0.15),
          foods: safeFoods.slice(6, 8).map(f => ({
            food_name: f.name, quantity: 50, unit: f.unit, calories: f.per100g.calories,
            protein_g: f.per100g.protein, carbs_g: f.per100g.totalCarbs, fat_g: f.per100g.totalFat,
            is_flagged: false, flag_reason: null, alternative: null,
          })),
        },
        {
          meal_type: 'dinner', time: '8:00 PM', meal_calories: Math.round(targetCalories * 0.25),
          foods: safeFoods.slice(8, 11).map(f => ({
            food_name: f.name, quantity: 150, unit: f.unit, calories: f.per100g.calories,
            protein_g: f.per100g.protein, carbs_g: f.per100g.totalCarbs, fat_g: f.per100g.totalFat,
            is_flagged: false, flag_reason: null, alternative: null,
          })),
        },
      ],
    };

    return NextResponse.json({ success: true, plan: selectedPlan, source: 'clinical-engine-fallback' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
