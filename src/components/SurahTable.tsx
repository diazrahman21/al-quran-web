'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoArrowBack, IoArrowForward, IoPause, IoPlay, IoSearch } from 'react-icons/io5';
import type { SurahInfo } from '@/lib/api';
import { tempatTurunLabel } from '@/lib/quran';
import SurahBadge from './SurahBadge';

type Filter = 'Semua' | 'Makkiyah' | 'Madaniyah';
type Sort = 'nomor' | 'nama' | 'ayat';

const PAGE_SIZE = 10;

export default function SurahTable({ surahs }: { surahs: SurahInfo[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Semua');
  const [sort, setSort] = useState<Sort>('nomor');
  const [page, setPage] = useState(1);
  const [playingNumber, setPlayingNumber] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => setPage(1), [query, filter, sort]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return surahs
      .filter((surah) => {
        const matchesTerm =
          !term ||
          surah.namaLatin.toLowerCase().includes(term) ||
          surah.arti.toLowerCase().includes(term) ||
          surah.nama.includes(query.trim()) ||
          String(surah.nomor) === query.trim();
        const matchesFilter = filter === 'Semua' || tempatTurunLabel(surah.tempatTurun) === filter;
        return matchesTerm && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === 'nama') return a.namaLatin.localeCompare(b.namaLatin);
        if (sort === 'ayat') return b.jumlahAyat - a.jumlahAyat;
        return a.nomor - b.nomor;
      });
  }, [surahs, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const togglePlay = (surah: SurahInfo) => {
    if (playingNumber === surah.nomor) {
      audioRef.current?.pause();
      setPlayingNumber(null);
      return;
    }

    audioRef.current?.pause();
    const url = `https://cdn.equran.id/audio-full/Misyari-Rasyid-Al-Afasi/${String(surah.nomor).padStart(3, '0')}.mp3`;
    const audio = new Audio(url);
    audio.onended = () => setPlayingNumber(null);
    audio.onerror = () => setPlayingNumber(null);
    audioRef.current = audio;
    setPlayingNumber(surah.nomor);
    audio.play().catch(() => setPlayingNumber(null));
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | '…')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…');
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="search-field min-w-0 flex-1 basis-80">
          <IoSearch size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari berdasarkan nama atau nomor surah"
            aria-label="Cari surah"
          />
        </label>

        <div role="tablist" aria-label="Tempat turun" className="inline-flex gap-0.5 rounded-[10px] bg-muted p-1">
          {(['Semua', 'Makkiyah', 'Madaniyah'] as Filter[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              onClick={() => setFilter(item)}
              className={`h-9 rounded-lg px-4 text-sm transition-colors ${
                filter === item
                  ? 'bg-card font-semibold text-foreground shadow-sm'
                  : 'font-medium text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="outline-button gap-2.5">
          <span className="whitespace-nowrap">Urutkan:</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            aria-label="Urutkan surah"
            className="cursor-pointer border-0 bg-transparent pr-1 text-sm font-medium text-foreground outline-none"
          >
            <option value="nomor">Nomor surah</option>
            <option value="nama">Nama surah</option>
            <option value="ayat">Jumlah ayat</option>
          </select>
        </label>
      </div>

      {/* Tabel desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid h-11 grid-cols-[72px_minmax(200px,1.4fr)_130px_90px_minmax(120px,1fr)_64px] items-center border-b border-border px-5 text-[13px] font-medium text-muted-foreground">
              <span>No</span>
              <span>Surah</span>
              <span>Tempat turun</span>
              <span>Ayat</span>
              <span className="text-right">Nama Arab</span>
              <span />
            </div>

            {visible.map((surah) => (
              <div
                key={surah.nomor}
                className="row grid min-h-[72px] grid-cols-[72px_minmax(200px,1.4fr)_130px_90px_minmax(120px,1fr)_64px] items-center border-b border-border px-5 last:border-b-0"
              >
                <SurahBadge number={surah.nomor} />
                <Link href={`/surah/${surah.nomor}`} className="min-w-0 py-3">
                  <div className="truncate text-base font-semibold tracking-tight">{surah.namaLatin}</div>
                  <div className="truncate text-sm text-muted-foreground">{surah.arti}</div>
                </Link>
                <div>
                  <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                    {tempatTurunLabel(surah.tempatTurun)}
                  </span>
                </div>
                <span className="text-sm tabular-nums">{surah.jumlahAyat}</span>
                <p lang="ar" dir="rtl" className="font-arabic text-right text-2xl leading-relaxed">
                  {surah.nama}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => togglePlay(surah)}
                    className="icon-button h-9 w-9"
                    aria-label={`Putar ${surah.namaLatin}`}
                  >
                    {playingNumber === surah.nomor ? <IoPause size={16} /> : <IoPlay size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination
          total={filtered.length}
          start={filtered.length ? start + 1 : 0}
          end={Math.min(start + PAGE_SIZE, filtered.length)}
          current={currentPage}
          pages={pageNumbers}
          onPage={setPage}
        />
      </div>

      {/* Daftar mobile */}
      <div className="overflow-hidden rounded-xl border border-border bg-card sm:hidden">
        {visible.map((surah) => (
          <div key={surah.nomor} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0">
            <SurahBadge number={surah.nomor} size={32} />
            <Link href={`/surah/${surah.nomor}`} className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold">{surah.namaLatin}</div>
              <div className="truncate text-[13px] text-muted-foreground">
                {surah.arti} · {surah.jumlahAyat} ayat
              </div>
            </Link>
            <p lang="ar" dir="rtl" className="font-arabic shrink-0 text-xl">
              {surah.nama}
            </p>
          </div>
        ))}
        <Pagination
          total={filtered.length}
          start={filtered.length ? start + 1 : 0}
          end={Math.min(start + PAGE_SIZE, filtered.length)}
          current={currentPage}
          pages={pageNumbers}
          onPage={setPage}
        />
      </div>
    </>
  );
}

function Pagination({
  total,
  start,
  end,
  current,
  pages,
  onPage,
}: {
  total: number;
  start: number;
  end: number;
  current: number;
  pages: (number | '…')[];
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4 text-sm">
      <span className="text-muted-foreground">
        Menampilkan {start}–{end} dari {total} surah
      </span>
      <nav aria-label="Halaman" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, current - 1))}
          disabled={current === 1}
          className="inline-flex h-9 items-center gap-1 rounded-lg px-3 font-medium text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
        >
          <IoArrowBack size={16} />
          Sebelumnya
        </button>
        {pages.map((page, index) =>
          page === '…' ? (
            <span key={`dots-${index}`} className="flex h-9 w-9 items-center justify-center text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPage(page)}
              aria-current={page === current ? 'page' : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-1 text-sm ${
                page === current
                  ? 'border border-border bg-card font-semibold text-foreground'
                  : 'font-medium text-muted-foreground hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPage(current + 1)}
          disabled={current === Math.max(1, Math.ceil(total / PAGE_SIZE))}
          className="inline-flex h-9 items-center gap-1 rounded-lg px-3 font-medium text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
        >
          Berikutnya
          <IoArrowForward size={16} />
        </button>
      </nav>
    </div>
  );
}
