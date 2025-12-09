import Link from 'next/link';

interface SurahCardProps {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function SurahCard({
  number,
  name,
  englishName,
  englishNameTranslation,
  numberOfAyahs,
  revelationType
}: SurahCardProps) {
  return (
    <Link href={`/surah/${number}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all p-4 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-700 dark:text-green-300 font-bold">
                {number}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {englishName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {englishNameTranslation} • {numberOfAyahs} ayat
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-arabic text-green-700 dark:text-green-400 mb-1">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {revelationType}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
