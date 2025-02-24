import { TbMoodCry } from 'react-icons/tb';

export default function HateWorkers() {
  return (
    <>
      <div className="font-bold text-zp-xs flex items-center space-x-2">
        <TbMoodCry className="text-zp-main-color text-2xl" />
        <span>[시공업자 이름]님의 이런 모습이 고쳐졌으면 좋겠어요</span>
      </div>

      <div className="mt-2 bg-zp-white p-4 rounded-zp-radius-big mb-8">
        <div className="text-zp-2xs flex flex-col space-y-2">
          <div>뒷정리가 하나도 안돼요...</div>
          <div>담배냄새가 너무 납니다...</div>
          <div>답장이 느려요...</div>
        </div>
      </div>
    </>
  );
}
