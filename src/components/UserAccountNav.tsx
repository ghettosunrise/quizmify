'use client';

import { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import UserAvatar from './UserAvater';

export interface UserProps {
  user: Pick<User, 'name' | 'email' | 'image'>;
}

export default function UserAccountNav({ user }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && (
              <p className='text-sm w-[200px] text-zink-700 truncate'>
                {user.email}
              </p>
            )}
            {/* {user.image && } */}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-red-300'
          onClick={(e) => {
            e.preventDefault;
            signOut().catch(console.error);
          }}>
          Sign Out
          <LogOut className='w-4 h-4 ml-2' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
