'use client';
import { useCookies } from 'react-cookie';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/DropdownMenu';

function AccountMenu() {
  const [_, setCookie] = useCookies(['you-token']);
  const doLogout = () => {
    setCookie('you-token', '', { expires: new Date(0) });
    window.location.replace('/login');
  };
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="self-end w-5 h-5 active:outline-none focus:outline-none active:border-none focus:border-none">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={doLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AccountMenu;
