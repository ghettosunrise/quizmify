import AccuracyCard from '@/components/statistics/AccuracyCard';
import QuestionsList from '@/components/statistics/QuestionList';
import ResultsCard from '@/components/statistics/ResultsCard';
import TimeTakenCard from '@/components/statistics/TimeTakenCard';
import { buttonVariants } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface IStatisticsPageProps {
  params: {
    gameId: string;
  };
}

export default async function StatisticsPage({
  params: { gameId },
}: IStatisticsPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/');
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: true,
    },
  });

  if (!game) redirect('/quiz');

  let accuracy: number = 0;

  if (game.gameType === 'mcq') {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }

      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else {
    let totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect || 0);
    }, 0);

    accuracy = totalPercentage / game.questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className='p-8 mx-auto max-w-7xl'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Statistics</h2>
        <div className='flex items-center space-x-2'>
          <Link href='/dashboard' className={buttonVariants()}>
            <LucideLayoutDashboard className='mr-2  ' />
            Back to dashboard
          </Link>
        </div>
      </div>
      <div className='grid gap-4 mt-4 md:grid-cols-7'>
        <ResultsCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTakenCard timeStarted={new Date()} timeEnded={game.timeStarted} />
      </div>

      <QuestionsList questions={game.questions} />
    </div>
  );
}
