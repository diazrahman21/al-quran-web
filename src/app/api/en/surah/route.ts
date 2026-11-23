import { NextResponse } from 'next/server';
import { getAllEnglishSurahs } from '@/lib/english';

export async function GET() {
  const surahs = await getAllEnglishSurahs();
  return NextResponse.json({ data: surahs });
}
