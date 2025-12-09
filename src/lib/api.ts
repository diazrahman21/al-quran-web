// API utilities for fetching Quran data
const API_BASE_URL = 'https://api.alquran.cloud/v1';

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  audio?: string;
}

export interface SurahDetail extends SurahInfo {
  ayahs: Ayah[];
}

export async function getAllSurahs(): Promise<SurahInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`, { cache: 'force-cache' });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getSurahById(id: number, edition: string = 'quran-uthmani'): Promise<SurahDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${id}/${edition}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

export async function getSurahWithTranslation(id: number, translationEdition: string = 'id.indonesian') {
  try {
    const [arabic, translation] = await Promise.all([
      getSurahById(id, 'quran-uthmani'),
      getSurahById(id, translationEdition)
    ]);
    return { arabic, translation };
  } catch (error) {
    console.error('Error fetching surah with translation:', error);
    return null;
  }
}

// Get audio URL for entire surah
export function getSurahAudioUrl(surahNumber: number, qari: string = 'ar.alafasy'): string {
  return `https://cdn.islamic.network/quran/audio-surah/128/${qari}/${surahNumber}.mp3`;
}

// Get audio URL for specific ayah
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, qari: string = 'ar.alafasy'): string {
  const paddedAyah = String(ayahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/${qari}/${surahNumber}${paddedAyah}.mp3`;
}

// Popular reciters
export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman As-Sudais' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi' },
];

// Available translations
export const TRANSLATIONS = [
  { id: 'id.indonesian', name: 'Bahasa Indonesia' },
  { id: 'en.sahih', name: 'English - Sahih International' },
  { id: 'en.pickthall', name: 'English - Pickthall' },
];
