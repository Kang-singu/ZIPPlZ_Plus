import { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute hidden px-2 py-1 mb-2 -left-[68px] text-zp-3xs rounded-zp-radius-bubble bg-zp-light-gray break-keep text-nowrap text-zp-white bottom-2 group-hover:block">
        {text}
      </div>
    </div>
  );
}
