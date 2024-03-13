'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import clsx from 'clsx';

import UserAvatar from '@/components/UserAvatar';
import { usePresenseContext } from '@/contexts/presense.provider';
import { ProfileResponseIface } from '@/interfaces/response';

type IProps = {
  user: ProfileResponseIface;
};
function ListUserItem({ user }: IProps) {
  const { onlineUsers } = usePresenseContext();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // console.log(onlineUsers);
    const onlineUser = onlineUsers.find((u) => u.id === user.id);
    if (onlineUser) {
      setIsOnline(onlineUser.isOnline);
    } else {
      setIsOnline(false);
    }
  }, [onlineUsers, user]);
  return (
    <Link
      href={`/chat/${user.id}`}
      className="flex gap-x-2 w-full justify-between items-center bg-gray-500/30 rounded-md px-4 py-1"
    >
      <div className="flex items-center gap-2">
        <UserAvatar
          className={clsx({
            'w-10 h-10': true,
            'border-green-500 border rounded-full': isOnline,
          })}
          username={user.username}
          size={20}
          url={user.avatar}
        />
        <div className="flex flex-col">
          <span className="text-white text-sm">@{user.username}</span>
          <span className="text-xs text-gray-400">{user.email}</span>
        </div>
      </div>
    </Link>
  );
}
export default ListUserItem;
