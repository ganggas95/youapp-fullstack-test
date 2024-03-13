'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { ProfileResponseIface } from '@/interfaces/response';
import {
  ConversationSocketIface,
  MessageSocketIface
} from '@/interfaces/response/chat.iface';
import { BackgroundTimer } from '@/utils/timer';

import SocketIOClient from 'socket.io-client';

import { useGlobalContext } from './global.provider';

export interface ChatContextIface {
  conversations: ConversationSocketIface[];
  profile: ProfileResponseIface | null;
  messages: MessageSocketIface[];
  friend?: ProfileResponseIface | null;
  conversation: ConversationSocketIface | null;
  sendMessage: (message: string) => void;
}

export const ChatContext = createContext<ChatContextIface>({
  conversations: [],
  conversation: null,
  profile: null,
  messages: [],
  friend: null,
  sendMessage: () => {},
});

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({
  children,
  friend,
}: {
  children: ReactNode;
  friend?: ProfileResponseIface;
}) => {
  const { token, profile } = useGlobalContext();
  const [conversation, setConversation] =
    useState<ConversationSocketIface | null>(null);
  const [conversations, setConversations] = useState<ConversationSocketIface[]>(
    []
  );
  const [messages, setMessages] = useState<MessageSocketIface[]>([]);
  const chatBaseUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL as string;
  const chatSocket = useMemo(() => {
    return SocketIOClient(chatBaseUrl, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token,
          },
        },
      },
    });
  }, [token, chatBaseUrl]);
  useEffect(() => {
    // chatSocket.emit("getConversations");
    chatSocket.connect();
    chatSocket.on('getAllConversations', (data: ConversationSocketIface[]) => {
      setConversations(data);
    });
    return () => {
      chatSocket.off('getAllConversations');
      chatSocket.disconnect();
    };
  }, [chatSocket]);

  useEffect(() => {
    if (friend && conversations.length > 0) {
      const conversation = conversations.find((conv) =>
        conv.users.some((user) => user.id === friend.id)
      );
      if (conversation) {
        setConversation(conversation);
        setMessages(conversation.messages);
      }
    }
  }, [friend, conversations]);

  useEffect(() => {
    chatSocket.on('newMessage', (data: MessageSocketIface) => {
      setMessages((prev) => [...prev, data]);
      // 
    });
    return () => {
      chatSocket.off('newMessage');
    };
  }, [chatSocket]);

  const sendMessage = (message: string) => {
    if (friend) {
      chatSocket.emit('sendMessage', {
        friendId: friend.id,
        message,
      });
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  useEffect(() => {
    BackgroundTimer.start(() => {
      // ping server to keep ws alive in background
      chatSocket.emit('ping');
    }, 3000);
    return () => {
      BackgroundTimer.stop();
    };
  }, [chatSocket]);

  useEffect(()=>{
    const visibilitychange = document.addEventListener("visibilitychange", () => {
      if(!document.hidden){
        console.log("Wellcome")
      }
    })
    return () => {
      document.removeEventListener("visibilitychange", visibilitychange as any);
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        conversation,
        profile,
        messages,
        friend,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
