import { TbMoodHappy } from 'react-icons/tb';

export default function LikeWorkers() {
  return (
    <>
      <div className="mt-12 font-bold text-zp-xs flex items-center space-x-2">
        <TbMoodHappy className="text-zp-main-color text-2xl" />
        <span>[시공업자 이름]님은 이래서 좋아요</span>
      </div>

      <div className="mt-2 bg-zp-white p-4 rounded-zp-radius-big mb-8">
        <div className="text-zp-2xs flex flex-col space-y-2">
          <div>응답이 빨라서 좋아요ㅎㅎ</div>
          <div>뒷정리가 깔끔합니다ㅎㅎ</div>
          <div>A/S가 좋아요ㅎㅎ</div>
        </div>
      </div>
    </>
  );
}
