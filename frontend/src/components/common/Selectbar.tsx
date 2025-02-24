import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

interface Props {
  backgroundColor: string;
  fontColor: string;
  options: string[];
  selectedValue: string;
  setSelectedValue: (option: string) => void;
  width?: string | number;
  height?: string | number;
  fontSize: string;
  radius: string;
  border: string;
  hover: string;
  status?: number[];

  onClick?: () => void;
}
const bgClasses: Record<Props['backgroundColor'], string> = {
  main: 'bg-zp-main-color',
  sub: 'bg-zp-sub-color',
  black: 'bg-zp-black',
  white: 'bg-zp-white',
  gray: 'bg-zp-gray',
  red: 'bg-zp-red',
  yellow: 'bg-zp-yellow',
  'light-gray': 'bg-zp-light-gray',
  'slight-white': 'bg-zp-slight-white',
  'light-beige': 'bg-zp-light-beige',
  'light-yellow': 'bg-zp-light-yellow',
  'light-orange': 'bg-zp-light-orange',
  transparent: 'bg-zp-transparent',
  none: 'bg-none',
};
const fontClasses: Record<Props['fontColor'], string> = {
  main: 'text-zp-main-color',
  sub: 'text-zp-sub-color',
  black: 'text-zp-black',
  white: 'text-zp-white',
  gray: 'text-zp-gray',
  red: 'text-zp-red',
  yellow: 'text-zp-yellow',
  'light-gray': 'text-zp-light-gray',
  'slight-white': 'text-zp-slight-white',
  'light-beige': 'text-zp-light-beige',
  'light-yellow': 'text-zp-light-yellow',
  'light-orange': 'text-zp-light-orange',
  transparent: 'text-zp-transparent',
  none: 'text-none',
};
const borderClasses: Record<Props['border'], string> = {
  main: 'border-zp-main-color',
  sub: 'border-zp-sub-color',
  black: 'border-zp-black',
  white: 'border-zp-white',
  gray: 'border-zp-gray',
  red: 'border-zp-red',
  yellow: 'border-zp-yellow',
  'light-gray': 'border-zp-light-gray',
  'slight-white': 'border-zp-slight-white',
  'light-beige': 'border-zp-light-beige',
  'light-yellow': 'border-zp-light-yellow',
  'light-orange': 'border-zp-light-orange',
  transparent: 'border-zp-transparent',
  none: 'border-none',
};
const hoverClasses: Record<Props['hover'], string> = {
  main: 'hover:bg-zp-main-color',
  sub: 'hover:bg-zp-sub-color',
  black: 'hover:bg-zp-black',
  white: 'hover:bg-zp-white',
  gray: 'hover:bg-zp-gray',
  red: 'hover:bg-zp-red',
  yellow: 'hover:bg-zp-yellow',
  'light-gray': 'hover:bg-zp-light-gray',
  'slight-white': 'hover:bg-zp-slight-white',
  'light-beige': 'hover:bg-zp-light-beige',
  'light-yellow': 'hover:bg-zp-light-yellow',
  'light-orange': 'hover:bg-zp-light-orange',
  transparent: 'hover:bg-zp-transparent',
};
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
};
export default function Selectbar({
  backgroundColor,
  fontColor,
  options,
  selectedValue,
  setSelectedValue,
  width,
  height,
  fontSize,
  radius,
  border,
  hover,
  onClick,
  status,
}: Props) {
  const [isShowOptions, setIsShowOptions] = useState<boolean>(false);
  const handleClickOptions = function () {
    setIsShowOptions(!isShowOptions);
  };
  const handleOptionClick = function (option: string) {
    setSelectedValue(option);
    setIsShowOptions(false);
    onClick;
  };
  const Select: string = `relative border select-none ${borderClasses[border]} outline-none ${radiusClasses[radius]} pt-1 px-1 ${bgClasses[backgroundColor]} ${fontClasses[fontColor]}`;
  const Selected: string = `flex justify-between items-center px-[1rem] cursor-pointer font-bold`;
  const SelectedValue: string = `${fontSizeClasses[fontSize]} bg-white`;
  const Options: string = `border ${borderClasses[border]} list-none  outline-none  absolute mt-2 left-0  z-[10]  ${bgClasses[backgroundColor]}`;
  const Option: string = `flex items-center px-[1rem] py-[0.5rem] w-full ${radiusClasses[radius]} cursor-pointer ${hoverClasses[hover]} font-bold z-[100] ${fontClasses[fontColor]}`;
  const nonActive: string = `flex items-center w-full px-[1rem] py-[0.5rem] w-full  cursor-pointer bg-zp-light-gray font-bold z-[100] ${fontClasses[fontColor]}`;

  const widthClass = width === 'full' ? 'w-full' : '';
  const heightClass = height === 'full' ? 'h-full' : '';
  const widthStyle = typeof width === 'number' ? `${width}rem` : width;
  const heightStyle = typeof height === 'number' ? `${height}rem` : height;
  return (
    <div
      className={`${Select} ${widthClass} ${heightClass}`}
      style={{
        width: width === 'full' ? '100%' : widthStyle,
        height: height === 'full' ? '100%' : heightStyle,
      }}
    >
      <div className={`${Selected}`} onClick={handleClickOptions}>
        <div className={`${SelectedValue}`}>{selectedValue}</div>
        {isShowOptions ? (
          <FaChevronUp size={16} className="absolute right-[1rem]" />
        ) : (
          <FaChevronDown size={16} className="absolute right-[1rem]" />
        )}
      </div>
      {isShowOptions && (
        <ul
          className={`${Options} ${widthClass} mt-4 rounded-zp-radius-btn`}
          style={{
            width: width === 'full' ? '100%' : widthStyle,
          }}
        >
          {options.map((option, index) => (
            <li
              className={` ${status ? (status[index] === 1 ? Option : nonActive) : Option}  ${widthClass} ${heightClass} text-zp-2xs rounded-zp-radius-btn`}
              key={index}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
