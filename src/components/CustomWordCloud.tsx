'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import D3WordCloud from 'react-d3-cloud';

type Topic = {
  text: string;
  value: number;
};

export interface ICustomWordCloudProps {
  topics: Topic[];
}

const data = [
  { text: 'Hey', value: 3 },
  { text: 'Hi', value: 5 },
  { text: 'Computer', value: 10 },
  { text: 'nextjs', value: 8 },
  { text: 'live', value: 7 },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

export default function CustomWordCloud({ topics }: ICustomWordCloudProps) {
  const theme = useTheme();

  const router = useRouter();

  return (
    <D3WordCloud
      data={topics}
      height={550}
      font='times'
      fontSize={fontSizeMapper}
      rotate={0}
      padding={10}
      onWordClick={(e, word) => router.push(`/quiz?topic=${word.text}`)}
      fill={theme.theme === 'dark' ? 'white' : 'black'}
    />
  );
}
