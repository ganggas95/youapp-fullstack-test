import Link from 'next/link';

import { ChatBubbleIcon } from '@radix-ui/react-icons';

const ChatButton = () => {
  return (
    <Link href="/chat" className="chat-button">
      <ChatBubbleIcon />
    </Link>
  );
}

ChatButton.displayName = "ChatButton";
export default ChatButton;