import HistoryComponent from '@/components/HistoryComponent';
import HistoryCard from '@/components/dashboard/HistoryCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface IRecentActivitiesProps {}

export default async function RecentActivities(props: IRecentActivitiesProps) {
  const session = await getAuthSession();

  if (!session?.user) redirect('/');

  const gamesCount = prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Recent Activities</CardTitle>
        <CardDescription>
          You have played a total of {gamesCount} games
        </CardDescription>
      </CardHeader>
      <CardContent className='max-h-[580px] overflow-scroll'>
        <HistoryComponent userId={session.user.id} limit={10} />
      </CardContent>
    </Card>
  );
}
