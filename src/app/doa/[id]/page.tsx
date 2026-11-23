import Link from 'next/link';
import { notFound } from 'next/navigation';
import DoaDetail from '@/components/DoaDetail';
import { getAllDoas, getDoaById } from '@/lib/doa';

// Dokumentasi equran.id menyebut rentang id 1-228.
const MAX_DOA_ID = 228;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doaId = Number(id);
  if (!Number.isInteger(doaId) || doaId < 1 || doaId > MAX_DOA_ID) {
    return { title: 'Doa tidak ditemukan — BacaQuran' };
  }

  const doa = await getDoaById(doaId);
  return {
    title: doa ? `${doa.nama} — BacaQuran` : 'Doa tidak ditemukan — BacaQuran',
    description: doa?.idn?.slice(0, 160),
  };
}

export default async function DoaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doaId = Number(id);
  if (!Number.isInteger(doaId) || doaId < 1 || doaId > MAX_DOA_ID) notFound();

  const [doa, allDoas] = await Promise.all([getDoaById(doaId), getAllDoas()]);

  if (!doa) {
    return (
      <main className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Doa tidak dapat dimuat</h1>
        <p className="text-muted-foreground">
          Data doa belum tersedia. Silakan coba lagi beberapa saat.
        </p>
        <Link href="/doa" className="outline-button">
          Kembali ke Daftar Doa
        </Link>
      </main>
    );
  }

  const index = allDoas.findIndex((item) => item.id === doaId);
  const prev = index > 0 ? { id: allDoas[index - 1].id, nama: allDoas[index - 1].nama } : null;
  const next =
    index >= 0 && index < allDoas.length - 1
      ? { id: allDoas[index + 1].id, nama: allDoas[index + 1].nama }
      : null;

  return <DoaDetail doa={doa} prev={prev} next={next} />;
}

export async function generateStaticParams() {
  const doas = await getAllDoas();
  return doas.map((doa) => ({ id: String(doa.id) }));
}
