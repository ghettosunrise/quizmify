import CustomWordCloud from '@/components/CustomWordCloud';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/db';
import * as React from 'react';

export interface IHotTopicsCardProps {}

export default async function HotTopicsCard(props: IHotTopicsCardProps) {
  const topics = (await prisma.topicCount?.findMany({ where: {} })) || [];

  const formattedTopics = topics.map((topic) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>
      <CardContent className='pl-2'>
        <CustomWordCloud topics={formattedTopics} />
      </CardContent>
    </Card>
  );
}
