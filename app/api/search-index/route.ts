import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

let cache: any[] | null = null;

export async function GET() {
  if (cache) return NextResponse.json(cache, { headers: { 'Cache-Control': 'public, max-age=300' } });
  try {
    const p = path.join(process.cwd(), 'content', 'search-index.json');
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    cache = Array.isArray(data) ? data : (data.items ?? []);
    return NextResponse.json(cache, { headers: { 'Cache-Control': 'public, max-age=300' } });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
