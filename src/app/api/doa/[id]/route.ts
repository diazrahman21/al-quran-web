import { NextResponse } from 'next/server';
import { getDoaById } from '@/lib/doa';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doa = await getDoaById(Number(id));

  if (!doa) {
    return NextResponse.json({ message: 'Doa tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ data: doa });
}
