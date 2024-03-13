"use client";
import { ChatProvider } from '@/contexts/chat.provider';
import { PresenseProvider } from '@/contexts/presense.provider';
import { ProfileResponseIface } from '@/interfaces/response';

import Conversation from './Conversation';

type IProps = {
  friend: ProfileResponseIface;
};

function ChatPage({ friend }: IProps) {
  return (
    <PresenseProvider>
      <ChatProvider friend={friend}>
        <>
          <Conversation />
        </>
      </ChatProvider>
    </PresenseProvider>
  );
}
export default ChatPage;
