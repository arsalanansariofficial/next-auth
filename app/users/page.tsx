import { User } from 'next-auth';
import { PrismaClient } from '@prisma/client';

import { auth } from '@/auth';
import Component from '@/app/users/component';
import { ChartConfig } from '@/components/ui/chart';

const prisma = new PrismaClient();

const chartConfig = {
  users: { label: 'Users', color: 'var(--primary)' }
} satisfies ChartConfig;

const chartsData = [
  { month: 'Jan', users: 186 },
  { month: 'Feb', users: 305 },
  { month: 'Mar', users: 237 },
  { month: 'Apr', users: 173 },
  { month: 'May', users: 209 },
  { month: 'Jun', users: 214 }
];

const cardsData = [
  {
    action: '+12.5%',
    title: '$1,250.00',
    description: 'Total Revenue',
    subtitle: 'Trending up this month',
    summary: 'Visitors for the last 6 months'
  },
  {
    action: '-20%',
    title: '1,234',
    description: 'New Customers',
    subtitle: 'Down 20% this period',
    summary: 'Acquisition needs attention'
  },
  {
    action: '+12.5%',
    title: '45,678',
    description: 'Active Accounts',
    subtitle: 'Strong user retention',
    summary: 'Engagement exceed targets'
  },
  {
    title: '4.5%',
    action: '+4.5%',
    description: 'Growth Rate',
    subtitle: 'Steady performance increase',
    summary: 'Meets growth projections as expected'
  }
];

export default async function Page() {
  const session = await auth();
  const users = await prisma.user.findMany();

  return (
    <Component
      cardsData={cardsData}
      chartData={chartsData}
      chartConfig={chartConfig}
      user={session?.user as User}
      key={users.map(u => u.updatedAt).toString()}
      users={users.filter(user => user.email !== session?.user?.email)}
    />
  );
}
