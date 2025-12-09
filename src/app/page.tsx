import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-green-700 dark:text-green-400 mb-8 leading-tight">
              ﷽
            </h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Baca Al-Quran
            <span className="block text-green-600 dark:text-green-400 mt-2">Kapan Saja, Di Mana Saja</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Platform digital untuk membaca Al-Quran dengan terjemahan bahasa Indonesia dan mendengarkan bacaan dari qari terbaik dunia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/surah"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Mulai Membaca</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">114</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Surah</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">6,236</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Ayat</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">30</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Juz</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pahala</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Semua yang Anda butuhkan untuk membaca dan memahami Al-Quran
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Teks Arab Jelas
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Baca 114 surah Al-Quran dengan tulisan Arab Utsmani yang jelas dan mudah dibaca
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Terjemahan
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Pahami makna setiap ayat dengan terjemahan Bahasa Indonesia dari Kementerian Agama
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Audio Berkualitas
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dengarkan bacaan merdu dari qari terkenal seperti Mishary Rashid Alafasy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-3xl shadow-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Mulai Perjalanan Spiritual Anda
            </h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Tingkatkan kualitas ibadah dan pemahaman Anda tentang Al-Quran
            </p>
            <Link
              href="/surah"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-green-600 font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Baca Sekarang</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📖</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">Al-Quran Digital</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Platform digital untuk membaca dan memahami Al-Quran Al-Kareem
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Link Cepat</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/surah" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      Daftar Surah
                    </Link>
                  </li>
                  <li>
                    <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      Fitur
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Sumber Data</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  API: Al-Quran Cloud<br />
                  Terjemahan: Kementerian Agama RI<br />
                  Audio: Islamic Network
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 Al-Quran Digital. Dibuat dengan ❤️ untuk umat Muslim
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
