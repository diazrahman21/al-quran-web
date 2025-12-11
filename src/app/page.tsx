'use client';

import Link from 'next/link';
import { LuAudioLines } from "react-icons/lu";
import { IoBook } from "react-icons/io5";
import { MdGTranslate } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { useState, useEffect } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [surahs, setSurahs] = useState<any[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://equran.id/api/v2/surat');
        const data = await response.json();
        setSurahs(data.data);
        setFilteredSurahs(data.data);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter((surah) =>
        surah.namaLatin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.arti?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.nomor?.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
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

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Cari Surah
            </h3>
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau nomor surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors"
              />
            </div>
            
            {searchQuery && (
              <div className="mt-6 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
                ) : filteredSurahs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSurahs.slice(0, 10).map((surah) => (
                      <Link
                        key={surah.nomor}
                        href={`/surah/${surah.nomor}`}
                        className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 dark:text-green-400 font-bold">{surah.nomor}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{surah.namaLatin}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{surah.arti}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-arabic">{surah.nama}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{surah.jumlahAyat} Ayat</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada surah yang ditemukan</p>
                )}
              </div>
            )}
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
                <IoBook className="text-3xl text-green-600 dark:text-green-400" />
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
                <MdGTranslate className="text-3xl text-blue-600 dark:text-blue-400" />
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
                <LuAudioLines className="text-3xl text-purple-600 dark:text-purple-400" />
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
                © 2025 Al-Quran Digital
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
