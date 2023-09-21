import { getAuthSession } from '@/lib/nextauth';
import Link from 'next/link';
import SignInButton from './SignInButton';
import UserAccountNav from './UserAccountNav';
import ThemeToggle from './ThemeToggle';

export interface NavbarProps {}

async function Navbar(props: NavbarProps) {
  const session = await getAuthSession();

  return (
    <div className='fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2'>
      <div className='flex items-center justify-between h-full gap-2 p 8 mx-auto max-w-7xl'>
        <Link className='flex items-center gap-2' href='/'>
          <p className='rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white'>
            Quiz-mi-fy
          </p>
        </Link>

        <div className='flex items-center'>
          {' '}
          <ThemeToggle className='mr-4' />
          <div className='flex items-center'>
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton text='Sign In' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
