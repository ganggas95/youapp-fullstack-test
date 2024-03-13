import { ComponentPropsWithoutRef } from 'react';

type IProps = ComponentPropsWithoutRef<"svg"> & {
  name: string;
};

function ZodiacIcon({ name, className }: IProps) {
  // eslint-disable-next-line
  const Icon = require(`@/assets/zodiac/${name.toLowerCase()}.svg`).default;

  if (!Icon) return undefined;

  return <Icon className={className} />;
}
export default ZodiacIcon;
