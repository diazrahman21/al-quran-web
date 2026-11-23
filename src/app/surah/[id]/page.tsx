import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSurahWithTranslation } from '@/lib/api';
import { ReciterProvider } from '@/contexts/ReciterContext';
import SurahReader from '@/components/SurahReader';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surahId = Number(id);
  if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
    return { title: 'Surah tidak ditemukan — BacaQuran' };
  }
  const data = await getSurahWithTranslation(surahId);
  return {
    title: data ? `${data.arabic.namaLatin} — BacaQuran` : 'Surah tidak ditemukan — BacaQuran',
  };
}

export default async function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surahId = Number(id);

  if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) notFound();

  const data = await getSurahWithTranslation(surahId);

  if (!data || !data.arabic?.ayahs?.length) {
    return (
      <main className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Surah tidak dapat dimuat</h1>
        <p className="text-muted-foreground">
          Data surah belum tersedia. Silakan coba lagi beberapa saat.
        </p>
        <Link href="/surah" className="outline-button">
          Kembali ke Daftar Surah
        </Link>
      </main>
    );
  }

  return (
    <ReciterProvider>
      <SurahReader surah={data.arabic} />
    </ReciterProvider>
  );
}

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, index) => ({ id: String(index + 1) }));
}
