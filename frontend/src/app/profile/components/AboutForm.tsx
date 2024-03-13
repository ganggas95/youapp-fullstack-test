import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

import Input from '@/components/Input';
import { ProfileDto } from '@/interfaces/dto/profile.dto';
import {
  detectChineseZodiac,
  detectZodiac
} from '@/utils/zodiac-horoscope.utils';

import UploadImage from './UploadImage';

type IProps = {
  control: Control<ProfileDto, any>;
  birthday: string;
  photo?: Blob | null | string;
  onChangePhoto?: (photo: Blob) => void;
};

function AboutForm({
  control,
  birthday: birthday,
  onChangePhoto,
  photo,
}: IProps) {
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [zodiac, setZodiac] = useState<string | null>(null);

  const numberPattern = {
    pattern: {
      value: /^[0-9]+$/,
      message: 'This field must be a number',
    },
  };

  useEffect(() => {
    setHoroscope(detectZodiac(birthday));
    setZodiac(detectChineseZodiac(birthday));
  }, [birthday]);

  return (
    <div className="flex flex-col w-full">
      <UploadImage onChange={onChangePhoto} photo={photo} />
      <div className="grid grid-cols-3 gap-x-3 items-baseline gap-y-4 w-full">
        <label className="text-xs" htmlFor="name">
          Display Name:
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <Input
              className="col-span-2"
              xs
              outlined
              inputRight
              placeholder="Enter name"
              type="text"
              id="name"
              {...field}
              error={error?.message}
            />
          )}
        />
        <label className="text-xs" htmlFor="datebirth">
          Birthday:
        </label>
        <Controller
          name="birthday"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              className="col-span-2"
              xs
              outlined
              inputRight
              placeholder="DD MMM YYYY"
              type="date"
              id="datebirth"
              max={new Date().toISOString().split('T')[0]}
              {...field}
              error={error?.message}
            />
          )}
        />
        <label className="text-xs" htmlFor="horoscope">
          Horoscope:
        </label>
        <Input
          className="col-span-2"
          xs
          outlined
          inputRight
          name="horoscope"
          placeholder="--"
          value={horoscope || ''}
          disabled
          type="text"
          id="horoscope"
        />
        <label className="text-xs" htmlFor="zodiac">
          Zodiac:
        </label>
        <Input
          className="col-span-2"
          xs
          outlined
          inputRight
          name="zodiac"
          placeholder="--"
          type="text"
          value={zodiac || ''}
          disabled
          id="zodiac"
        />
        <label className="text-xs" htmlFor="height">
          Height:
        </label>
        <Controller
          name="height"
          rules={numberPattern}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              className="col-span-2"
              xs
              outlined
              inputRight
              placeholder="Add height"
              type="text"
              id="height"
              {...field}
              error={error?.message}
            />
          )}
        />
        <label className="text-xs" htmlFor="weight">
          Weight:
        </label>
        <Controller
          name="weight"
          control={control}
          rules={numberPattern}
          render={({ field, fieldState: { error } }) => (
            <Input
              className="col-span-2"
              xs
              outlined
              inputRight
              placeholder="Add weight"
              type="text"
              id="weight"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
}

export default AboutForm;
