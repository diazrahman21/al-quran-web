export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 dark:text-green-400 mb-4">
            ﷽
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-2">
            Al-Quran Digital
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Baca Al-Quran dengan terjemahan dan audio
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">📖</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              Baca Al-Quran
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Baca 114 surah Al-Quran dengan teks Arab yang jelas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">🌐</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              Terjemahan
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Pahami makna dengan terjemahan dalam berbagai bahasa
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">🎵</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              Audio
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Dengarkan bacaan dari berbagai qari terkenal
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/surah"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
          >
            Mulai Membaca
          </a>
        </div>
      </main>
    </div>
  );
}
