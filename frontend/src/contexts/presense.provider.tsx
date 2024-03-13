'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { OnlineUserIface } from '@/interfaces/response/user.iface';
import { BackgroundTimer } from '@/utils/timer';

import SocketIOClient from 'socket.io-client';

import { useGlobalContext } from './global.provider';

export interface PresenseContextIFace {
  onlineUsers: OnlineUserIface[];
}

export const PresenseContext = createContext<PresenseContextIFace>({
  onlineUsers: [],
});

export const usePresenseContext = () => {
  const presenseContext = useContext(PresenseContext);
  if (!presenseContext) {
    throw new Error('usePresense must be used within a PresenseProvider');
  }
  return presenseContext;
};

export const PresenseProvider = ({ children }: { children: ReactNode }) => {
  const { token, profile } = useGlobalContext();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserIface[]>([]);
  const presenseBaseUrl = process.env.NEXT_PUBLIC_PRESENSE_SOCKET_URL as string;
  const presenseSocket = useMemo(() => {
    return SocketIOClient(presenseBaseUrl, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token,
          },
        },
      },
    });
  }, [token, presenseBaseUrl]);

  useEffect(() => {
    presenseSocket.emit('setOnline', true);
    presenseSocket.on('onlineUser', (user: OnlineUserIface) => {
      if (user.id === profile?.id) return;
      setOnlineUsers((prev) => {
        const updatedUsers = [...prev];
        const isOnlineUser = updatedUsers.find((f) => f.id === user.id);
        if (!isOnlineUser) return [...prev, user];
        isOnlineUser.isOnline = user.isOnline;
        return updatedUsers;
      });
    });
    return () => {
      presenseSocket.emit('setOnline', false);
      presenseSocket.off('onlineUser');
    };
  }, [presenseSocket, profile]);

  useEffect(() => {
    BackgroundTimer.start(() => {
      // ping server to keep ws alive in background
      presenseSocket.emit('ping');
    }, 3000);
    return () => {
      BackgroundTimer.stop();
    };
  }, [presenseSocket]);
  return (
    <PresenseContext.Provider
      value={{
        onlineUsers,
      }}
    >
      {children}
    </PresenseContext.Provider>
  );
};
