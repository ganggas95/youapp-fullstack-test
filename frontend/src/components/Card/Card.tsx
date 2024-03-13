import { ComponentPropsWithoutRef, createElement } from 'react';

import clsx from 'clsx';

type IProps = ComponentPropsWithoutRef<"div">;
function Card({ children, ..._props }: IProps) {
  return createElement(
    "div",
    {
      ..._props,
      className: clsx(["card", _props.className]),
    },
    children
  );
}
export default Card;
