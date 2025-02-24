import { GoArrowLeft } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

export default function Version() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/mypage');
  };
  return (
    <>
      <div className="flex items-start justify-center min-h-screen p-6">
        <div className="w-full">
          <div className="relative flex items-center justify-between w-full h-12 mt-10">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
                size={20}
              />
            </div>
            <div className="absolute font-bold text-center transform -translate-x-1/2 left-1/2 text-zp-2xl">
              버전
            </div>
          </div>

          <div className="mt-12 font-bold text-zp-xs text-zp-gray">버전</div>

          <div className="w-full mt-2 text-zp-xs bg-zp-sub-color rounded-zp-radius-big">
            <div className="p-6">
              <div className="font-bold">V 1.1.0</div>
              <div className="mt-2">
                이 업데이트는 중요한 버그 수정을 포함하며, 드물게 데이터베이스
                오염 문제가 발생한 사진이 사진 보관함에서 삭제된 후 다시 표시될
                수 있는 문제를 해결합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
