'use client';

import { usePathname } from 'next/navigation';

export default function RouteTransition() {
  const pathname = usePathname();

  // Key berubah saat rute berubah, sehingga animasi progres diputar ulang.
  return <span key={pathname} className="route-progress" aria-hidden="true" />;
}
