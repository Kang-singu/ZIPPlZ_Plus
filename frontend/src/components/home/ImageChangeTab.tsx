import { FaPlus } from 'react-icons/fa';

import BgIcon from '@assets/ai-bg-icon.svg?react';
import MaterialIcon from '@assets/ai-material-icon.svg?react';

interface Props {
  onClick: () => void;
}

export default function ImageChangeTab({ onClick }: Props) {
  return (
    <>
      <div
        className="relative w-full h-[4rem] rounded-zp-radius-big flex items-center gap-1 bg-zp-white cursor-pointer drop-shadow-zp-slight hover:text-zp-black"
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center pb-3">
            <MaterialIcon width={60} height={38} />
            <FaPlus />
            <BgIcon width={50} height={38} />
          </div>
          <small className="absolute bottom-1 text-zp-2xs text-zp-light-gray break-keep">
            이곳에 변환할 이미지를 넣어주세요.
          </small>
        </div>
      </div>
    </>
  );
}
