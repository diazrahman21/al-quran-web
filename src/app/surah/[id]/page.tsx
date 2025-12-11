import { getSurahWithTranslation, getSurahAudioUrl } from '@/lib/api';
import AudioPlayer from '@/components/AudioPlayer';
import AyahCard from '@/components/AyahCard';
import Link from 'next/link';
import { MdAnnouncement } from 'react-icons/md';
import { IoMdArrowRoundBack } from 'react-icons/io';

export default async function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surahId = parseInt(id);
  
  // Validate surah ID
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Surah tidak valid</p>
          <Link href="/surah" className="text-green-600 hover:text-green-700 dark:text-green-400">
            Kembali ke Daftar Surah
          </Link>
        </div>
      </div>
    );
  }

  const data = await getSurahWithTranslation(surahId);

  if (!data || !data.arabic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Surah tidak ditemukan</p>
          <Link href="/surah" className="text-green-600 hover:text-green-700 dark:text-green-400">
            Kembali ke Daftar Surah
          </Link>
        </div>
      </div>
    );
  }

  const { arabic } = data;
  const audioUrl = await getSurahAudioUrl(surahId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Surah Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-lg shadow-lg p-8 mb-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-arabic mb-3">
            {arabic.name}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {arabic.englishName}
          </h2>
          <p className="text-green-50 text-lg mb-4">
            {arabic.englishNameTranslation}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
               {arabic.numberOfAyahs} Ayat
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
               {arabic.revelationType}
            </span>
          </div>
        </div>

        {/* Deskripsi Surah */}
        {arabic.deskripsi && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <MdAnnouncement />
              Tentang Surah Ini
            </h3>
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: arabic.deskripsi }}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/surah"
            className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-2"
          >
            <IoMdArrowRoundBack size={20} />
             Kembali ke Daftar Surah
          </Link>
        </div>

        {/* Audio Player */}
        <div className="mb-6">
          <AudioPlayer audioUrl={audioUrl} surahName={arabic.englishName} />
        </div>

        {/* Ayahs */}
        <div className="space-y-6">
          {arabic.ayahs.map((ayah: any) => (
            <AyahCard key={ayah.number} ayah={ayah} />
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
