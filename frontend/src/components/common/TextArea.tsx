import React from 'react';

interface Props {
  className?: string;
  placeholder: string;
  width?: number | string;
  height?: number | string;
  fontSize: 'md' | 'sm' | 'xs' | '2xs';
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const fontSizeClasses: Record<Props['fontSize'], string> = {
  md: 'text-zp-md',
  sm: 'text-zp-sm',
  xs: 'text-zp-xs',
  '2xs': 'text-zp-2xs',
};

export default function TextArea({
  className = '',
  placeholder,
  width = 'auto',
  height = 'auto',
  fontSize,
  value,
  name,
  onChange,
  onKeyDown,
}: Props) {
  const baseStyle = `flex justify-center items-center rounded-zp-radius-big ${fontSizeClasses[fontSize]} bg-zp-transparent resize-none p-3 bg-zp-white border border-zp-light-gray outline-none caret-zp-main-color placeholder-zp-main-color leading-4`;

  const widthStyle = typeof width === 'number' ? `${width}rem` : width;
  const heightStyle = typeof height === 'number' ? `${height}rem` : height;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, value } = target;

      if (selectionStart !== null && selectionEnd !== null) {
        target.value =
          value.substring(0, selectionStart) +
          '\n' +
          value.substring(selectionEnd);
        target.setSelectionRange(selectionStart + 1, selectionStart + 1);

        if (onChange) {
          onChange({
            ...e,
            target,
          } as React.ChangeEvent<HTMLTextAreaElement>);
        }
      }
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <textarea
      placeholder={placeholder}
      className={`${baseStyle} ${className}`}
      style={{
        width: width === 'full' ? '100%' : widthStyle,
        height: height === 'full' ? '100%' : heightStyle,
      }}
      value={value}
      name={name}
      onChange={onChange}
      onKeyDown={handleKeyDown}
    />
  );
}
