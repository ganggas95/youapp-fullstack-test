import { ComponentPropsWithoutRef, createElement } from 'react';

import clsx from 'clsx';

type IProps = ComponentPropsWithoutRef<"div"> & {
  label?: string;
  layout?: "horizontal" | "vertical";
};

function InputField({
  children,
  className = "",
  label = "",
  layout = "vertical",
  ..._props
}: IProps) {
  return createElement(
    "div",
    {
      ..._props,
      className: clsx([
        "input-field",
        {
          "input-field-horizontal": layout === "horizontal",
          "input-field-vertical": layout === "vertical",
        },
        className,
      ]),
    },
    createElement("label", {}, label),
    children
  );
}
export default InputField;
