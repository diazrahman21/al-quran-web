import { getAllSurahs } from '@/lib/api';
import SurahCard from '@/components/SurahCard';

export default async function SurahPage() {
  const surahs = await getAllSurahs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Daftar Surah Al-Quran
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            114 Surah dalam Al-Quran
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {surahs.map((surah: any) => (
            <SurahCard
              key={surah.number}
              number={surah.number}
              name={surah.name}
              englishName={surah.englishName}
              englishNameTranslation={surah.englishNameTranslation}
              numberOfAyahs={surah.numberOfAyahs}
              revelationType={surah.revelationType}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
