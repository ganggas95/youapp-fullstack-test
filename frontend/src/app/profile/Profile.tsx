'use client';
import PageHeader from '@/components/PageHeader';
import { useGlobalContext } from '@/contexts/global.provider';
import { PresenseProvider } from '@/contexts/presense.provider';
import withChat from '@/hoc/withChat';

import AboutCard from './components/AboutCard';
import AccountMenu from './components/AccountMenu';
import InterestCard from './components/InterestCard';
import ProfileCard from './components/ProfileCard';

function ProfilePage() {
  const { profile } = useGlobalContext();
  return (
    <PresenseProvider>
      <div className="h-full w-full overflow-y-hidden">
        <PageHeader
          className="max-h-fit items-start"
          title={`@${profile?.username}`}
          renderAction={<AccountMenu />}
        />
        <div className="flex flex-col w-full gap-y-2 overflow-y-auto max-h-[90vh] p-4">
          <ProfileCard />
          <div className="flex flex-col gap-y-4 w-full">
            <AboutCard />
            <InterestCard />
          </div>
        </div>
      </div>
    </PresenseProvider>
  );
}

export default withChat(ProfilePage);
