import { ComponentPropsWithoutRef, createElement } from 'react';

import clsx from 'clsx';

import { XMarkIcon } from '@heroicons/react/24/outline';

type IProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
  prefixElement?: (() => React.ReactNode) | React.ReactNode | null | undefined;
  suffixElement?: (() => React.ReactNode) | React.ReactNode | null | undefined;
};
function Tag({
  label,
  removable,
  onRemove,
  className,
  prefixElement,
  suffixElement,
  ..._props
}: IProps) {
  return createElement(
    "div",
    { className: clsx("tag", className), ..._props },
    typeof prefixElement === "function" ? prefixElement() : prefixElement,
    label,
    typeof suffixElement === "function" ? suffixElement() : suffixElement,
    removable &&
      createElement(
        "a",
        {
          className: "tag-remove-button",
          onClick: onRemove,
        },
        <XMarkIcon className="w-4 h-4" />
      )
  );
}
export default Tag;
