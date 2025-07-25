import Link from 'next/link';

import * as CN from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DASHBOARD, PAGE_NOT_FOUND } from '@/lib/constants';

export default function Page() {
  return (
    <section className="col-span-2 grid place-items-center gap-2 place-self-center lg:col-start-2">
      <CN.Card className="min-w-sm">
        <CN.CardHeader className="text-center">
          <CN.CardTitle className="content-center font-serif text-3xl font-semibold">
            😔 404
          </CN.CardTitle>
          <CN.CardDescription className="font-serif text-xl font-semibold">
            {PAGE_NOT_FOUND}
          </CN.CardDescription>
        </CN.CardHeader>
        <CN.CardFooter className="grid gap-2">
          <Button asChild>
            <Link href={DASHBOARD} className="font-serif">
              Home
            </Link>
          </Button>
        </CN.CardFooter>
      </CN.Card>
    </section>
  );
}
