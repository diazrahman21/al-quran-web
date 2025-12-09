export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Tentang Al-Quran Web
          </h1>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Al-Quran Web adalah platform digital untuk membaca dan mempelajari Al-Quran
              dengan mudah dan nyaman. Website ini dirancang dengan antarmuka modern dan
              responsif untuk memberikan pengalaman terbaik dalam membaca kitab suci.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-3">
              Fitur Utama
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Teks Al-Quran lengkap 114 surah dengan tulisan Arab yang jelas</li>
              <li>Terjemahan dalam Bahasa Indonesia</li>
              <li>Audio bacaan dari qari terkenal</li>
              <li>Antarmuka responsif untuk semua perangkat</li>
              <li>Mode gelap untuk kenyamanan membaca</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-3">
              Sumber Data
            </h2>
            <p>
              Data Al-Quran, terjemahan, dan audio diambil dari Al-Quran Cloud API,
              sebuah layanan gratis yang menyediakan akses ke Al-Quran digital.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-3">
              Teknologi
            </h2>
            <p>
              Website ini dibangun menggunakan Next.js 15, React 19, TypeScript, dan
              Tailwind CSS untuk memberikan performa terbaik dan pengalaman pengguna
              yang optimal.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Semoga website ini bermanfaat dalam mempelajari Al-Quran
              </p>
              <p className="text-2xl mt-2">﷽</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
