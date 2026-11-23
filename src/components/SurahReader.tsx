'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  IoArrowBack,
  IoBookmark,
  IoBookmarkOutline,
  IoCheckmark,
  IoChevronDown,
  IoChevronForward,
  IoCopyOutline,
  IoPause,
  IoPlay,
  IoRepeat,
  IoShareSocialOutline,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHighOutline,
} from 'react-icons/io5';
import type { SurahDetail } from '@/lib/api';
import { formatTime, getAudioUrl, getJuz, RECITERS, tempatTurunLabel } from '@/lib/quran';
import { useReciter } from '@/contexts/ReciterContext';
import SurahBadge from './SurahBadge';

export default function SurahReader({ surah }: { surah: SurahDetail }) {
  const { selectedReciter, setSelectedReciter } = useReciter();
  const ayahs = surah.ayahs;

  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(40);
  const [activeAyah, setActiveAyah] = useState(ayahs[0]?.nomorAyat ?? 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const playAfterChangeRef = useRef(false);

  const activeData = ayahs.find((ayah) => ayah.nomorAyat === activeAyah) ?? ayahs[0];
  const audioUrl = getAudioUrl(activeData?.audio, selectedReciter);
  const activeIndex = ayahs.findIndex((ayah) => ayah.nomorAyat === activeAyah);
  const previousSurah = surah.suratSebelumnya || (surah.nomor > 1 ? { nomor: surah.nomor - 1, namaLatin: 'Surah sebelumnya' } : null);
  const nextSurah = surah.suratSelanjutnya || (surah.nomor < 114 ? { nomor: surah.nomor + 1, namaLatin: 'Surah berikutnya' } : null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bacaquran-bookmarks') || '[]');
      if (Array.isArray(saved)) setBookmarks(saved);
    } catch {
      // Abaikan data penanda yang rusak.
    }
  }, []);

  const setPlaying = (value: boolean) => {
    isPlayingRef.current = value;
    setIsPlaying(value);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (playAfterChangeRef.current || isPlayingRef.current) {
      playAfterChangeRef.current = false;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (isPlayingRef.current) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const selectAyah = (number: number) => {
    if (number === activeAyah) {
      togglePlay();
      return;
    }
    playAfterChangeRef.current = true;
    setActiveAyah(number);
  };

  const goToAyah = (delta: number) => {
    const nextIndex = activeIndex + delta;
    if (nextIndex < 0 || nextIndex >= ayahs.length) return;
    playAfterChangeRef.current = isPlayingRef.current;
    setActiveAyah(ayahs[nextIndex].nomorAyat);
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (repeat && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => setPlaying(false));
      return;
    }
    if (activeIndex < ayahs.length - 1) {
      playAfterChangeRef.current = true;
      setActiveAyah(ayahs[activeIndex + 1].nomorAyat);
    } else {
      setPlaying(false);
    }
  };

  const seek = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = ratio * audio.duration;
  };

  const toggleBookmark = (number: number) => {
    setBookmarks((previous) => {
      const next = previous.includes(number)
        ? previous.filter((item) => item !== number)
        : [...previous, number];
      try {
        localStorage.setItem('bacaquran-bookmarks', JSON.stringify(next));
      } catch {
        // Abaikan jika localStorage tidak tersedia.
      }
      return next;
    });
  };

  const copyAyah = async (ayah: SurahDetail['ayahs'][number]) => {
    try {
      await navigator.clipboard.writeText(`${ayah.teksArab}\n\n${ayah.teksIndonesia}`);
      setCopiedAyah(ayah.nomorAyat);
      window.setTimeout(() => setCopiedAyah(null), 1800);
    } catch {
      setCopiedAyah(null);
    }
  };

  const shareAyah = async (ayah: SurahDetail['ayahs'][number]) => {
    const url = `${window.location.origin}/surah/${surah.nomor}#ayat-${ayah.nomorAyat}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${surah.namaLatin} ayat ${ayah.nomorAyat}`, text: ayah.teksIndonesia, url });
      } catch {
        // Pembagian dibatalkan pengguna.
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopiedAyah(ayah.nomorAyat);
      window.setTimeout(() => setCopiedAyah(null), 1800);
    }
  };

  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <main className="pb-40 sm:pb-36">
      <div className="mx-auto w-full max-w-reader px-5 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 pt-7 text-sm">
          <Link href="/surah" className="rounded px-1 text-muted-foreground hover:text-foreground">
            Daftar Surah
          </Link>
          <IoChevronForward size={14} className="text-muted-foreground" />
          <span aria-current="page" className="font-medium">{surah.namaLatin}</span>
        </nav>

        {/* Judul surah */}
        <div className="flex flex-wrap items-start justify-between gap-6 pb-9 pt-8">
          <div>
            <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[40px]">
              {surah.namaLatin}
            </h1>
            <p className="mt-2 text-[17px] text-muted-foreground">{surah.arti}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                {tempatTurunLabel(surah.tempatTurun)}
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                {surah.jumlahAyat} ayat
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                Juz {getJuz(surah.nomor)}
              </span>
            </div>
          </div>
          <p lang="ar" dir="rtl" className="font-arabic text-6xl leading-[1.3] text-primary sm:text-[72px]">
            {surah.nama}
          </p>
        </div>
      </div>

      {/* Kontrol baca */}
      <div className="sticky top-16 z-20 border-y border-border bg-background">
        <div className="mx-auto flex w-full max-w-reader flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <button
            type="button"
            role="switch"
            aria-checked={showTranslation}
            onClick={() => setShowTranslation((value) => !value)}
            className="flex items-center gap-2.5 text-sm font-medium"
            aria-label="Tampilkan terjemahan"
          >
            <span
              className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                showTranslation ? 'justify-end bg-primary' : 'justify-start bg-border'
              }`}
            >
              <span className="h-5 w-5 rounded-full" style={{ background: showTranslation ? 'var(--primary-foreground)' : 'var(--card)' }} />
            </span>
            Terjemahan
          </button>

          <label className="outline-button h-10 cursor-pointer gap-2">
            <IoVolumeHighOutline size={16} className="text-muted-foreground" />
            <select
              value={selectedReciter}
              onChange={(event) => setSelectedReciter(event.target.value)}
              aria-label="Pilih qari"
              className="max-w-[130px] cursor-pointer border-0 bg-transparent text-sm font-medium text-foreground outline-none sm:max-w-none"
            >
              {RECITERS.map((reciter) => (
                <option key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </option>
              ))}
            </select>
            <IoChevronDown size={16} className="text-muted-foreground" />
          </label>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Ukuran huruf</span>
            <input
              type="range"
              min={28}
              max={56}
              step={2}
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
              aria-label="Ukuran huruf Arab"
              className="w-24 sm:w-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Ayat */}
      <div className="mx-auto w-full max-w-reader px-4 pt-2 sm:px-8">
        {ayahs.map((ayah) => {
          const active = ayah.nomorAyat === activeAyah;
          const saved = bookmarks.includes(ayah.nomorAyat);
          return (
            <div key={ayah.nomorAyat} id={`ayat-${ayah.nomorAyat}`} className="scroll-mt-36 border-b border-border py-1 last:border-b-0">
              <div className={`flex flex-col gap-3.5 rounded-[14px] px-3 py-5 transition-colors sm:gap-4 sm:px-6 ${active ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between gap-3">
                  <SurahBadge number={ayah.nomorAyat} size={active ? 36 : 32} />
                  <div className="flex items-center gap-0.5 text-muted-foreground">
                    <button type="button" onClick={() => selectAyah(ayah.nomorAyat)} className="icon-button h-9 w-9 sm:h-10 sm:w-10" aria-label={active && isPlaying ? 'Jeda ayat' : 'Putar ayat'}>
                      {active && isPlaying ? <IoPause size={16} /> : <IoPlay size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(ayah.nomorAyat)}
                      className={`icon-button h-9 w-9 sm:h-10 sm:w-10 ${saved ? 'text-primary' : ''}`}
                      aria-label={saved ? 'Hapus penanda' : 'Simpan penanda'}
                      aria-pressed={saved}
                    >
                      {saved ? <IoBookmark size={16} /> : <IoBookmarkOutline size={16} />}
                    </button>
                    <button type="button" onClick={() => copyAyah(ayah)} className="icon-button h-9 w-9 sm:h-10 sm:w-10" aria-label="Salin ayat">
                      {copiedAyah === ayah.nomorAyat ? <IoCheckmark size={16} className="text-primary" /> : <IoCopyOutline size={16} />}
                    </button>
                    <button type="button" onClick={() => shareAyah(ayah)} className="icon-button h-9 w-9 sm:h-10 sm:w-10" aria-label="Bagikan ayat">
                      <IoShareSocialOutline size={16} />
                    </button>
                  </div>
                </div>

                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-right leading-[2]"
                  style={{ fontSize: `clamp(${fontSize - 12}px, ${fontSize / 16}rem + 0.5vw, ${fontSize + 8}px)` }}
                >
                  {ayah.teksArab}
                </p>

                {showTranslation && (
                  <p className="text-[15px] leading-[1.7] text-muted-foreground sm:text-[17px]">
                    {ayah.teksIndonesia}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi surah */}
      <div className="mx-auto flex w-full max-w-reader flex-wrap items-center justify-between gap-3 px-5 pb-10 pt-8 sm:px-8">
        {previousSurah ? (
          <Link href={`/surah/${previousSurah.nomor}`} className="outline-button h-11">
            <IoArrowBack size={16} />
            Surah sebelumnya
          </Link>
        ) : (
          <span className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground opacity-50">
            <IoArrowBack size={16} />
            Surah sebelumnya
          </span>
        )}
        {nextSurah && (
          <Link href={`/surah/${nextSurah.nomor}`} className="outline-button h-11 font-semibold">
            {nextSurah.namaLatin}
            <IoChevronForward size={16} />
          </Link>
        )}
      </div>

      {/* Pemutar audio desktop */}
      <div className="pointer-events-none sticky bottom-6 z-30 mx-auto hidden w-full max-w-reader px-8 sm:block">
        <div className="pointer-events-auto flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-4 shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
          <div className="flex-[0_0_150px]">
            <div className="text-sm font-semibold">{surah.namaLatin}</div>
            <div className="text-xs text-muted-foreground">
              Ayat {activeAyah} dari {surah.jumlahAyat}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => goToAyah(-1)} disabled={activeIndex === 0} className="icon-button h-9 w-9 text-foreground disabled:opacity-30" aria-label="Ayat sebelumnya">
              <IoPlaySkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
            </button>
            <button type="button" onClick={() => goToAyah(1)} disabled={activeIndex === ayahs.length - 1} className="icon-button h-9 w-9 text-foreground disabled:opacity-30" aria-label="Ayat berikutnya">
              <IoPlaySkipForward size={18} />
            </button>
          </div>

          <div className="flex min-w-[160px] flex-1 items-center gap-3 text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <div onClick={(event) => seek((event.clientX - event.currentTarget.getBoundingClientRect().left) / event.currentTarget.clientWidth)} className="relative h-1 flex-1 cursor-pointer rounded-full bg-border" role="presentation">
              <div className="h-1 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-primary bg-card" style={{ left: `${progress}%` }} />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-0.5 text-muted-foreground">
            <button type="button" onClick={() => { if (audioRef.current) audioRef.current.muted = !audioRef.current.muted; }} className="icon-button h-9 w-9" aria-label="Bisukan audio">
              <IoVolumeHighOutline size={18} />
            </button>
            <button type="button" onClick={() => setRepeat((value) => !value)} className={`icon-button h-9 w-9 ${repeat ? 'text-primary' : ''}`} aria-label="Ulangi ayat" aria-pressed={repeat}>
              <IoRepeat size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Pemutar audio mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card sm:hidden">
        <div className="h-[3px] bg-border">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-2.5">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Ayat {activeAyah} dari {surah.jumlahAyat}</div>
            <div className="truncate text-xs text-muted-foreground">
              {RECITERS.find((reciter) => reciter.id === selectedReciter)?.name}, {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => goToAyah(-1)} disabled={activeIndex === 0} className="icon-button h-11 w-11 text-foreground disabled:opacity-30" aria-label="Ayat sebelumnya">
              <IoPlaySkipBack size={18} />
            </button>
            <button type="button" onClick={togglePlay} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label={isPlaying ? 'Jeda' : 'Putar'}>
              {isPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
            </button>
            <button type="button" onClick={() => goToAyah(1)} disabled={activeIndex === ayahs.length - 1} className="icon-button h-11 w-11 text-foreground disabled:opacity-30" aria-label="Ayat berikutnya">
              <IoPlaySkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={handleEnded}
      />
    </main>
  );
}
