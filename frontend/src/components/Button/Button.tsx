import { ComponentPropsWithRef, createElement } from 'react';

import clsx from 'clsx';

type IProps = ComponentPropsWithRef<'button' | 'a'> & {
  label?: string;
  block?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  as?: 'button' | 'a';
};
function Button({
  label,
  block,
  sm,
  md,
  lg,
  as,
  className,
  children,
  ..._props
}: IProps) {
  return createElement(
    as || 'button',
    {
      ..._props,
      className: clsx({
        ['btn-main']: true,
        'w-full': block,
        'btn-main-sm': sm,
        'btn-main-md': md,
        'btn-main-lg': lg,
        [className || '']: true,
      }),
    },
    children || label
  );
}

export default Button;
