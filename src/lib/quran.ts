export interface SurahListItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export interface AyahItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin?: string;
  teksIndonesia: string;
  audio?: Record<string, string> | string;
}

export const RECITERS = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi' },
  { id: '06', name: 'Yasser Al-Dosari' },
] as const;

export const POPULAR_SURAH_NUMBERS = [1, 2, 18, 36, 67, 112];

// Surah awal untuk setiap juz; dipakai untuk menampilkan keterangan juz di detail surah.
const JUZ_STARTS = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 11, 12, 15, 17, 18, 21, 23, 25, 27, 29, 33, 35, 36, 39, 41, 46, 51, 58, 67];

export function getJuz(surahNumber: number) {
  let juz = 1;
  JUZ_STARTS.forEach((start, index) => {
    if (surahNumber >= start) juz = index + 1;
  });
  return juz;
}

export function getReciterName(id: string) {
  return RECITERS.find((reciter) => reciter.id === id)?.name ?? RECITERS[4].name;
}

export function getAudioUrl(
  audio: Record<string, string> | string | undefined,
  reciterId: string,
): string | undefined {
  if (!audio) return undefined;
  if (typeof audio === 'string') return audio;
  return audio[reciterId] ?? Object.values(audio)[0];
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function tempatTurunLabel(tempatTurun: string) {
  const value = tempatTurun.toLowerCase();
  if (value.includes('makah') || value.includes('mekah') || value.includes('makki')) return 'Makkiyah';
  if (value.includes('madinah') || value.includes('medinah') || value.includes('madani')) return 'Madaniyah';
  return tempatTurun;
}
