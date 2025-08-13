import bcrypt from 'bcrypt-mini';
import GitHub from 'next-auth/providers/github';
import { Permission, Role } from '@prisma/client';
import NextAuth, { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';

import prisma from '@/lib/prisma';
import * as CONST from '@/lib/constants';

declare module 'next-auth' {
  interface User {
    roles: Role[];
    city?: string | null;
    expiresAt?: number;
    phone?: string | null;
    permissions: Permission[];
  }
}

export const authConfig = {
  providers: [
    GitHub({
      clientId: CONST.GITHUB_CLIENT_ID,
      clientSecret: CONST.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) return null;
        if (!bcrypt.compareSync(password, user.password)) return null;

        const roles = (
          await prisma.userRole.findMany({
            select: { role: true },
            where: { userId: user.id }
          })
        ).map(ur => ur.role);

        const permissions = (
          await prisma.rolePermission.findMany({
            select: { permission: true },
            where: { roleId: { in: roles.map(r => r.id) } }
          })
        ).map(rp => rp.permission);

        return {
          ...user,
          roles,
          permissions,
          expiresAt: Date.now() + CONST.EXPIRES_AT * 1000
        };
      }
    })
  ]
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  pages: { signIn: CONST.LOGIN, error: CONST.AUTH_ERROR },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { hasOAuth: true, emailVerified: new Date() }
      });
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      });

      return !existingUser?.emailVerified ? false : true;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = token.roles as Role[];
      session.user.city = token.city as string | undefined;
      session.user.phone = token.phone as string | undefined;
      session.user.permissions = token.permissions as Permission[];
      session.user.expiresAt = token.expiresAt as number | undefined;
      return session;
    },
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id;
        token.city = user.city;
        token.roles = user.roles;
        token.phone = user.phone;
        token.expiresAt = user.expiresAt;
        token.permissions = user.permissions;
      }

      if (trigger === 'update' && session.user) {
        token.id = session.user.id;
        token.city = session.user.city;
        token.roles = session.user.roles;
        token.phone = session.user.phone;
        token.expiresAt = session.user.expiresAt;
        token.permissions = session.user.permissions;
      }

      return token;
    }
  }
});
