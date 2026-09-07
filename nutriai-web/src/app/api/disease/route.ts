import { NextResponse } from 'next/server';
import { DISEASES, searchDiseases, getDiseaseById } from '@/lib/data/diseases';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const id = searchParams.get('id');

  if (id) {
    const disease = getDiseaseById(id);
    if (!disease) return NextResponse.json({ error: 'Disease protocol not found' }, { status: 404 });
    return NextResponse.json({ disease });
  }

  if (query) {
    const results = searchDiseases(query);
    return NextResponse.json({ count: results.length, diseases: results });
  }

  return NextResponse.json({ count: DISEASES.length, diseases: DISEASES });
}
