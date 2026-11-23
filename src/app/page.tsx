'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineBookOpen, HiOutlineTranslate } from 'react-icons/hi';
import { IoArrowForward, IoPause, IoPlay, IoSearch } from 'react-icons/io5';
import { LuAudioLines } from 'react-icons/lu';
import SurahBadge from '@/components/SurahBadge';
import type { SurahInfo } from '@/lib/api';
import { FALLBACK_SURAHS } from '@/lib/fallback';
import { formatTime, POPULAR_SURAH_NUMBERS } from '@/lib/quran';

const featuredAudio = 'https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3';

function FeaturedAyah() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    audio.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
  };

  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Al-Fatihah, ayat 1</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <LuAudioLines size={12} />
          Mishary Alafasy
        </span>
      </div>

      <p lang="ar" dir="rtl" className="font-arabic text-right text-4xl leading-[1.9] sm:text-5xl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="text-base text-muted-foreground">
        Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
      </p>

      <div className="h-px bg-border" />

      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label={playing ? 'Jeda ayat pilihan' : 'Putar ayat pilihan'}
        >
          {playing ? <IoPause size={14} /> : <IoPlay size={14} />}
        </button>
        <div
          onClick={seek}
          className="h-1 flex-1 cursor-pointer rounded-full bg-border"
          role="presentation"
        >
          <div className="h-1 rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <audio ref={audioRef} src={featuredAudio} preload="metadata" />
    </div>
  );
}

const features = [
  {
    icon: HiOutlineBookOpen,
    title: 'Teks Arab yang jelas',
    description: 'Tulisan Arab berukuran nyaman dibaca, dengan ukuran huruf yang bisa diatur.',
  },
  {
    icon: HiOutlineTranslate,
    title: 'Terjemahan bahasa Indonesia',
    description: 'Setiap ayat disertai terjemahan yang bisa ditampilkan atau disembunyikan.',
  },
  {
    icon: LuAudioLines,
    title: 'Audio dari qari pilihan',
    description: 'Dengarkan bacaan per ayat atau satu surah penuh, lalu pilih qari yang Anda suka.',
  },
];

export default function Home() {
  const [surahs, setSurahs] = useState<SurahInfo[]>(FALLBACK_SURAHS as unknown as SurahInfo[]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/surah')
      .then((response) => response.json())
      .then((json) => {
        if (active && Array.isArray(json.data) && json.data.length) setSurahs(json.data);
      })
      .catch(() => {
        // Data fallback sudah ditampilkan.
      });
    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleSurahs = normalizedQuery
    ? surahs
        .filter(
          (surah) =>
            surah.namaLatin.toLowerCase().includes(normalizedQuery) ||
            surah.arti.toLowerCase().includes(normalizedQuery) ||
            surah.nama.includes(query.trim()) ||
            String(surah.nomor) === query.trim(),
        )
        .slice(0, 8)
    : POPULAR_SURAH_NUMBERS.map((number) => surahs.find((surah) => surah.nomor === number)).filter(
        (surah): surah is SurahInfo => Boolean(surah),
      );

  return (
    <main>
      {/* Hero */}
      <section className="page-container flex flex-wrap items-center gap-x-14 gap-y-12 pb-20 pt-16 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="min-w-0 flex-[7_1_520px]">
          <h1 className="max-w-[640px] text-[42px] font-bold leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:text-[60px]">
            Baca Al-Qur’an kapan saja, di mana saja.
          </h1>
          <p className="mt-7 max-w-[500px] text-lg text-muted-foreground">
            Teks Arab lengkap dengan terjemahan bahasa Indonesia, dan bacaan audio dari qari pilihan.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/surah/1"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              style={{ paddingLeft: 22, paddingRight: 22 }}
            >
              Mulai membaca
              <IoArrowForward size={16} />
            </Link>
            <Link href="/about" className="outline-button h-12 text-[15px]" style={{ paddingLeft: 22, paddingRight: 22 }}>
              Pelajari lebih lanjut
            </Link>
            <Link href="/doa" className="outline-button h-12 text-[15px]" style={{ paddingLeft: 22, paddingRight: 22 }}>
              Doa & dzikir
            </Link>
          </div>
        </div>

        <div className="min-w-0 flex-[5_1_380px]">
          <FeaturedAyah />
        </div>
      </section>

      {/* Surah populer */}
      <section className="page-container pb-20 sm:pb-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-[28px] font-bold leading-tight tracking-tight">Surah populer</h2>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Mulai dari surah yang paling sering dibaca.
            </p>
          </div>
          <label className="search-field w-full sm:w-[360px]">
            <IoSearch size={18} className="shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau nomor surah"
              aria-label="Cari surah"
            />
          </label>
        </div>

        {visibleSurahs.length > 0 ? (
          <div className="grid overflow-hidden rounded-2xl border border-border bg-border" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 1 }}>
            {visibleSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                href={`/surah/${surah.nomor}`}
                className="flex items-center gap-4 bg-card p-5 transition-colors hover:bg-muted sm:px-6"
              >
                <SurahBadge number={surah.nomor} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold tracking-tight">{surah.namaLatin}</div>
                  <div className="truncate text-sm text-muted-foreground">
                    {surah.arti}, {surah.jumlahAyat} ayat
                  </div>
                </div>
                <p lang="ar" dir="rtl" className="font-arabic shrink-0 text-2xl leading-relaxed">
                  {surah.nama}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            Tidak ada surah yang cocok dengan “{query}”.
          </div>
        )}

        <div className="mt-5">
          <Link href="/surah" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Lihat semua 114 surah
            <IoArrowForward size={16} />
          </Link>
        </div>
      </section>

      {/* Fitur */}
      <section className="page-container pb-20 sm:pb-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-2.5 border-t border-border pt-6">
              <feature.icon size={22} className="text-primary" />
              <h3 className="text-[17px] font-semibold">{feature.title}</h3>
              <p className="text-[15px] text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Angka */}
      <section className="border-y border-border">
        <div className="page-container flex flex-wrap">
          {[
            { value: '114', label: 'Surah' },
            { value: '6.236', label: 'Ayat' },
            { value: '30', label: 'Juz' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`min-w-[200px] flex-1 py-10 ${index > 0 ? 'border-l border-border pl-8' : ''}`}
            >
              <div className="text-4xl font-bold leading-tight tracking-tight">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
