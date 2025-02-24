import { FaRegCalendarAlt } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { GrUserWorker } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

import AiInteriorIcon from '@assets/ai-interior-icon.svg';

export default function DontUseZIPPLZ() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('-1');
  };

  const handleNavigateToPage = () => {
    navigate('/image-change/:userSerial');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleResign = () => {
    navigate('/mypage/beforeresign');
  };

  return (
    <>
      <div className="flex flex-col min-h-screen p-6 bg-gray-100">
        <div className="w-full">
          <div className="flex items-center mt-8">
            <GoArrowLeft
              className="mr-6 cursor-pointer"
              onClick={handleGoBack}
              size={20}
            />
          </div>

          <div className="w-full mt-6">
            <div className="font-bold text-zp-2xl">이런 기능도 써보셨나요?</div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mt-6 mb-6">
                <img
                  src={AiInteriorIcon}
                  alt="AI 인테리어 아이콘"
                  width={100}
                  height={100}
                />
              </div>
              <div className="h-2 mb-4 font-bold text-zp-xl">
                편리하게 10분만에
              </div>
              <div className="h-10 mb-2 font-bold text-zp-2xl">AI 인테리어</div>
              <button onClick={handleNavigateToPage} className="w-full">
                <div className="flex items-center justify-center w-full h-10 font-bold cursor-pointer text-zp-xl bg-zp-sub-color rounded-zp-radius-btn">
                  이용하기
                </div>
              </button>
            </div>
          </div>

          <hr className="w-full mt-6 border-zp-main-color" />

          <div className="flex mt-6 items">
            <div>
              <FaRegCalendarAlt size={36} />
            </div>
            <div className="relative h-5 p-2 font-bold bottom-1 text-zp-xs">
              캘린더
              <div className="font-bold text-zp-gray text-zp-xs">
                나만의 인테리어 일정 세우기
              </div>
            </div>
          </div>

          <div className="flex mt-6 items">
            <div>
              <GrUserWorker size={36} />
            </div>
            <div className="relative h-5 p-2 font-bold bottom-1 text-zp-xs">
              시공자 검색
              <div className="font-bold text-zp-gray text-zp-xs">
                공종별 최고의 시공 전문가와 함께 인테리어 하기
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={handleHome} className="w-1/2">
            <div className="flex items-center justify-center h-10 mt-6 font-bold cursor-pointer rounded-zp-radius-btn bg-zp-sub-color">
              홈으로
            </div>
          </button>
          <button onClick={handleResign} className="w-1/2">
            <div className="flex items-center justify-center h-10 mt-6 font-bold cursor-pointer rounded-zp-radius-btn bg-zp-sub-color">
              넘어가기
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
