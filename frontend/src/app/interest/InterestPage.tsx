'use client';
import { useEffect, useState } from 'react';

import PageHeader from '@/components/PageHeader';
import TagInput from '@/components/TagInput';
import { useGlobalContext } from '@/contexts/global.provider';
import profileService from '@/service/profile.service';

function InterestPage() {
  const { profile } = useGlobalContext();
  const [interest, setInterests] = useState<string[]>([]);
  const onChange = (values: string[]) => {
    setInterests(values);
  };

  const onSaveInterest = async () => {
    try {
      await profileService.createOrUpdateProfile({
        interests: interest,
      });
      window.location.replace('/profile');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (profile?.interests) {
      setInterests(profile.interests);
    }
  }, [profile]);
  return (
    <div className="h-full w-full overflow-y-hidden">
      <PageHeader
        className="grid grid-cols-2 max-h-fit items-center"
        renderAction={
          <a
            className="flex justify-end text-xs text-primary"
            onClick={onSaveInterest}
          >
            Save
          </a>
        }
      ></PageHeader>
      <div className="flex flex-col pt-14 px-4 overflow-y-auto max-h-[80vh]">
        <div className="flex flex-col gap-y-2 px-3 mb-4">
          <h3 className="text-sm text-golden">Tell everyone about yourself</h3>
          <h1 className="text-xl text-white">What interest you?</h1>
        </div>
        <TagInput sm removable value={interest} onChangeValue={onChange} />
      </div>
    </div>
  );
}

export default InterestPage;
