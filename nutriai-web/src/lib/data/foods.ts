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
  if (!id) return undefined;
  
  // 1. Exact match
  const exact = FOODS.find(f => f.id === id);
  if (exact) return exact;

  const normalized = id.toLowerCase().trim();

  // 2. Base slug match: food ID starts with id- or exact base
  const prefixMatch = FOODS.find(f => f.id.startsWith(normalized + '-') || f.id.startsWith(normalized));
  if (prefixMatch) return prefixMatch;

  // 3. Simplified slug match (e.g. oats-rolled -> oats, chickpeas -> chana-chickpeas)
  const simplified = normalized.replace(/-(rolled|whole|raw|fresh|firm|cooked|organic)/g, '');
  const simplifiedMatch = FOODS.find(f => f.id.includes(simplified) || f.id.startsWith(simplified));
  if (simplifiedMatch) return simplifiedMatch;

  // 4. Token & alias matching
  const words = normalized.split('-').filter(w => w.length > 2);
  const tokenMatch = FOODS.find(f => {
    const fName = f.name.toLowerCase();
    const fId = f.id.toLowerCase();
    if (words.length > 0 && words.every(w => fName.includes(w) || fId.includes(w))) return true;
    return f.aliases.some(a => words.every(w => a.toLowerCase().includes(w)));
  });
  if (tokenMatch) return tokenMatch;

  // 5. General substring match in name or aliases
  const phrase = normalized.replace(/-/g, ' ');
  return FOODS.find(f => 
    f.name.toLowerCase().includes(phrase) || 
    f.aliases.some(a => a.toLowerCase().includes(phrase))
  );
}

export function searchFoods(query: string, limit = 100): Food[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOODS.slice(0, limit);
  const words = q.split(/\s+/);
  const matches: Food[] = [];
  for (let i = 0; i < FOODS.length; i++) {
    const f = FOODS[i];
    const nameLower = f.name.toLowerCase();
    const catLower = f.category.toLowerCase();
    const match = words.every(w => 
      nameLower.includes(w) || 
      catLower.includes(w) || 
      f.aliases.some(a => a.toLowerCase().includes(w))
    );
    if (match) {
      matches.push(f);
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

export function getFoodsByCategory(category: string, limit = 100): Food[] {
  if (category === 'All') return FOODS.slice(0, limit);
  return FOODS.filter(f => f.category === category).slice(0, limit);
}

export const FOOD_CATEGORIES = Array.from(new Set(FOODS.map(f => f.category)));

