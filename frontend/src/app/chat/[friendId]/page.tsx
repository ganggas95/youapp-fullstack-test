import { redirect } from 'next/navigation';

import {
  getDetailUserFromServer,
  getProfileFromServer,
  getSession
} from '@/actions/server.actions';
import { GlobalProvider } from '@/contexts/global.provider';

import ChatPage from './components/ChatWithFirendPage';

async function ChatIndexPage({ params }: { params: { friendId: string } }) {
  const token = await getSession();
  if (!token) redirect('/login');
  try {
    const profile = await getProfileFromServer();
    const friend = await getDetailUserFromServer(params.friendId);
    return (
      <GlobalProvider
        photoProfile={profile.avatar}
        profile={profile}
        token={token}
      >
        <ChatPage friend={friend} />
      </GlobalProvider>
    );
  } catch (error) {
    throw error;
  }
}

export default ChatIndexPage;
