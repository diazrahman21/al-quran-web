// API utilities for fetching Quran data from equran.id
import { FALLBACK_SURAHS } from './fallback';
import { RECITERS, type AyahItem, type SurahListItem } from './quran';

const API_BASE_URL = 'https://equran.id/api/v2';

export interface SurahInfo extends SurahListItem {
  audioFull?: Record<string, string>;
  deskripsi?: string;
  [key: string]: unknown;
}

export interface Ayah extends AyahItem {
  [key: string]: unknown;
}

export interface SurahDetail extends SurahInfo {
  ayahs: Ayah[];
  ayat: Ayah[];
  suratSelanjutnya?: { nomor: number; namaLatin: string } | false;
  suratSebelumnya?: { nomor: number; namaLatin: string } | false;
}

async function fetchJson(path: string, revalidate: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (!json?.data) throw new Error('Respons API tidak memuat data');
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

function toSurahInfo(surah: SurahListItem & Partial<SurahInfo>): SurahInfo {
  return { ...surah };
}

export async function getAllSurahs(): Promise<SurahInfo[]> {
  try {
    const data = await fetchJson('/surat', 86400);
    if (!Array.isArray(data) || data.length === 0) throw new Error('Daftar surah kosong');
    return data.map((surah) => toSurahInfo(surah));
  } catch (error) {
    console.warn('Gagal memuat daftar surah dari API, memakai data lokal.', error);
    return FALLBACK_SURAHS.map((surah) => toSurahInfo(surah));
  }
}

export async function getSurahById(id: number): Promise<SurahDetail | null> {
  if (!Number.isInteger(id) || id < 1 || id > 114) return null;

  try {
    const data = await fetchJson(`/surat/${id}`, 3600);
    if (!Array.isArray(data.ayat) || data.ayat.length === 0) {
      throw new Error('Data ayat tidak ditemukan');
    }

    const ayahs: Ayah[] = data.ayat.map((ayah: AyahItem) => ({
      ...ayah,
      numberInSurah: ayah.nomorAyat,
      text: ayah.teksArab,
      translation: ayah.teksIndonesia,
    }));

    return {
      ...data,
      ayahs,
      ayat: ayahs,
    };
  } catch (error) {
    console.warn(`Gagal memuat surah ${id} dari API.`, error);
    return null;
  }
}

export async function getSurahWithTranslation(id: number) {
  const surah = await getSurahById(id);
  if (!surah) return null;
  return { arabic: surah, translation: surah };
}

export async function getSurahAudioUrl(surahNumber: number): Promise<string> {
  try {
    const data = await fetchJson(`/surat/${surahNumber}`, 3600);
    const audioFull = data.audioFull as Record<string, string> | undefined;
    if (audioFull) {
      const url = audioFull['05'] ?? Object.values(audioFull)[0];
      if (url) return url;
    }
  } catch {
    // Gunakan URL fallback di bawah.
  }
  return `https://equran.id/audio/full/${String(surahNumber).padStart(3, '0')}.mp3`;
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  const paddedAyah = String(ayahNumber).padStart(3, '0');
  return `https://equran.id/audio/${paddedSurah}${paddedAyah}.mp3`;
}

export { RECITERS };

export const TRANSLATIONS = [
  { id: 'id.indonesian', name: 'Bahasa Indonesia - Kementerian Agama' },
];
