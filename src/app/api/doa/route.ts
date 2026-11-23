import { NextRequest, NextResponse } from 'next/server';
import { getAllDoas } from '@/lib/doa';

export async function GET(request: NextRequest) {
  const grup = request.nextUrl.searchParams.get('grup') ?? undefined;
  const tag = request.nextUrl.searchParams.get('tag') ?? undefined;
  const doas = await getAllDoas({ grup, tag });

  return NextResponse.json({ data: doas });
}
