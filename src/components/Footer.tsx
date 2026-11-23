import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 py-9 text-sm text-muted-foreground sm:py-10">
        <span>BacaQuran, platform membaca Al-Qur’an dengan terjemahan dan audio.</span>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/surah" className="nav-link px-0 py-0 hover:bg-transparent hover:text-foreground">
            Daftar Surah
          </Link>
          <Link href="/doa" className="nav-link px-0 py-0 hover:bg-transparent hover:text-foreground">
            Doa & Dzikir
          </Link>
          <Link href="/about" className="nav-link px-0 py-0 hover:bg-transparent hover:text-foreground">
            Tentang
          </Link>
          <span>Lisensi MIT</span>
        </div>
      </div>
    </footer>
  );
}
