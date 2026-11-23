'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { IoArrowBack, IoArrowForward, IoClose, IoSearch } from 'react-icons/io5';
import type { DoaListItem } from '@/lib/doa';

const PAGE_SIZE = 12;
const ALL_GROUPS = 'Semua grup';
const ALL_TAGS = 'Semua tag';

export default function DoaList({ doas }: { doas: DoaListItem[] }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(ALL_GROUPS);
  const [tag, setTag] = useState(ALL_TAGS);
  const [page, setPage] = useState(1);

  const groups = useMemo(
    () => [
      ALL_GROUPS,
      ...Array.from(new Set(doas.map((doa) => doa.grup))).sort((a, b) => a.localeCompare(b, 'id')),
    ],
    [doas],
  );

  const tags = useMemo(
    () => [
      ALL_TAGS,
      ...Array.from(new Set(doas.flatMap((doa) => doa.tag))).sort((a, b) => a.localeCompare(b, 'id')),
    ],
    [doas],
  );

  useEffect(() => setPage(1), [query, group, tag]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return doas.filter((doa) => {
      const matchesTerm =
        !term ||
        [doa.nama, doa.grup, doa.ar, doa.tr, doa.idn, ...doa.tag].some((value) =>
          value.toLowerCase().includes(term),
        );
      const matchesGroup = group === ALL_GROUPS || doa.grup === group;
      const matchesTag = tag === ALL_TAGS || doa.tag.includes(tag);
      return matchesTerm && matchesGroup && matchesTag;
    });
  }, [doas, query, group, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const showingStart = filtered.length ? start + 1 : 0;
  const showingEnd = Math.min(start + PAGE_SIZE, filtered.length);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="search-field min-w-0 flex-1 basis-72">
            <IoSearch size={18} className="shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, grup, atau isi doa"
              aria-label="Cari doa"
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

          <label className="outline-button h-12 max-w-full gap-2 rounded-xl sm:max-w-[280px]">
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              aria-label="Filter grup doa"
              className="max-w-[220px] cursor-pointer border-0 bg-transparent pr-1 text-sm font-medium text-foreground outline-none sm:max-w-[240px]"
            >
              {groups.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          role="group"
          aria-label="Filter tag doa"
          className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tag === item}
              onClick={() => setTag(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tag === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((doa) => (
            <Link
              key={doa.id}
              href={`/doa/${doa.id}`}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    {doa.grup}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">
                    {doa.nama}
                  </h2>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">#{doa.id}</span>
              </div>

              <p
                lang="ar"
                dir="rtl"
                className="line-clamp-2 font-arabic text-right text-2xl leading-[1.9] text-foreground/90"
              >
                {doa.ar}
              </p>

              {doa.idn && <p className="line-clamp-2 text-sm text-muted-foreground">{doa.idn}</p>}

              <div className="mt-auto flex flex-wrap gap-1.5">
                {doa.tag.map((item) => (
                  <span key={item} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    #{item}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="font-semibold">Tidak ada doa yang cocok</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Coba ubah kata kunci, grup, atau tag yang dipilih.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-sm">
        <span className="text-muted-foreground">
          Menampilkan {showingStart}–{showingEnd} dari {filtered.length} doa
        </span>
        <nav aria-label="Halaman doa" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg px-3 font-medium text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
          >
            <IoArrowBack size={16} />
            Sebelumnya
          </button>
          <span className="tabular-nums text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 items-center gap-1 rounded-lg px-3 font-medium text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
          >
            Berikutnya
            <IoArrowForward size={16} />
          </button>
        </nav>
      </div>
    </>
  );
}
