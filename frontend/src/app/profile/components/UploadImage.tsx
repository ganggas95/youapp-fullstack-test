import { useEffect, useRef, useState } from 'react';

import { PlusIcon } from '@heroicons/react/24/outline';

type IProps = {
  photo?: Blob | null | string;
  onChange?: (photo: Blob) => void;
};
function UploadImage({ photo: photoValue, onChange }: IProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const onChangePhoto = () => {
    const file = ref.current?.files![0] as Blob;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (onChange) onChange(file);
      setPhoto(reader.result as string);
    };
  };
  const generateStyle = () => {
    if (!photo) return {};
    return {
      backgroundImage: `url(${photo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };
  useEffect(() => {
    if (photoValue && typeof photoValue === 'string') {
      setPhoto(photoValue);
    }
  }, [photoValue]);
  return (
    <>
      <div className="flex gap-x-4 items-center mt-3 mb-8">
        <a
          className="w-[57px] h-[57px] p-3 rounded-[17px] bg-gray-700/90 cursor-pointer hover:bg-gray-700/100"
          onClick={() => ref.current?.click()}
          style={generateStyle()}
        >
          {photo ? null : <PlusIcon />}
        </a>
        <span>Add image</span>
      </div>
      <input
        type="file"
        className="hidden"
        ref={ref}
        accept="image/*"
        onChange={onChangePhoto}
      />
    </>
  );
}

export default UploadImage;
