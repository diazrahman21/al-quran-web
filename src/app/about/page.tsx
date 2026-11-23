export const metadata = {
  title: 'Tentang — BacaQuran',
  description: 'Tentang platform BacaQuran dan sumber data yang digunakan.',
};

export default function AboutPage() {
  return (
    <main className="page-container max-w-reader pb-20 pt-14">
      <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[40px]">Tentang BacaQuran</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
        BacaQuran memudahkan Anda membaca dan mempelajari Al-Qur’an dengan tampilan yang nyaman,
        teks Arab yang jelas, terjemahan bahasa Indonesia, serta bacaan audio dari qari pilihan.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <section className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold">Fitur utama</h2>
          <ul className="mt-4 space-y-2 text-[15px] text-muted-foreground">
            <li>Teks Arab lengkap untuk 114 surah</li>
            <li>Terjemahan bahasa Indonesia yang dapat disembunyikan</li>
            <li>Audio bacaan per ayat dari beberapa qari</li>
            <li>Doa dan dzikir harian lengkap dengan terjemahan</li>
            <li>Penanda, salin, dan bagikan ayat</li>
            <li>Tampilan responsif dengan mode gelap</li>
          </ul>
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold">Sumber data</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Data surah, ayat, terjemahan, audio, serta doa dan dzikir berasal dari equran.id. Kami
            menyimpan salinan daftar surah sebagai cadangan agar daftar tetap dapat ditampilkan saat
            layanan data tidak dapat dijangkau.
          </p>
        </section>
      </div>

      <p className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        Semoga BacaQuran bermanfaat dalam mempelajari Al-Qur’an.
      </p>
    </main>
  );
}
