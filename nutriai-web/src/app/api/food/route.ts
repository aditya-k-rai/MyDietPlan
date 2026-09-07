import { NextResponse } from 'next/server';
import { FOODS, searchFoods, getFoodById } from '@/lib/data/foods';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const id = searchParams.get('id');

  if (id) {
    const food = getFoodById(id);
    if (!food) return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    return NextResponse.json({ food });
  }

  if (query) {
    const results = searchFoods(query);
    return NextResponse.json({ count: results.length, foods: results });
  }

  return NextResponse.json({ count: FOODS.length, foods: FOODS });
}
