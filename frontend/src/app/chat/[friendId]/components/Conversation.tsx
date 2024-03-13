'use client';
import { useEffect, useState } from 'react';

import clsx from 'clsx';

import PageHeader from '@/components/PageHeader';
import UserAvatar from '@/components/UserAvatar';
import { useChatContext } from '@/contexts/chat.provider';
import { usePresenseContext } from '@/contexts/presense.provider';

import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

function Conversation() {
  const { messages, friend } = useChatContext();
  const { onlineUsers } = usePresenseContext();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const onlineUser = onlineUsers.find((u) => u.id === friend?.id);
    if (onlineUser) {
      setIsOnline(onlineUser.isOnline);
    } else {
      setIsOnline(false);
    }
  }, [onlineUsers, friend]);
  return (
    <div className="h-full w-full grid grid-cols-1 overflow-y-hidden">
      <PageHeader className="row-span-1 items-start">
        <div className="flex items-center gap-2">
          <div>
            <UserAvatar
              className={clsx({
                'border-green-500 border rounded-full': isOnline,
                '!w-6 !h-6': true,
              })}
              username={friend?.username || ''}
              size={20}
              url={friend?.avatar || ''}
            />
          </div>
          <span
            title={friend?.username}
            className="text-white text-sm truncate text-ellipsis"
          >
            {friend?.username}
          </span>
        </div>
      </PageHeader>
      <div className="flex flex-col w-full gap-y-2 row-span-12 overflow-y-auto max-h-[80vh] p-4">
        {messages.map((d, index) => (
          <ChatItem key={index} message={d} />
        ))}
        <div
          ref={(el) => {
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={clsx({
            'w-full h-2': true,
          })}
        ></div>
      </div>
      <ChatInput className="flex row-span-1 items-end p-2" />
    </div>
  );
}
export default Conversation;
