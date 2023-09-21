'use client';

import { cn, formatTimeDelta } from '@/lib/utils';
import { Game, Question } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import { BarChart, ChevronRight, Link, Loader2, Timer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button, buttonVariants } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import axios from 'axios';
import BlankAnswerInput from '../BlankAnswerInput';

export interface IOpenEndedProps {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] };
}

export default function OpenEnded({ game }: IOpenEndedProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const [blankAnswer, setBlankAnswer] = useState<string>('');

  const { toast } = useToast();
  const currentQuestion = useMemo(
    () => game.questions[questionIndex],
    [questionIndex, game.questions],
  );

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

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll('#user-blank-input').forEach((input) => {
        // @ts-ignore
        filledAnswer = filledAnswer.replace('_____', input.value);
        // @ts-ignore
        input.value = '';
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      const response = await axios.post('/api/checkAnswer', payload);

      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% to the correct answer`,
          description: 'Answers are matched based on similarity comparsions',
        });
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [isChecking, checkAnswer, toast, questionIndex, game.questions.length]);

  useEffect(() => {
    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (e.key === '1') {
    //     setSelectedChoice(0);
    //   }
    //   if (e.key === '2') {
    //     setSelectedChoice(1);
    //   }
    //   if (e.key === '3') {
    //     setSelectedChoice(2);
    //   }
    //   if (e.key === '4') {
    //     setSelectedChoice(3);
    //   }
    //   if (e.key === 'Enter') {
    //     handleNext();
    //   }
    //   if (e.key === 'ArrowUp') {
    //     setSelectedChoice((prev) => {
    //       if (prev === 0) return prev;
    //       return prev - 1;
    //     });
    //   }
    //   if (e.key === 'ArrowDown') {
    //     setSelectedChoice((prev) => {
    //       if (prev === 3) return prev;
    //       return prev + 1;
    //     });
    //   }
    // };
    // document.addEventListener('keydown', handleKeyDown);
    // return () => {
    //   document.removeEventListener('keydown', handleKeyDown);
    // };
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
        {/* 
        <McqCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        /> */}
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
        <BlankAnswerInput
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />
        <Button className='mt-2' disabled={isChecking} onClick={handleNext}>
          {isChecking && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Next <ChevronRight className='w-4 h-4 ml-2 ' />
        </Button>
      </div>
    </div>
  );
}
