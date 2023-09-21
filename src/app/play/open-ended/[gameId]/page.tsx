import OpenEnded from '@/components/play/OpenEnded';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface IOpenEndedProps {
  params: {
    gameId: string;
  };
}

export default async function OpenEndedPage({
  params: { gameId },
}: IOpenEndedProps) {
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
          question: true,
          answer: true,
        },
      },
    },
  });

  if (!game || game.gameType !== 'open_ended') redirect('/');

  return <OpenEnded game={game} />;

  // return <Mcq game={game} />;
}
