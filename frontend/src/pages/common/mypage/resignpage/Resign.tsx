import { GoArrowLeft } from 'react-icons/go';
import { HiChevronRight } from 'react-icons/hi2';
import { PiWarningCircleBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

export default function Resign() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('mypage');
  };

  const handleNavigateToDontUseZIPPLZ = () => {
    navigate('/mypage/dontusezipplz');
  };

  const handleNavigateToRoughWorker = () => {
    navigate('/mypage/roughworker');
  };

  return (
    <>
      <div className="flex items-start justify-center min-h-screen p-6">
        <div className="w-full">
          <div className="relative flex items-center justify-between w-full mt-16">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
                size={20}
              />
            </div>
          </div>
          <div className="mt-6 font-bold text-zp-xl">
            회원 탈퇴 전 주의사항을 확인해주세요
          </div>

          <div className="mt-6 bg-zp-light-beige rounded-zp-radius-big">
            <div className="flex items-center">
              <div className="text-zp-gray">
                <PiWarningCircleBold />
              </div>
              <div className="pl-1 font-bold text-zp-sm text-zp-gray">
                주의사항
              </div>
            </div>

            <ul className="pl-5 mt-2 list-disc text-zp-sm">
              <li>계정 삭제 후 30일간 다시 가입하실 수 없습니다.</li>
              <li>진행 중인 시공요청건이 있을 경우 탈퇴가 불가능합니다.</li>
              <li>탈퇴 후 모든 데이터가 삭제되고 복구하실 수 없습니다.</li>
            </ul>
          </div>

          <div className="mt-6 font-bold text-zp-xl">
            회원을 탈퇴하고자 하는 이유를 알려주세요
          </div>
          <div className="flex items-center justify-between w-full mt-6">
            <div className="text-zp-xs">더 이상 ZIP-PlZ를 사용하지 않아요</div>
            <div>
              <HiChevronRight
                className="cursor-pointer"
                onClick={handleNavigateToDontUseZIPPLZ}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full mt-6">
            <div className="text-zp-xs">비매너 시공업자를 만났어요</div>
            <div>
              <HiChevronRight
                className="cursor-pointer"
                onClick={handleNavigateToRoughWorker}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
