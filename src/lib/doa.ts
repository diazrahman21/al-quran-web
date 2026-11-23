// API utilities for doa and dzikir data from equran.id (v1 endpoint).
export interface Doa {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

// Daftar tidak memerlukan "tentang" supaya payload halaman tetap ringan.
export type DoaListItem = Omit<Doa, 'tentang'>;

type DoaListResponse = {
  status?: string;
  total?: number;
  data: Doa[];
};

type DoaDetailResponse = {
  status?: string;
  data: Doa;
};

const DOA_API_URL = 'https://equran.id/api/doa';

async function fetchDoa<T>(path: string, revalidate: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${DOA_API_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function toListItem(doa: Doa): DoaListItem {
  return {
    id: doa.id,
    grup: doa.grup,
    nama: doa.nama,
    ar: doa.ar,
    tr: doa.tr,
    idn: doa.idn,
    tag: Array.isArray(doa.tag) ? doa.tag : [],
  };
}

export async function getAllDoas(filters: { grup?: string; tag?: string } = {}): Promise<DoaListItem[]> {
  const params = new URLSearchParams();
  if (filters.grup) params.set('grup', filters.grup);
  if (filters.tag) params.set('tag', filters.tag);
  const query = params.toString();

  try {
    const json = await fetchDoa<DoaListResponse>(query ? `?${query}` : '', 86400);
    if (!Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Daftar doa kosong');
    }
    return json.data.map(toListItem);
  } catch (error) {
    console.warn('Gagal memuat daftar doa dari API.', error);
    return [];
  }
}

export async function getDoaById(id: number): Promise<Doa | null> {
  if (!Number.isInteger(id) || id < 1) return null;

  try {
    const json = await fetchDoa<DoaDetailResponse>(`/${id}`, 3600);
    if (!json.data?.id) throw new Error('Detail doa tidak ditemukan');
    return {
      ...json.data,
      tag: Array.isArray(json.data.tag) ? json.data.tag : [],
    };
  } catch (error) {
    console.warn(`Gagal memuat doa ${id} dari API.`, error);
    return null;
  }
}
