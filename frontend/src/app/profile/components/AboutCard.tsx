'use client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import Card, { CardBody, CardHeader } from '@/components/Card';
import { useGlobalContext } from '@/contexts/global.provider';
import { ProfileDto } from '@/interfaces/dto/profile.dto';
import profileService from '@/service/profile.service';
import uploadService from '@/service/upload.service';

import AboutForm from './AboutForm';
import EditActionButton from './EditActionButton';
import ProfileContent from './ProfileContent';

function AboutCard() {
  const { profile, setProfile, setPhotoProfile } = useGlobalContext();
  const [editMode, setEditMode] = useState(false);
  const [photo, setPhoto] = useState<Blob | null | string>(null);

  const { control, handleSubmit, watch } = useForm<ProfileDto>({
    defaultValues: {
      name: profile?.name || '',
      birthday: profile?.birthday || '',
      height: profile?.height || 0,
      weight: profile?.weight || 0,
      interests: profile?.interests || [],
    },
  });

  const isProfileEmpty = () => {
    return (
      !profile?.name &&
      !profile?.birthday &&
      !profile?.height &&
      !profile?.weight
    );
  };

  const onChangePhoto = (photo: Blob) => {
    setPhoto(photo);
  };

  const handleUploadAvatar = async (): Promise<string | null> => {
    if (photo instanceof Blob) {
      return await uploadService.uploadFile(photo);
    } else if (typeof photo === 'string') {
      return photo;
    }
    return null;
  };

  const onSubmit: SubmitHandler<ProfileDto> = async (data) => {
    const payload = {
      ...data,
      height: Number(data.height),
      weight: Number(data.weight),
      // avatar: photo,
    };
    const avatar = await handleUploadAvatar();
    const response = await profileService.createOrUpdateProfile({
      ...payload,
      avatar
    });
    if (avatar) setPhotoProfile(avatar);
    setProfile(response);
    setEditMode(false);
  };

  const birthday = watch('birthday');

  const handleSetEditMode = () => {
    if (!editMode && profile?.avatar) {
      setPhoto(profile?.avatar);
    }
    setEditMode(!editMode);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="bg-dark">
        <CardHeader
          actionComponent={
            <EditActionButton
              editMode={editMode}
              setEditMode={handleSetEditMode}
              onSave={handleSubmit(onSubmit)}
            />
          }
        >
          <h1 className="text-sm">About</h1>
        </CardHeader>
        <CardBody className="flex text-sm flex-col justify-end items-start px-2 py-2 mt-4">
          {editMode ? (
            <AboutForm
              control={control}
              birthday={birthday || ''}
              photo={photo}
              onChangePhoto={onChangePhoto}
            />
          ) : (
            <ProfileContent />
          )}
        </CardBody>
      </Card>
    </form>
  );
}
export default AboutCard;
