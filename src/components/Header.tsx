'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoMoon, IoSunny } from 'react-icons/io5';
import emblem from '@/assets/BacaQuran Emerald Gold Emblem.webp';
import { useTheme } from '@/contexts/ThemeContext';

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/surah', label: 'Daftar Surah' },
  { href: '/doa', label: 'Doa & Dzikir' },
  { href: '/about', label: 'Tentang' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="page-container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
          <Image src={emblem} alt="" width={28} height={28} className="shrink-0" priority />
          BacaQuran
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(pathname, link.href) ? 'nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted md:flex"
            aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
            title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
          >
            {theme === 'dark' ? <IoSunny size={18} /> : <IoMoon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="icon-button h-11 w-11 md:hidden"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-card md:hidden" aria-label="Navigasi mobile">
          <div className="page-container flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link ${isActive(pathname, link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-link flex w-full items-center gap-2 text-left"
            >
              {theme === 'dark' ? <IoSunny size={17} /> : <IoMoon size={17} />}
              {theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
