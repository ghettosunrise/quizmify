'use client';

import { Game, Question } from '@prisma/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import McqCounter from './McqCounter';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { z } from 'zod';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

interface IMcqProps {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
}

export default function Mcq({ game }: IMcqProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }

      return () => {
        clearInterval(interval);
      };
    }, 1000);
  }, [hasEnded]);

  const currentQuestion = useMemo(
    () => game.questions[questionIndex],
    [questionIndex, game.questions],
  );

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post('/api/checkAnswer', payload);

      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;

    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: 'Correct!',
            description: 'Correct answer',
            variant: 'success',
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: 'Incorrect!',
            description: 'Incorrect answer',
            variant: 'destructive',
          });
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [isChecking, checkAnswer, toast, questionIndex, game.questions.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') {
        setSelectedChoice(0);
      }
      if (e.key === '2') {
        setSelectedChoice(1);
      }
      if (e.key === '3') {
        setSelectedChoice(2);
      }
      if (e.key === '4') {
        setSelectedChoice(3);
      }
      if (e.key === 'Enter') {
        handleNext();
      }

      if (e.key === 'ArrowUp') {
        setSelectedChoice((prev) => {
          if (prev === 0) return prev;

          return prev - 1;
        });
      }
      if (e.key === 'ArrowDown') {
        setSelectedChoice((prev) => {
          if (prev === 3) return prev;

          return prev + 1;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='p-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
          You completed in{' '}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          className={cn(buttonVariants(), 'w-full mt-4')}
          href={`/statistics/${game.id}`}>
          View statistics <BarChart className='w-4 h-4 ml-2' />
        </Link>
      </div>
    );
  }

  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col'>
          <p>
            <span className='text-slate-400 mr-2'>Topic</span>
            <span className='px-2 py-1 text-white rounded-lg bg-slate-900'>
              {game.topic}
            </span>
          </p>
          <div className='flex self-start mt-3 text-slate-400'>
            <Timer className='mr-2' />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>

        <McqCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>
      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row items-center'>
          <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
            <div>{questionIndex + 1}</div>
            <div className='text-base text-slate-400'>
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className='!mt-0 flex-grow text-lg'>
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='flex flex-col items-center justify-center w-full mt-4'>
        {options?.map((option, index) => (
          <Button
            onClick={() => setSelectedChoice(index)}
            variant={index === selectedChoice ? 'default' : 'secondary'}
            className='w-full py-8 mb-4'
            key={index}>
            <div className=' w-full flex items-center justify-start '>
              <div className='py-2 px-3 mr-5 border rounded-md'>
                {index + 1}
              </div>
              <div className='text-start'>{option}</div>
            </div>
          </Button>
        ))}
        <Button className='mt-2' disabled={isChecking} onClick={handleNext}>
          {isChecking && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Next <ChevronRight className='w-4 h-4 ml-2 ' />
        </Button>
      </div>
    </div>
  );
}
