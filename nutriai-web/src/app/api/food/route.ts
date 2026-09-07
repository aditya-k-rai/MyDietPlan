import { NextResponse } from 'next/server';
import { FOODS, searchFoods, getFoodById, getFoodsByCategory } from '@/lib/data/foods';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  if (id) {
    const food = getFoodById(id);
    if (!food) return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    return NextResponse.json({ food });
  }

  let results = FOODS;
  if (category && category !== 'All') {
    results = getFoodsByCategory(category, 5000);
  }
  if (query) {
    results = searchFoods(query, 5000).filter(f => !category || category === 'All' || f.category === category);
  }

  const total = results.length;
  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    count: paginated.length,
    foods: paginated,
  });
}

