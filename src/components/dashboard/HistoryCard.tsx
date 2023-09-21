'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface HistoryCardProps {}

export default function HistoryCard(props: HistoryCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push('/history')}
      className='hover:cursor-pointer hover:opacity-75'>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle className='text-2xl font-bold'>History</CardTitle>
        <History size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>View past quiz attempts</p>
      </CardContent>
    </Card>
  );
}
