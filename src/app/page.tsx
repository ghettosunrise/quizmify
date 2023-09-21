import SignInButton from '@/components/SignInButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    return redirect('/dashboard');
  }

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to Quiz-mi-fy</CardTitle>
          <CardDescription>
            Quiz-mi-fy is an app that allows you to create and share quizzez
            with your friends
          </CardDescription>
          <SignInButton text='Sign In with Google' />
        </CardHeader>
      </Card>
    </div>
  );
}
