// API utilities for fetching Quran data from equran.id
const API_BASE_URL = 'https://equran.id/api/v2';

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  // equran.id specific fields
  nomor?: number;
  nama?: string;
  namaLatin?: string;
  jumlahAyat?: number;
  tempatTurun?: string;
  arti?: string;
  deskripsi?: string;
  audioFull?: {
    [key: string]: string;
  };
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
  // equran.id specific fields
  nomorAyat?: number;
  teksArab?: string;
  teksLatin?: string;
  teksIndonesia?: string;
}

export interface SurahDetail extends SurahInfo {
  ayahs: Ayah[];
  ayat?: Ayah[];
}

// Helper function to fetch with retry and timeout
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      console.log(`Fetching URL: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries reached');
}

export async function getAllSurahs(): Promise<SurahInfo[]> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/surat`, { 
      cache: 'force-cache',
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const json = await response.json();
    const data = json.data;
    
    // Transform equran.id format to our format
    return data.map((surah: any) => ({
      number: surah.nomor,
      name: surah.nama,
      englishName: surah.namaLatin,
      englishNameTranslation: surah.arti,
      numberOfAyahs: surah.jumlahAyat,
      revelationType: surah.tempatTurun === 'Mekah' ? 'Meccan' : 'Medinan',
      ...surah
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getSurahById(id: number): Promise<SurahDetail | null> {
  try {
    // Validate surah ID (1-114)
    if (id < 1 || id > 114) {
      console.error(`Invalid surah ID: ${id}`);
      return null;
    }

    const response = await fetchWithRetry(`${API_BASE_URL}/surat/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const json = await response.json();
    
    // Check if response has data
    if (!json.data) {
      console.error('No data in response:', json);
      return null;
    }
    
    const data = json.data;
    
    // Check if ayat exists
    if (!data.ayat || !Array.isArray(data.ayat)) {
      console.error('No ayat data in response:', data);
      return null;
    }
    
    // Transform equran.id format to our format
    const transformed = {
      number: data.nomor,
      name: data.nama,
      englishName: data.namaLatin,
      englishNameTranslation: data.arti,
      numberOfAyahs: data.jumlahAyat,
      revelationType: data.tempatTurun === 'Mekah' ? 'Meccan' : 'Medinan',
      ayahs: data.ayat.map((ayah: any) => ({
        number: ayah.nomorAyat,
        text: ayah.teksArab,
        translation: ayah.teksIndonesia,
        numberInSurah: ayah.nomorAyat,
        juz: 1, // equran.id doesn't provide this
        manzil: 1,
        page: 1,
        ruku: 1,
        hizbQuarter: 1,
        sajda: false,
        teksArab: ayah.teksArab,
        teksLatin: ayah.teksLatin,
        teksIndonesia: ayah.teksIndonesia,
        audio: ayah.audio, // Store the entire audio object with all reciters
      })),
      audioFull: data.audioFull,
      ...data
    };
    
    return transformed;
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

export async function getSurahWithTranslation(id: number) {
  try {
    // Validate surah ID
    if (id < 1 || id > 114) {
      console.error(`Invalid surah ID for translation: ${id}`);
      return null;
    }

    const surah = await getSurahById(id);
    
    if (!surah) {
      console.error(`Failed to fetch surah ${id}`);
      return null;
    }
    
    // equran.id already includes translation, so we return it twice for compatibility
    return { 
      arabic: surah,
      translation: surah
    };
  } catch (error) {
    console.error('Error fetching surah with translation:', error);
    return null;
  }
}

// Get audio URL for entire surah from equran.id
export async function getSurahAudioUrl(surahNumber: number): Promise<string> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/surat/${surahNumber}`);
    const json = await response.json();
    const data = json.data;
    
    // equran.id provides multiple audio options, use the first available
    if (data.audioFull) {
      const audioKeys = Object.keys(data.audioFull);
      if (audioKeys.length > 0) {
        return data.audioFull[audioKeys[0]];
      }
    }
    
    // Fallback to default audio
    return `https://equran.id/audio/full/${String(surahNumber).padStart(3, '0')}.mp3`;
  } catch (error) {
    console.error('Error fetching audio URL:', error);
    return `https://equran.id/audio/full/${String(surahNumber).padStart(3, '0')}.mp3`;
  }
}

// Get audio URL for specific ayah
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  const paddedAyah = String(ayahNumber).padStart(3, '0');
  return `https://equran.id/audio/${paddedSurah}${paddedAyah}.mp3`;
}

// Popular reciters (equran.id specific)
export const RECITERS = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi' },
  { id: '06', name: 'Yasser Al-Dosari' },
];

// Available translations
export const TRANSLATIONS = [
  { id: 'id.indonesian', name: 'Bahasa Indonesia - Kementerian Agama' },
];
