'use client';

import { signOut } from 'next-auth/react';
import { Role, User } from '@prisma/client';
import { useActionState, useState } from 'react';

import * as CN from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateUser, UserState } from '@/lib/actions';

export default function UserForm({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [state, action, pending] = useActionState(
    updateUser.bind(null, user.id),
    { name: user.name, email: user.email } as UserState
  );

  return (
    <main className="row-start-2 grid place-items-center">
      <section className="grid place-items-center p-4">
        <form
          action={action}
          className="min-w-sm space-y-4 rounded-md border border-dashed p-4 shadow"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={state?.name}
              placeholder="Gwen Tennyson"
            />
            {state?.errors?.name && (
              <p className="text-destructive text-xs">{state.errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={state?.email}
              placeholder="yourname@domain.com"
            />
            {state?.errors?.email && (
              <p className="text-destructive text-xs">{state.errors.email}</p>
            )}
          </div>
          {!user.hasOAuth && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Secret@123"
                defaultValue={state?.password}
              />
              {state?.errors?.password && (
                <p className="text-destructive text-xs">
                  {state.errors.password}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <CN.Select
              name="role"
              value={role}
              onValueChange={role => setRole(role as Role)}
            >
              <CN.SelectTrigger className="w-full">
                <CN.SelectValue placeholder="Select a role" />
              </CN.SelectTrigger>
              <CN.SelectContent>
                <CN.SelectItem value="USER">USER</CN.SelectItem>
                <CN.SelectItem value="ADMIN">ADMIN</CN.SelectItem>
              </CN.SelectContent>
            </CN.Select>
            {state?.errors?.role && (
              <p className="text-destructive text-xs">{state.errors.role}</p>
            )}
          </div>
          {state?.message && (
            <p className="text-destructive text-xs">{state.message}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" className="cursor-pointer" disabled={pending}>
              {pending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={async () => {
                setIsSigningOut(true);
                await signOut();
              }}
            >
              {isSigningOut ? 'Signing out...' : 'Signout'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
