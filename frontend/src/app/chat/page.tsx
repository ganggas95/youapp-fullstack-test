import { redirect } from 'next/navigation';

import {
  getProfileFromServer,
  getSession,
  getUsersFromServer
} from '@/actions/server.actions';
import { GlobalProvider } from '@/contexts/global.provider';

import ChatPage from './components/ChatPage';

async function ChatIndexPage() {
  const token = await getSession();
  if (!token) {
    redirect('/login');
  }
  try {
    const profile = await getProfileFromServer();
    const responseUsers = await getUsersFromServer();

    return (
      <GlobalProvider
        photoProfile={profile.avatar}
        token={token}
        profile={profile}
      >
        <ChatPage users={responseUsers.filter((d) => d.id !== profile.id)} />
      </GlobalProvider>
    );
  } catch (error) {
    throw error;
  }
}

export default ChatIndexPage;
