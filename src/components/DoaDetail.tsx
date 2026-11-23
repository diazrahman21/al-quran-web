'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoArrowBack, IoArrowForward, IoCheckmark, IoCopy } from 'react-icons/io5';
import type { Doa } from '@/lib/doa';

type DoaNav = { id: number; nama: string } | null;

export default function DoaDetail({ doa, prev, next }: { doa: Doa; prev: DoaNav; next: DoaNav }) {
  const [copied, setCopied] = useState<'ar' | 'idn' | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async (field: 'ar' | 'idn') => {
    try {
      await navigator.clipboard.writeText(doa[field]);
      setCopied(field);
    } catch {
      setCopied(null);
    }
  };

  const copyButton = (field: 'ar' | 'idn', label: string) => (
    <button
      type="button"
      onClick={() => copy(field)}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={label}
    >
      {copied === field ? <IoCheckmark size={14} /> : <IoCopy size={14} />}
      <span aria-live="polite">{copied === field ? 'Tersalin' : 'Salin'}</span>
    </button>
  );

  return (
    <main className="page-container max-w-reader pb-20 pt-12 sm:pt-14">
      <Link
        href="/doa"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IoArrowBack size={16} />
        Kembali ke daftar doa
      </Link>

      <div className="mt-8">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {doa.grup}
        </span>
        <h1 className="mt-4 text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
          {doa.nama}
        </h1>
        {doa.tag.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doa.tag.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teks Arab</span>
          {copyButton('ar', 'Salin teks Arab')}
        </div>
        <p lang="ar" dir="rtl" className="mt-5 font-arabic text-right text-3xl leading-[2.1] sm:text-[38px]">
          {doa.ar}
        </p>
        {doa.tr && (
          <p className="mt-6 whitespace-pre-line border-t border-border pt-5 text-[15px] italic leading-relaxed text-muted-foreground">
            {doa.tr}
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Arti bahasa Indonesia
          </h2>
          {copyButton('idn', 'Salin terjemahan')}
        </div>
        <p className="mt-4 text-[17px] leading-relaxed">
          {doa.idn || 'Terjemahan belum tersedia.'}
        </p>
      </section>

      {doa.tentang && (
        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Tentang & sumber</h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
            {doa.tentang}
          </p>
        </section>
      )}

      <nav className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2" aria-label="Navigasi doa">
        {prev ? (
          <Link
            href={`/doa/${prev.id}`}
            className="flex min-h-16 flex-col justify-center rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <IoArrowBack size={13} />
              Sebelumnya
            </span>
            <span className="mt-0.5 text-sm font-semibold">{prev.nama}</span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={`/doa/${next.id}`}
            className="flex min-h-16 flex-col justify-center rounded-lg border border-border bg-card px-4 py-3 text-right transition-colors hover:bg-muted sm:col-start-2"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Berikutnya
              <IoArrowForward size={13} />
            </span>
            <span className="mt-0.5 text-sm font-semibold">{next.nama}</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
