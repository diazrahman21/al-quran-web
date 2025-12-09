# Al-Quran Web

Website Al-Quran modern yang dibangun dengan Next.js 15, menampilkan teks Al-Quran, terjemahan, dan audio bacaan.

## Fitur

- 📖 Tampilan teks Al-Quran dengan tulisan Arab yang jelas
- 🌐 Terjemahan dalam berbagai bahasa
- 🎵 Audio bacaan dari berbagai qari
- 🔍 Fitur pencarian surah dan ayat
- 🌙 Mode gelap/terang
- 📱 Responsive design

## Teknologi

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **React**: 19.0

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint

## Struktur Project

```
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles
│   └── components/         # React components (akan ditambahkan)
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## API

Website ini akan menggunakan Al-Quran Cloud API atau API sejenis untuk mendapatkan:
- Daftar surah
- Ayat-ayat Al-Quran
- Terjemahan
- Audio bacaan

## Pengembangan Selanjutnya

- [ ] Implementasi halaman daftar surah
- [ ] Implementasi halaman detail surah dengan ayat
- [ ] Integrasi API Al-Quran
- [ ] Implementasi audio player
- [ ] Fitur bookmark dan riwayat bacaan
- [ ] Fitur pencarian
- [ ] PWA support

## Lisensi

MIT
