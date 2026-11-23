'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineBookOpen,
  HiOutlineBookmark,
  HiOutlineColorSwatch,
  HiOutlineSparkles,
  HiOutlineTranslate,
} from 'react-icons/hi';
import { IoArrowForward, IoClose, IoSearch } from 'react-icons/io5';
import { LuAudioLines } from 'react-icons/lu';
import SurahBadge from '@/components/SurahBadge';
import type { SurahInfo } from '@/lib/api';
import type { EnglishSurahSummary } from '@/lib/english';
import { FALLBACK_SURAHS } from '@/lib/fallback';
import { POPULAR_SURAH_NUMBERS } from '@/lib/quran';

const features = [
  {
    icon: HiOutlineBookOpen,
    title: 'Teks Arab yang nyaman dibaca',
    description:
      'Tipografi Amiri Quran dengan ukuran huruf yang dapat diatur, tetap jernih di layar ponsel maupun desktop.',
  },
  {
    icon: HiOutlineTranslate,
    title: 'Terjemahan dua bahasa',
    description:
      'Terjemahan bahasa Indonesia dari Kementerian Agama dan bahasa Inggris dari Muhammad Asad, lengkap dengan transliterasi Latin.',
  },
  {
    icon: LuAudioLines,
    title: 'Audio dari enam qari pilihan',
    description:
      'Putar bacaan per ayat atau satu surah penuh, atur pengulangan, dan pilih qari yang paling nyaman Anda dengarkan.',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Doa & dzikir harian',
    description:
      '227 doa dari Hisnul Muslim dengan teks Arab, transliterasi, terjemahan, serta filter grup dan tag.',
  },
  {
    icon: HiOutlineBookmark,
    title: 'Penanda, salin & bagikan',
    description:
      'Simpan ayat penting, salin teks Arab beserta terjemahannya, atau bagikan tautan langsung menuju ayat.',
  },
  {
    icon: HiOutlineColorSwatch,
    title: 'Tampilan terang & gelap',
    description:
      'Mode terang dan gelap yang konsisten dengan tata letak responsif, nyaman untuk membaca siang maupun malam.',
  },
];

const stats = [
  { value: '114', label: 'Surah' },
  { value: '6.236', label: 'Ayat' },
  { value: '30', label: 'Juz' },
  { value: '227', label: 'Doa & dzikir' },
];

export default function Home() {
  const [surahs, setSurahs] = useState<SurahInfo[]>(FALLBACK_SURAHS as unknown as SurahInfo[]);
  const [englishSurahs, setEnglishSurahs] = useState<EnglishSurahSummary[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch('/api/surah')
        .then((response) => response.json())
        .catch(() => null),
      fetch('/api/en/surah')
        .then((response) => response.json())
        .catch(() => null),
    ]).then(([indonesianJson, englishJson]) => {
      if (!active) return;
      if (Array.isArray(indonesianJson?.data) && indonesianJson.data.length) {
        setSurahs(indonesianJson.data);
      }
      if (Array.isArray(englishJson?.data) && englishJson.data.length) {
        setEnglishSurahs(englishJson.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const englishMap = useMemo(
    () => new Map(englishSurahs.map((surah) => [surah.number, surah])),
    [englishSurahs],
  );

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const visibleSurahs = normalizedQuery
    ? surahs
        .filter((surah) => {
          const english = englishMap.get(surah.nomor);
          return (
            surah.namaLatin.toLowerCase().includes(normalizedQuery) ||
            surah.arti.toLowerCase().includes(normalizedQuery) ||
            surah.nama.includes(trimmedQuery) ||
            String(surah.nomor) === trimmedQuery ||
            english?.englishName.toLowerCase().includes(normalizedQuery) ||
            english?.englishNameTranslation.toLowerCase().includes(normalizedQuery)
          );
        })
        .slice(0, 8)
    : POPULAR_SURAH_NUMBERS.map((number) => surahs.find((surah) => surah.nomor === number)).filter(
        (surah): surah is SurahInfo => Boolean(surah),
      );

  return (
    <main>
      {/* Hero */}
      <section className="page-container pb-16 pt-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 className="mx-auto text-[42px] font-bold leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:text-[60px]">
            Baca Al-Qur’an kapan saja, di mana saja.
          </h1>
          <div className="mx-auto mt-7 max-w-[640px] space-y-2 text-lg leading-relaxed text-muted-foreground">
            <p>
              114 surah dengan teks Arab yang nyaman dibaca, terjemahan bahasa Indonesia dan Inggris,
              serta transliterasi Latin.
            </p>
            <p>
              Dengarkan audio dari enam qari pilihan, tandai ayat penting, lalu lengkapi hari Anda
              dengan doa dan dzikir harian.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
            <Link
              href="/surah/1"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              style={{ paddingLeft: 22, paddingRight: 22 }}
            >
              Mulai membaca
              <IoArrowForward size={16} />
            </Link>
            <Link
              href="/doa"
              className="outline-button h-12 text-[15px]"
              style={{ paddingLeft: 22, paddingRight: 22 }}
            >
              Jelajahi doa & dzikir
            </Link>
            <Link
              href="#fitur"
              className="inline-flex h-12 items-center gap-1.5 px-1 text-[15px] font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Lihat fitur lengkap
              <IoArrowForward size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Surah populer */}
      <section className="page-container pb-20 sm:pb-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[520px]">
            <h2 className="text-[28px] font-bold leading-tight tracking-tight">Surah populer</h2>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Mulai dari surah yang paling sering dibaca, atau cari berdasarkan nama Indonesia,
              Inggris, dan nomor surah.
            </p>
          </div>
          <label className="search-field w-full sm:w-[400px]">
            <IoSearch size={18} className="shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, nomor, atau nama Inggris surah"
              aria-label="Cari surah"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="search-clear"
                aria-label="Hapus pencarian"
              >
                <IoClose size={14} />
              </button>
            )}
          </label>
        </div>

        {visibleSurahs.length > 0 ? (
          <div
            className="grid overflow-hidden rounded-2xl border border-border bg-border"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
              gap: 1,
            }}
          >
            {visibleSurahs.map((surah) => {
              const english = englishMap.get(surah.nomor);
              return (
                <Link
                  key={surah.nomor}
                  href={`/surah/${surah.nomor}`}
                  className="flex items-center gap-4 bg-card p-5 transition-colors hover:bg-muted sm:px-6"
                >
                  <SurahBadge number={surah.nomor} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold tracking-tight">
                      {surah.namaLatin}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {surah.arti}, {surah.jumlahAyat} ayat
                    </div>
                    {english && (
                      <div className="truncate text-xs text-muted-foreground/80">
                        {english.englishName} · {english.englishNameTranslation}
                      </div>
                    )}
                  </div>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic shrink-0 text-2xl leading-relaxed"
                  >
                    {surah.nama}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            Tidak ada surah yang cocok dengan “{query}”.
          </div>
        )}

        <div className="mt-5">
          <Link
            href="/surah"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Lihat semua 114 surah
            <IoArrowForward size={16} />
          </Link>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="page-container scroll-mt-24 pb-20 sm:pb-24">
        <div className="max-w-[620px]">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight">
            Dirancang untuk membaca dengan tenang
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Dari teks Arab hingga doa harian, setiap fitur dibuat agar Anda bisa fokus pada bacaan
            tanpa gangguan.
          </p>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-2.5 border-t border-border pt-6">
              <feature.icon size={22} className="text-primary" />
              <h3 className="text-[17px] font-semibold">{feature.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Angka */}
      <section className="border-y border-border">
        <div className="page-container grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4 sm:py-12">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold leading-tight tracking-tight">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
