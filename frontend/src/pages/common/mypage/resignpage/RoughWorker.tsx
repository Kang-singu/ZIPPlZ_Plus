import { useNavigate } from 'react-router-dom';

import ReviewIcon from '@assets/review-icon.svg';

export default function RoughWorker() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateBeforeResign = () => {
    navigate('/mypage/beforeresign');
  };

  return (
    <>
      <div className="flex flex-col min-h-screen p-6">
        <div className="flex-grow">
          <div className="mt-10 text-zp-2xl font-bold">
            해당 시공업자에 대한 평점을 남겨주세요
          </div>
          <div className="mt-6 text-zp-xs font-bold text-zp-gray">
            원치 않는 시공업자를 차단하는 기능도 제공하고 있어요
          </div>
          <div className="text-zp-xs font-bold text-zp-gray">
            높은 평점의 시공업자를 선택할 수도 있어요
          </div>
          <div className="mt-20 flex justify-center">
            <img
              src={ReviewIcon}
              alt="리뷰 작성 아이콘"
              width={150}
              height={150}
            />
          </div>
        </div>

        <div className="mb-16 flex justify-center space-x-4 mt-6 w-full">
          <button className="w-1/2" onClick={handleNavigateHome}>
            <div className="font-bold h-10 rounded-zp-radius-btn bg-zp-sub-color flex justify-center items-center cursor-pointer w-full">
              평가하러 가기
            </div>
          </button>
          <button className="w-1/2" onClick={handleNavigateBeforeResign}>
            <div className="font-bold h-10 rounded-zp-radius-btn bg-zp-sub-color flex justify-center items-center cursor-pointer w-full">
              탈퇴하기
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
