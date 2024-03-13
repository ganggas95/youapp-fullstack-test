import { ComponentPropsWithoutRef, createElement } from 'react';

import clsx from 'clsx';

import { shallow } from '@/utils/shallow.utils';

type IProps = ComponentPropsWithoutRef<"div"> & {
  label?: string;
  actionComponent?: (() => JSX.Element) | React.ReactNode;
};
function CardHeader({ children, ..._props }: IProps) {
  return createElement(
    "div",
    {
      ...shallow({
        source: _props,
        fields: Object.keys(_props),
        exceptFields: ["label", "actionComponent"],
      }),
      className: clsx(["card-header", _props.className]),
    },
    _props.label || children,
    _props.actionComponent && typeof _props.actionComponent === "function"
      ? _props.actionComponent()
      : _props.actionComponent
  );
}

CardHeader.displayName = "CardHeader";

export default CardHeader;
