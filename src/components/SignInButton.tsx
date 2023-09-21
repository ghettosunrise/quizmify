'use client';

import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

type Props = {
  text: string;
};

function SignInButton({ text }: Props) {
  return (
    <Button onClick={() => signIn('google').catch((err) => console.error(err))}>
      {text}
    </Button>
  );
}

export default SignInButton;
