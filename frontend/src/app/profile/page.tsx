import { redirect } from 'next/navigation';

import { getProfileFromServer, getSession } from '@/actions/server.actions';
import { GlobalProvider } from '@/contexts/global.provider';

import ProfilePage from './Profile';

async function ProfileIndexPage() {
  const token: string | undefined = await getSession();
  if (!token) redirect('/login');
  try {
    const profile = await getProfileFromServer();
    console.log(profile)
    if (!profile || !token) {
      redirect('/login');
    }
    return (
      <GlobalProvider
        photoProfile={profile.avatar}
        profile={profile}
        token={token}
      >
        <ProfilePage />
      </GlobalProvider>
    );
  } catch (error) {
    throw error;
  }
}

export default ProfileIndexPage;
