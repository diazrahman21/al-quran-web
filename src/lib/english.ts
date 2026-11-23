// API utilities for English surah data from equran.id (/api/en).
export interface EnglishAyah {
  numberInSurah: number;
  textArabic: string;
  textLatin: string;
  textEnglish: string;
}

export interface EnglishSurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface EnglishSurah extends EnglishSurahSummary {
  audioFull?: Record<string, string>;
  ayahs: EnglishAyah[];
  nextSurah?: EnglishSurahSummary | false;
  previousSurah?: EnglishSurahSummary | false;
}

type Envelope<T> = {
  code?: number;
  message?: string;
  data: T;
};

const EN_API_URL = 'https://equran.id/api/en/surah';

async function fetchEnglish<T>(path: string, revalidate: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${EN_API_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function toSummary(surah: EnglishSurah): EnglishSurahSummary {
  return {
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType,
  };
}

export async function getAllEnglishSurahs(): Promise<EnglishSurahSummary[]> {
  try {
    const json = await fetchEnglish<Envelope<EnglishSurah[]>>('', 86400);
    if (!Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Daftar surah bahasa Inggris kosong');
    }
    return json.data.map(toSummary);
  } catch (error) {
    console.warn('Gagal memuat daftar surah bahasa Inggris dari API.', error);
    return [];
  }
}

export async function getEnglishSurahByNumber(number: number): Promise<EnglishSurah | null> {
  if (!Number.isInteger(number) || number < 1 || number > 114) return null;

  try {
    const json = await fetchEnglish<Envelope<EnglishSurah>>(`/${number}`, 3600);
    if (!json.data?.number || !Array.isArray(json.data.ayahs) || json.data.ayahs.length === 0) {
      throw new Error('Detail surah bahasa Inggris tidak ditemukan');
    }
    return json.data;
  } catch (error) {
    console.warn(`Gagal memuat surah bahasa Inggris ${number} dari API.`, error);
    return null;
  }
}
