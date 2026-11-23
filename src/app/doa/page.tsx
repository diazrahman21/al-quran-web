import Link from 'next/link';
import DoaList from '@/components/DoaList';
import { getAllDoas } from '@/lib/doa';

export const metadata = {
  title: 'Doa & Dzikir — BacaQuran',
  description: 'Kumpulan doa dan dzikir harian dengan teks Arab, transliterasi, dan terjemahan bahasa Indonesia.',
};

export default async function DoaPage() {
  const doas = await getAllDoas();

  return (
    <main className="page-container pb-16 pt-12 sm:pt-14">
      <div className="mb-8">
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[40px]">
          Doa & Dzikir
        </h1>
        <p className="mt-2.5 text-[17px] text-muted-foreground">
          {doas.length
            ? `${doas.length} doa dan dzikir dengan teks Arab, transliterasi, dan terjemahan.`
            : 'Kumpulan doa dan dzikir harian dengan teks Arab, transliterasi, dan terjemahan.'}
        </p>
      </div>

      {doas.length > 0 ? (
        <DoaList doas={doas} />
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="font-semibold">Daftar doa belum dapat dimuat</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Silakan coba lagi beberapa saat. Halaman Surah tetap bisa diakses.
          </p>
          <Link href="/surah" className="outline-button mt-5">
            Lihat Daftar Surah
          </Link>
        </div>
      )}
    </main>
  );
}
