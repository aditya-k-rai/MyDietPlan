import foodsData from './foods5k.json';

export interface IngredientElement {
  id: string;
  name: string;
  defaultGramWeight: number;
  unitName?: string;
  unitCount?: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface ServingOption {
  id: string;
  name: string;
  totalGramWeight: number;
  elementWeights: Record<string, number>;
}

export interface Food {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  subcategory: string;
  unit: 'g' | 'ml' | 'piece';
  isMealDish?: boolean;
  cuisine?: string;
  elements?: IngredientElement[];
  servingOptions?: ServingOption[];
  per100g: {
    calories: number;
    protein: number;
    totalFat: number;
    saturatedFat: number;
    monounsaturatedFat: number;
    polyunsaturatedFat: number;
    transFat: number;
    totalCarbs: number;
    sugar: number;
    fiber: number;
    starch: number;
    water: number;
    vitaminA: number;
    vitaminB1: number;
    vitaminB2: number;
    vitaminB3: number;
    vitaminB6: number;
    vitaminB12: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    calcium: number;
    iron: number;
    magnesium: number;
    phosphorus: number;
    potassium: number;
    sodium: number;
    zinc: number;
    omega3: number;
    omega6: number;
  };
  glycemicIndex: number;
  glycemicLoad: number;
  allergens: string[];
  diseaseCompatibility: Record<string, 'safe' | 'moderate' | 'avoid'>;
  bestTimeToEat: string[];
  worstTimeToEat: string[];
  benefits: string[];
  risks: string[];
  requiresSoaking: boolean;
  soakDurationHours?: number;
  isVerified: boolean;
  source: 'USDA' | 'ICMR' | 'custom';
  imageUrl?: string;
}

export const FOODS: Food[] = foodsData as Food[];

export function getFoodById(id: string): Food | undefined {
  return FOODS.find(f => f.id === id);
}

export function searchFoods(query: string, limit = 100): Food[] {
  const q = query.toLowerCase();
  const matches: Food[] = [];
  for (let i = 0; i < FOODS.length; i++) {
    const f = FOODS[i];
    if (
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.aliases.some(a => a.toLowerCase().includes(q))
    ) {
      matches.push(f);
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

export function getFoodsByCategory(category: string, limit = 100): Food[] {
  return FOODS.filter(f => f.category === category).slice(0, limit);
}

export const FOOD_CATEGORIES = Array.from(new Set(FOODS.map(f => f.category)));
