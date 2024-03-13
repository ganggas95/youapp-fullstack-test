"use client";
import { ComponentPropsWithRef, createElement, forwardRef } from 'react';

import clsx from 'clsx';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import usePasswordToggler from '@/hooks/usePasswordToggler';

type IProps = ComponentPropsWithRef<"input"> & {
  showPasswordToggler?: boolean;
  inputRight?: boolean;
  outlined?: boolean;
  sm?: boolean;
  xs?: boolean;
  error?: string;
};
const Input = forwardRef(
  (
    {
      showPasswordToggler,
      className,
      inputRight,
      outlined,
      sm,
      xs,
      type,
      error,
      ..._props
    }: IProps,
    ref: any
  ) => {
    const {
      ref: inputRef,
      togglePassword,
      shown,
    } = usePasswordToggler(type, ref);

    const passwordToggler = () => {
      return createElement(
        "a",
        {
          onClick: togglePassword,
          className:
            "absolute cursor-pointer right-5 top-[28.9999%] text-black dark:text-white h-6 w-6",
        },
        shown ? <EyeIcon /> : <EyeSlashIcon />
      );
    };

    const inputElement = () => {
      return createElement("input", {
        ..._props,
        type,
        ref: inputRef,
        className: clsx({
          "input-main w-full": true,
          "input-right": inputRight,
          "input-main-sm": sm,
          "input-main-xs": xs,
          "input-main-outlined": outlined,
          "border-red-500 !border": error,
        }),
      });
    };
    return createElement(
      "div",
      { className: clsx("flex flex-col gap-y-2 w-full", className) },
      createElement(
        "div",
        {
          className: clsx(["w-full flex relative"]),
        },
        inputElement(),
        showPasswordToggler && passwordToggler()
      ),
      error &&
        createElement(
          "p",
          {
            className: clsx({
              "text-xs text-red-500": true,
              "text-right": inputRight,
            }),
          },
          error
        )
    );
  }
);
Input.displayName = "Input";
export default Input;
