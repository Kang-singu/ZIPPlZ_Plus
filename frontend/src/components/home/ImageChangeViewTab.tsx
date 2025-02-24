import CombinationIcon from '@assets/ai-combination-icon.svg?react';

interface Props {
  onClick: () => void;
}

export default function ImageChangeViewTab({ onClick }: Props) {
  return (
    <>
      <div
        className="relative w-full h-[4rem] rounded-zp-radius-big flex items-center  gap-1 bg-zp-white cursor-pointer drop-shadow-zp-slight"
        onClick={onClick}
      >
        <div className="flex self-start justify-center w-full">
          <CombinationIcon width={70} height={50} />
          <small className="absolute bottom-1 text-zp-2xs text-zp-light-gray break-keep">
            변환이 완료된 이미지를 확안하세요.
          </small>
        </div>
      </div>
    </>
  );
}
