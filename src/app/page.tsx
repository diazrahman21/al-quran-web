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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Track mouse position for aurora effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a] relative overflow-hidden">
      {/* Aurora Effect Background - Static Diagonal Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blue Aurora from top-right */}
        <div 
          className="absolute -top-1/2 -right-1/2 w-[1200px] h-[1200px] opacity-20 dark:opacity-50 blur-[120px]"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(96, 165, 250, 0.6) 30%, transparent 70%)',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />
        
        {/* Purple/Pink Aurora from middle-right */}
        <div 
          className="absolute top-1/4 -right-1/3 w-[1000px] h-[1000px] opacity-15 dark:opacity-40 blur-[100px]"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.7) 0%, rgba(168, 85, 247, 0.5) 40%, transparent 80%)',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`,
            transition: 'transform 0.6s ease-out',
          }}
        />
        
        {/* Orange/Red Aurora from bottom-left */}
        <div 
          className="absolute -bottom-1/3 -left-1/3 w-[900px] h-[900px] opacity-12 dark:opacity-35 blur-[110px]"
          style={{
            background: 'linear-gradient(45deg, rgba(251, 146, 60, 0.7) 0%, rgba(239, 68, 68, 0.5) 40%, transparent 75%)',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            transition: 'transform 0.7s ease-out',
          }}
        />
        
        {/* Green Aurora accent */}
        <div 
          className="absolute top-1/2 left-1/4 w-[800px] h-[800px] opacity-15 dark:opacity-30 blur-[90px]"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.4) 40%, transparent 70%)',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`,
            transition: 'transform 0.8s ease-out',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Baca Al-Quran
            <span className="block text-green-600 dark:text-green-400 mt-2">Kapan Saja, Di Mana Saja</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform digital yang menyediakan layanan membaca Al-Qur’an lengkap dengan terjemahan bahasa Indonesia 
              serta dilengkapi fitur mendengarkan lantunan bacaan dari qari-qari terbaik dunia.         
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
      <section className="container mx-auto px-4 py-8 relative z-10">
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
      <section className="container mx-auto px-4 py-16 relative z-10">
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
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
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


      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 relative z-10">
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
