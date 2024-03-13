'use client';
import PageHeader from '@/components/PageHeader';
import { ChatProvider } from '@/contexts/chat.provider';
import { PresenseProvider } from '@/contexts/presense.provider';
import { ProfileResponseIface } from '@/interfaces/response';

import ListUserItem from './ListUserItem';

type IProps = {
  users?: ProfileResponseIface[];
};
function ChatPage({ users }: IProps) {
  return (
    <PresenseProvider>
      <ChatProvider>
        <div className="h-full w-full overflow-y-hidden">
          <PageHeader title="Chat" className="max-h-fit items-start" />
          <div className="flex flex-col gap-y-4 w-full overflow-y-auto max-h-[80vh] px-4">
            {users?.map((user) => <ListUserItem key={user.id} user={user} />)}
          </div>
        </div>
      </ChatProvider>
    </PresenseProvider>
  );
}
export default ChatPage;
