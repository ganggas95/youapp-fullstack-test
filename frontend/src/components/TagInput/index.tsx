"use client";
import {
  ComponentPropsWithRef,
  createElement,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react';

import clsx from 'clsx';

import Tag from '../Tag';

type IProps = ComponentPropsWithRef<"input"> & {
  sm?: boolean;
  xs?: boolean;
  removable?: boolean;
  value?: string[];
  onChangeValue?: (value: string[]) => void;
};

const TagInput = forwardRef(function Ref(
  { sm, xs, removable, value: tagValue, onChangeValue }: IProps,
  ref: any
) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const innerRef = useRef<HTMLInputElement | null>(null);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value) {
        if (tagValue && onChangeValue) {
          onChangeValue([...tagValue, value]);
        } else {
          setTags([...tags, value]);
        }
        setValue("");
      }
    }
  };
  const renderInput = () => {
    return createElement("input", {
      className: "tag-input-controller",
      type: "text",
      ref: innerRef,
      value,
      style: {
        width: `${value.length + 4}ch`,
      },
      onChange: (e: any) => setValue(e.target.value),
      onKeyDown: onKeyDown,
    });
  };

  const removeTag = (index: number) => {
    const newTags = tagValue
      ? tagValue.filter((_, i) => i !== index)
      : tags.filter((_, i) => i !== index);
    onChangeValue ? onChangeValue(newTags) : setTags(newTags);
  };

  useEffect(() => {
    if (ref) {
      ref.current = innerRef.current;
    }
  }, [ref]);
  return createElement(
    "div",
    {
      className: clsx({
        "input-main w-full tag-input": true,
        "input-main-sm": sm,
        "input-main-xs": xs,
      }),
      onClick: () => {
        innerRef.current?.focus();
      },
    },
    (tagValue || tags).map((tag, index) => (
      <Tag
        key={tag}
        label={tag}
        removable={removable}
        onRemove={() => removeTag(index)}
      />
    )),
    renderInput()
  );
});

export default TagInput;
