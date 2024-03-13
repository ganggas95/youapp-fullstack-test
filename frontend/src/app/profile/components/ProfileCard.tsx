import { CSSProperties } from 'react';

import Card, { CardBody } from '@/components/Card';
import Tag from '@/components/Tag';
import ZodiacIcon from '@/components/ZodiacIcon';
import { useGlobalContext } from '@/contexts/global.provider';
import { calculateAge } from '@/utils/date.utils';
import {
  detectChineseZodiac,
  detectZodiac
} from '@/utils/zodiac-horoscope.utils';

function ProfileCard() {
  const { profile, photoProfile } = useGlobalContext();
  const generateStyle = (): CSSProperties => {
    if (!photoProfile) return {};
    return {
      backgroundImage: `url(${photoProfile})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundOrigin: 'border-box',
    };
  };
  const zodiac = detectZodiac(profile?.birthday);
  const chineseZodiac = detectChineseZodiac(profile?.birthday);
  return (
    <Card className="bg-dark-lighten relative" style={generateStyle()}>
      {photoProfile && <div className="bg-profile-overlay z-[1]"></div>}
      <CardBody className="flex h-[190px] flex-col gap-4 justify-end items-start p-0 ">
        <p className="text-white z-[2]">
          @{profile?.username}, {calculateAge(profile?.birthday)}
        </p>
        {profile?.birthday && (
          <div className="flex gap-x-2">
            {zodiac && (
              <Tag
                className="py-2 px-3 !rounded-full z-[2]"
                prefixElement={() => (
                  <ZodiacIcon className="h-6 w-6" name={zodiac} />
                )}
                label={zodiac}
              />
            )}
            {chineseZodiac && (
              <Tag
                className="py-2 px-3 !rounded-full z-[2]"
                prefixElement={() => (
                  <ZodiacIcon className="h-6 w-6" name={chineseZodiac} />
                )}
                label={chineseZodiac}
              />
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default ProfileCard;
