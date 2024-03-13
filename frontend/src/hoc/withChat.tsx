/* eslint-disable react/display-name */
import ChatButton from '@/components/ChatButton';
import { ChatProvider } from '@/contexts/chat.provider';
import { PresenseProvider } from '@/contexts/presense.provider';

function withChat<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    return (
      <PresenseProvider>
        <ChatProvider>
          <ChatButton />
          <Component {...props} />
        </ChatProvider>
      </PresenseProvider>
    );
  };
}

export default withChat;
