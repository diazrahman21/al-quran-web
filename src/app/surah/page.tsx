import { getAllSurahs } from '@/lib/api';
import SurahTable from '@/components/SurahTable';

export const metadata = {
  title: 'Daftar Surah — BacaQuran',
  description: 'Jelajahi 114 surah Al-Qur’an dengan terjemahan bahasa Indonesia.',
};

export default async function SurahPage() {
  const surahs = await getAllSurahs();

  return (
    <main className="page-container pb-16 pt-12 sm:pt-14">
      <div className="mb-8">
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[40px]">
          Daftar Surah
        </h1>
        <p className="mt-2.5 text-[17px] text-muted-foreground">
          114 surah dengan terjemahan bahasa Indonesia.
        </p>
      </div>

      <SurahTable surahs={surahs} />
    </main>
  );
}
