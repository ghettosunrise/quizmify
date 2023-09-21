'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { BookOpen, CopyCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingQuestions from '../LoadingQuestions';

export type Props = {
  topicParam: string;
};

type Input = z.infer<typeof quizCreationSchema>;

type ModeType = Input['type'];

export default function QuizCreation({ topicParam }: Props) {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ type, amount, topic }: Input) => {
      const response = await axios.post('/api/game', {
        type,
        amount,
        topic,
      });

      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: 'mcq',
    },
  });

  function onSubmit(data: Input) {
    setShowLoader(true);
    getQuestions(data, {
      onSuccess: ({ gameId }) => {
        setFinished(true);

        setTimeout(() => {
          if (form.getValues('type') === 'mcq') {
            return router.push(`play/mcq/${gameId}`);
          }

          return router.push(`play/open-ended/${gameId}`);
        }, 1000);
      },
      onError: () => setShowLoader(false),
    });
  }

  function switchMode(mode: ModeType) {
    return form.setValue('type', mode);
  }

  form.watch();

  if (showLoader) return <LoadingQuestions finished={finished} />;

  return (
    <div className='w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='topic'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter a topic...' {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of questions</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={1}
                        max={10}
                        onChange={(e) =>
                          form.setValue('amount', parseInt(e.target.value))
                        }
                        placeholder='Enter an amount...'
                      />
                    </FormControl>
                    <FormDescription>
                      {' '}
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button
                  type='button'
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                  onClick={() => switchMode('mcq')}
                  className=' w-1/2 rounded-none rounded-l-lg text-xs'>
                  <CopyCheck className='w-4 h-4 mr-2' />
                  Multiple Choice
                </Button>
                <Separator orientation='vertical' />
                <Button
                  type='button'
                  onClick={() => switchMode('open_ended')}
                  className='w-1/2 rounded-none rounded-r-lg text-xs'
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }>
                  <BookOpen className='w-4 h-4 mr-2' />
                  Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type='submit'>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
