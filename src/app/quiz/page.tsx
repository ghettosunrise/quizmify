import QuizCreation from '@/components/quiz/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface IQuizPageProps {
  searchParams: {
    topic?: string;
  };
}

export const metadata = {
  title: 'Quiz | Quiz-mi-fy',
};

export default async function QuizPage({ searchParams }: IQuizPageProps) {
  const session = await getAuthSession();

  const { topic } = searchParams;

  if (!session?.user) {
    return redirect('/');
  }

  return <QuizCreation topicParam={topic ?? ''}></QuizCreation>;
}
