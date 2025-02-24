import { TbBuildingCommunity } from 'react-icons/tb';

export default function CareerAndCertificate() {
  return (
    <>
      <div className="mt-6 w-full h-6 font-bold text-zp-xs flex justify-start space-x-1">
        <div>
          <TbBuildingCommunity />
        </div>
        <div>소속업체</div>
      </div>
      <div className="relative w-full bg-zp-white p-4 rounded-zp-radius-big">
        <div className="text-zp-2xs flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-20">업체이름</div>
            <div className="border-l border-black h-full mx-2"></div>
            <div className="flex-grow text-zp-gray">멀티캠퍼스</div>
          </div>
          <div className="flex items-center">
            <div className="w-20">주소</div>
            <div className="border-l border-black h-full mx-2"></div>
            <div className="flex-grow text-zp-gray">역삼 멀티캠퍼스</div>
          </div>
          <div className="flex items-center">
            <div className="w-20">사업자 등록번호</div>
            <div className="border-l border-black h-full mx-2"></div>
            <div className="flex-grow text-zp-gray">123-4567</div>
          </div>
        </div>
      </div>
    </>
  );
}
