import { getAuthSession } from '@/lib/nextauth';
import { NextResponse } from 'next/server';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import axios from 'axios';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'You must be logged in',
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { topic, type, amount } = quizCreationSchema.parse(body);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    await prisma.topicCount.upsert({
      // @ts-ignore
      where: { topic },
      create: {
        topic,
        count: 1,
      },
      update: {
        topic,
        count: {
          increment: 1,
        },
      },
    });

    const { data } = await axios.post(
      `${process.env.API_URL as string}/api/questions`,
      { amount, topic, type },
    );

    if (type === 'mcq') {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ].sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: 'mcq',
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    }

    if (type === 'open_ended') {
      type openEnded = {
        question: string;
        answer: string;
      };

      const manyData = data.questions.map((question: openEnded) => ({
        question: question.question,
        answer: question.answer,
        gameId: game.id,
        questionType: 'open_ended',
      }));

      await prisma.question.createMany({
        data: manyData,
      });
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      {
        status: 500,
      },
    );
  }
}
