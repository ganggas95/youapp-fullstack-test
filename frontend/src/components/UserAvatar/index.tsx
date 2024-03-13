import { ComponentPropsWithoutRef } from 'react';

/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';

type IProps = ComponentPropsWithoutRef<'img'> & {
  api?: string;
  size?: number;
  username: string;
  url?: string;
};
function UserAvatar({
  api = 'beam',
  size = 40,
  username,
  url,
  ...props
}: IProps) {
  const generateUrl = (): string => {
    return `https://source.boringavatars.com/${api}/${size}/${username.replace(
      /[^a-z0-9]+/i,
      '-'
    )}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
  };
  if (url) {
    return (
      <div
        className={clsx('w-[40px] h-[40px] rounded-full', props.className)}
        style={{
          backgroundImage: `url(${url})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></div>
    );
  }
  return (
    <img
      src={generateUrl()}
      alt={username}
      {...props}
      width={size}
      height={size}
    />
  );
}
export default UserAvatar;
