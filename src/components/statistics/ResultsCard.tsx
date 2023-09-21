import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, Trophy } from 'lucide-react';

export interface IResultsCardProps {
  accuracy: number;
}

export default function ResultsCard({ accuracy }: IResultsCardProps) {
  return (
    <Card className='md:col-span-7'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
        <CardTitle className='space-2xl font-bold'>Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center h-3/5'>
        <>
          <Trophy
            stroke={
              accuracy > 75 ? 'gold' : accuracy > 25 ? 'silver' : '#9a6f27'
            }
            size={50}
          />
          <div className='flex flex-col text-2xl font-semibold text-yellow-400'>
            <span>
              {accuracy > 75
                ? 'Impressive'
                : accuracy > 25
                ? 'Good Job'
                : 'Nice try!'}
            </span>
            <span className='text-sm text-center text-black opacity-50 '>
              {`${
                accuracy > 75 ? '> 75' : accuracy > 25 ? ' > 25' : '< 25'
              }% accuracy`}
            </span>
          </div>
        </>
      </CardContent>
    </Card>
  );
}
