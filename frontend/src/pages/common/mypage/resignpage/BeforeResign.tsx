import { useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function BeforeResign() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleResign = () => {
    localStorage.removeItem('token');
    navigate('/');
    setShowModal(true);
  };

  const handleConfirm = () => {
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col min-h-screen p-6">
        <div className="flex-grow w-full max-w-3xl">
          <div className="flex items-center">
            <GoArrowLeft
              className="mr-6 cursor-pointer"
              onClick={handleGoBack}
              style={{ width: '27px', height: '20px' }}
            />
          </div>
          <div className="mt-6 w-[400px] h-24">
            <div className="font-bold text-zp-3xl">
              탈퇴하기 전에 확인해주세요!
            </div>
          </div>

          <div className="p-4 font-bold bg-zp-light-beige rounded-zp-radius-big text-zp-xs">
            <div className="flex items-center space-x-2 text-zp-gray">
              <IoAlertCircleOutline />
              <div>주의사항</div>
            </div>
            <ul className="mt-2 list-disc list-inside">
              <li>계정 삭제 후 30일간 다시 가입하실 수 없습니다.</li>
              <li>진행 중인 시공요청건이 있을 경우 탈퇴가 불가능합니다.</li>
              <li>탈퇴 후 모든 데이터가 삭제되고 복구하실 수 없습니다.</li>
            </ul>
          </div>
        </div>

        <div
          className="flex items-center justify-center w-full h-12 mt-auto mb-16 cursor-pointer rounded-zp-radius-btn bg-zp-sub-color"
          onClick={handleResign}
        >
          <div className="font-bold text-zp-2xl">탈퇴하기</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 font-bold text-zp-3xl">탈퇴 완료</h2>
            <p className="mt-12 font-bold text-zp-sm">
              ZIP-PlZ를 이용해주시고 사랑해주셔서 감사합니다.
              <br />
              더욱더 노력하고 발전하는 ZIP-PlZ가 되겠습니다.
            </p>
            <button
              className="w-full h-10 mt-12 font-bold text-zp-xs bg-zp-sub-color rounded-zp-radius-btn"
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
