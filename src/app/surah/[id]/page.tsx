import { getSurahWithTranslation, getSurahAudioUrl } from '@/lib/api';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

export default async function SurahDetailPage({ params }: { params: { id: string } }) {
  const surahId = parseInt(params.id);
  const data = await getSurahWithTranslation(surahId);

  if (!data || !data.arabic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Surah tidak ditemukan</p>
      </div>
    );
  }

  const { arabic, translation } = data;
  const audioUrl = getSurahAudioUrl(surahId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Surah Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-arabic text-green-700 dark:text-green-400 mb-2">
            {arabic.name}
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {arabic.englishName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {arabic.englishNameTranslation} • {arabic.numberOfAyahs} Ayat • {arabic.revelationType}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/surah"
            className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-2"
          >
            ← Kembali ke Daftar Surah
          </Link>
        </div>

        {/* Audio Player */}
        <div className="mb-6">
          <AudioPlayer audioUrl={audioUrl} surahName={arabic.englishName} />
        </div>

        {/* Ayahs */}
        <div className="space-y-6">
          {arabic.ayahs.map((ayah: any, index: number) => (
            <div
              key={ayah.number}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {ayah.numberInSurah}
                </span>
              </div>
              
              <p className="text-right text-2xl md:text-3xl leading-loose mb-4 text-gray-800 dark:text-white font-arabic">
                {ayah.text}
              </p>
              
              {translation && translation.ayahs[index] && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed border-t pt-4 border-gray-200 dark:border-gray-700">
                  {translation.ayahs[index].text}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: String(i + 1),
  }));
}
