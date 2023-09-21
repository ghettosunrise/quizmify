import { prisma } from '@/lib/db';
import { Clock, CopyCheck, Edit2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import McqCounter from './play/McqCounter';

type Props = {
  limit: number;
  userId: string;
};

function getRandomDateTwoHoursBeforeLastHour() {
  const now: any = new Date();
  // Получаем три часа в миллисекундах (3 часа * 60 минут * 60 секунд * 1000 миллисекунд)
  const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;
  // Получаем один час в миллисекундах
  const oneHourInMilliseconds = 60 * 60 * 1000;

  // Генерируем случайное число миллисекунд в пределах двух часов
  const randomMilliseconds =
    Math.random() * (threeHoursInMilliseconds - oneHourInMilliseconds);

  // Вычитаем это число и ещё один час из текущего времени, чтобы получить случайное время за последние 3 часа, но исключая последний час
  const randomDate = new Date(now - randomMilliseconds - oneHourInMilliseconds);

  return randomDate;
}

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: 'desc',
    },
  });
  return (
    <div className='space-y-8'>
      {games.map((game) => {
        return (
          <div className='flex items-center justify-between' key={game.id}>
            <div className='flex items-center'>
              {game.gameType === 'mcq' ? (
                <CopyCheck className='mr-3' />
              ) : (
                <Edit2 className='mr-3' />
              )}
              <div className='ml-4 space-y-1'>
                <Link
                  className='text-base font-medium leading-none underline'
                  href={`/statistics/${game.id}`}>
                  {game.topic}
                </Link>
                <p className='flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800'>
                  <Clock className='w-4 h-4 mr-1' />
                  {new Date(
                    game.timeEnded ?? getRandomDateTwoHoursBeforeLastHour(),
                  ).toLocaleDateString()}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {game.gameType === 'mcq' ? 'Multiple Choice' : 'Open-Ended'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
