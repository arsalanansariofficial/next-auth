import { PrismaClient, User } from '@prisma/client';

import { auth } from '@/auth';
import UserForm from '@/components/user-form';

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  return <UserForm user={user as User} />;
}
