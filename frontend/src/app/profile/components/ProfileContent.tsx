import { useGlobalContext } from '@/contexts/global.provider';
import { calculateAge, formatDate } from '@/utils/date.utils';
import {
  detectChineseZodiac,
  detectZodiac
} from '@/utils/zodiac-horoscope.utils';

function ProfileContent() {
  const { profile } = useGlobalContext();
  //   Render empty
  const renderEmpty = () => {
    return (
      <p className="text-gray-500">
        Add in your your to help others know you better
      </p>
    );
  };
  //   Render data
  const renderItem = (label: string, value: string | number | undefined) => {
    return (
      <li className="flex gap-x-2 w-full">
        <span>{label}</span>
        <span className="text-white">{value}</span>
      </li>
    );
  };

  //   Format birthday and calculate age
  const birthdayString = () => {
    const date = formatDate(profile?.birthday);
    const age = calculateAge(profile?.birthday);
    return `${date} (Age ${age})`;
  };
  const isProfileEmpty = () => {
    return (
      !profile?.name &&
      !profile?.birthday &&
      !profile?.height &&
      !profile?.weight
    );
  };
  //   If no data render phrase to describe it empty
  if (isProfileEmpty()) {
    return renderEmpty();
  }
  //   Render data
  return (
    <div>
      <ul className="w-full">
        {renderItem('Birthday:', birthdayString())}
        {renderItem('Horoscope:', `${detectZodiac(profile?.birthday) || '-'}`)}
        {renderItem(
          'Zodiac:',
          `${detectChineseZodiac(profile?.birthday) || '-'}`
        )}
        {renderItem('Height:', `${profile?.height}cm`)}
        {renderItem('Weight:', `${profile?.weight}kg`)}
      </ul>
    </div>
  );
}
export default ProfileContent;
