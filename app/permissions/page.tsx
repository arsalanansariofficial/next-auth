'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as CN from '@/components/ui/card';
import * as RHF from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addPermission } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import useHookForm from '@/hooks/use-hook-form';
import handler from '@/components/display-toast';
import { permissionSchema } from '@/lib/schemas';

export default function Page() {
  const { pending, handleSubmit } = useHookForm(handler, addPermission);

  const form = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: String() }
  });

  return (
    <section className="col-span-2 grid place-items-center gap-4 place-self-center lg:col-start-2">
      <CN.Card className="min-w-sm">
        <CN.CardHeader>
          <CN.CardTitle>Add permission</CN.CardTitle>
          <CN.CardDescription>
            Enter a name for a permission that you want to add
          </CN.CardDescription>
        </CN.CardHeader>
        <CN.CardContent>
          <RHF.Form {...form}>
            <form
              id="permission-form"
              className="space-y-2"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <RHF.FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <RHF.FormItem>
                    <RHF.FormLabel>Name</RHF.FormLabel>
                    <RHF.FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="VIEW:DASHBOARD"
                      />
                    </RHF.FormControl>
                    <RHF.FormMessage />
                  </RHF.FormItem>
                )}
              />
            </form>
          </RHF.Form>
        </CN.CardContent>
        <CN.CardFooter>
          <Button
            type="submit"
            disabled={pending}
            form="permission-form"
            className="w-full cursor-pointer"
          >
            {pending ? 'Adding permission...' : 'Add permission'}
          </Button>
        </CN.CardFooter>
      </CN.Card>
    </section>
  );
}
