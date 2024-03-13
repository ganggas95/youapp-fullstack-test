import { redirect } from 'next/navigation';

import { getProfileFromServer, getSession } from '@/actions/server.actions';
import { GlobalProvider } from '@/contexts/global.provider';

import InterestPage from './InterestPage';

async function InterestIndexPage() {
  const token = await getSession();
  if (!token) redirect('/login');
  try {
    const profile = await getProfileFromServer();
    return (
      <GlobalProvider
        photoProfile={profile.avatar}
        profile={profile}
        token={token}
      >
        <InterestPage />
      </GlobalProvider>
    );
  } catch (error) {
    throw error;
  }
}

export default InterestIndexPage;
