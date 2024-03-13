"use client";
import { useRouter } from 'next/navigation';
import React, { ComponentPropsWithRef } from 'react';

import clsx from 'clsx';

import { ChevronLeftIcon } from '@heroicons/react/24/solid';

type IProps = ComponentPropsWithRef<"div"> & {
  title?: string;
  renderAction?: (() => JSX.Element) | React.ReactNode;
};

function PageHeader({ className, ..._props }: IProps) {
  const navigation = useRouter();
  return (
    <div className={clsx("page-header p-4", className)}>
      <a className="back-button" onClick={() => navigation.back()}>
        <ChevronLeftIcon />
        <span>Back</span>
      </a>
      {_props.title ? (
        <span className="text-center">{_props.title}</span>
      ) : (
        _props.children
      )}
      {_props.renderAction && typeof _props.renderAction === "function"
        ? _props.renderAction()
        : _props.renderAction}
    </div>
  );
}

export default PageHeader;
