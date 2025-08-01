'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { HOME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function Page() {
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  return (
    <main className="row-start-2 mx-8 grid place-items-center">
      <section className="space-y-4 text-center">
        <h1 className="text-xl font-bold">{authError}</h1>
        <Button>
          <Link href={HOME}>Home Page</Link>
        </Button>
      </section>
    </main>
  );
}
