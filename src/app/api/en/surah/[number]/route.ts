import { NextResponse } from 'next/server';
import { getEnglishSurahByNumber } from '@/lib/english';

export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const surah = await getEnglishSurahByNumber(Number(number));

  if (!surah) {
    return NextResponse.json({ message: 'Surah tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ data: surah });
}
