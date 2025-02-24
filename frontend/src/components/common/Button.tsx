import React from 'react';

interface Props {
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children: string | React.ReactNode;
  buttonType: 'normal' | 'light' | 'second' | 'primary';
  width?: number | string;
  height?: number | string;
  fontSize: string;
  radius: string;
  onClick?: () => void;
  disabled?: boolean;
  fontFamily?: string;
}
const fontSizeClasses: Record<Props['fontSize'], string> = {
  '3xl': 'text-zp-3xl',
  '2xl': 'text-zp-2xl',
  xl: 'text-zp-xl',
  lg: 'text-zp-lg',
  md: 'text-zp-md',
  sm: 'text-zp-sm',
  xs: 'text-zp-xs',
  '2xs': 'text-zp-2xs',
};

const radiusClasses: Record<Props['radius'], string> = {
  big: 'rounded-zp-radius-big',
  btn: 'rounded-zp-radius-btn',
  full: 'rounded-zp-radius-full',
  none: 'rounded-none',
};
export default function Button({
  type,
  children,
  buttonType,
  width,
  height,
  fontSize,
  radius,
  disabled,
  onClick,
  fontFamily,
}: Props) {
  const baseStyles = `flex justify-center items-center ${fontSizeClasses[fontSize]} ${radiusClasses[radius]} ${
    disabled ? 'cursor-not-allowed' : ''
  }`;
  let typeStyles = '';

  switch (buttonType) {
    case 'primary':
      typeStyles = 'bg-zp-main-color text-zp-white';
      break;
    case 'second':
      typeStyles = 'bg-zp-sub-color text-zp-black';
      break;
    case 'light':
      typeStyles = 'bg-zp-light-beige text-zp-black';
      break;
    default:
      typeStyles = 'bg-zp-white text-zp-black border border-zp-main-color';
      break;
  }
  const widthClass = width === 'full' ? 'w-full' : '';
  const heightClass = height === 'full' ? 'h-full' : '';
  const widthStyle = typeof width === 'number' ? `${width}rem` : width;
  const heightStyle = typeof height === 'number' ? `${height}rem` : height;
  return (
    <button
      type={type}
      className={`${baseStyles} ${typeStyles} ${widthClass} ${heightClass} font-${fontFamily}`}
      style={{
        width: width === 'full' ? '100%' : widthStyle,
        height: height === 'full' ? '100%' : heightStyle,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
