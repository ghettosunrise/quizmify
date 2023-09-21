import Mcq from '@/components/play/Mcq';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface IOpenEndedProps {
  params: {
    gameId: string;
  };
}

export default async function McqGame({ params: { gameId } }: IOpenEndedProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/');
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          options: true,
          question: true,
        },
      },
    },
  });

  if (!game || game.gameType !== 'mcq') redirect('/');

  return <Mcq game={game} />;
}
