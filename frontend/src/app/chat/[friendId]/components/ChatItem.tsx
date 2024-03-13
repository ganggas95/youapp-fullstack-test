import clsx from 'clsx';

import UserAvatar from '@/components/UserAvatar';
import { useChatContext } from '@/contexts/chat.provider';
import { MessageSocketIface } from '@/interfaces/response/chat.iface';

type IProps = {
  message: MessageSocketIface;
};

function ChatItem({ message }: IProps) {
  const { profile, friend } = useChatContext();
  const isMe = profile?.id === message.user;
  return (
    <div
      className={clsx({
        'w-full flex': true,
      })}
    >
      <div
        className={clsx({
          'w-full flex gap-x-4 items-end': true,
          'flex-row-reverse self-end': !isMe,
        })}
      >
        <div className={clsx(!isMe ? 'flex-2' : '')}>
          <UserAvatar
            className='!w-8 !h-8'
            username={(isMe ? profile?.name : friend?.username) || ''}
            url={(isMe ? profile?.avatar : friend?.avatar) || ''}
          ></UserAvatar>
        </div>
        <div
          className={clsx({
            'bg-gray-500 rounded-md px-4 py-2 w-fit max-w-[70%] text-sm': true,
            '': !isMe,
          })}
        >
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
