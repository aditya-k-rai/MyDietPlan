import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' };
  return { label: 'Obese', color: 'text-red-400' };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  // Mifflin-St Jeor
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const factors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  return Math.round(bmr * (factors[activityLevel] ?? 1.2));
}

export function calculateMacros(
  tdee: number,
  goal: string
): { calories: number; protein: number; carbs: number; fat: number } {
  let calories = tdee;
  if (goal === 'weight-loss') calories = tdee - 500;
  if (goal === 'weight-gain' || goal === 'muscle-gain') calories = tdee + 500;

  const proteinPercent = goal === 'muscle-gain' ? 0.35 : 0.25;
  const fatPercent = 0.3;
  const carbPercent = 1 - proteinPercent - fatPercent;

  return {
    calories: Math.round(calories),
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
  };
}

export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), in: Math.round(totalIn % 12) };
}
export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * 2.54;
}
