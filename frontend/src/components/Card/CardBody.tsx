import { ComponentPropsWithoutRef, createElement } from 'react';

import clsx from 'clsx';

type IProps = ComponentPropsWithoutRef<"div">;
function CardBody({ children, ..._props }: IProps) {
  return createElement(
    "div",
    {
      ..._props,
      className: clsx(["card-body", _props.className]),
    },
    children
  );
}

CardBody.displayName = "CardBody";

export default CardBody;
