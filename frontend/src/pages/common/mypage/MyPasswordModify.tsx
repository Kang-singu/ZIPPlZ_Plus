import { useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { PiEyeLight, PiEyeSlash } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import { useMyPageStore } from '@stores/myPageStore';

interface ErrorState {
  current: boolean;
  new: boolean;
  confirm: boolean;
  emptyFields: boolean;
}

export default function MyPasswordModify() {
  const navigate = useNavigate();
  const { changePassword } = useMyPageStore();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<ErrorState>({
    current: false,
    new: false,
    confirm: false,
    emptyFields: false,
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setError({
      current: false,
      new: false,
      confirm: false,
      emptyFields: false,
    });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError((prev) => ({
        ...prev,
        emptyFields: true,
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        new: true,
        confirm: true,
      }));
      return;
    }

    try {
      const response = await changePassword(currentPassword, newPassword);

      if (response.success) {
        setShowModal(true);
      } else {
        setError((prev) => ({
          ...prev,
          current: true,
        }));
      }
    } catch (error) {
      console.error('Error during password change:', error);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate('/member/login');
  };

  return (
    <>
      <div className="flex items-start justify-center min-h-screen p-6">
        <div className="w-full">
          <div className="relative flex items-center justify-between w-full h-12 mt-12">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
                size={20}
              />
            </div>
            <div className="absolute font-bold text-center transform -translate-x-1/2 left-1/2 text-zp-2xl">
              비밀번호 변경
            </div>
          </div>

          <div className="mt-6 font-bold text-zp-xl">기존 비밀번호</div>
          <div className="relative w-full">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요."
              className="w-full px-2 mt-4 font-bold border-none text-zp-xl text-zp-black bg-zp-light-beige focus:outline-none"
              value={currentPassword}
              onChange={handlePasswordChange}
            />
            {showCurrentPassword ? (
              <PiEyeLight
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowCurrentPassword(false)}
              />
            ) : (
              <PiEyeSlash
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowCurrentPassword(true)}
              />
            )}
          </div>
          <hr
            className={`mt-2 w-full ${
              error.current && currentPassword
                ? 'border-zp-red'
                : 'border-zp-light-gray'
            }`}
          />
          {error.current && currentPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              현재 비밀번호와 다릅니다. 다시 입력해주세요
            </div>
          )}
          {error.emptyFields && !currentPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              값이 입력되지 않았습니다. 입력해주세요
            </div>
          )}

          <div className="mt-6 font-bold text-zp-xl">새 비밀번호</div>
          <div className="relative w-full">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="새 비밀번호를 입력하세요."
              className="w-full px-2 mt-4 font-bold border-none text-zp-xl text-zp-black bg-zp-light-beige focus:outline-none"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {showNewPassword ? (
              <PiEyeLight
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowNewPassword(false)}
              />
            ) : (
              <PiEyeSlash
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowNewPassword(true)}
              />
            )}
          </div>
          <hr
            className={`mt-2 w-full ${
              (error.new || error.confirm) && newPassword && confirmPassword
                ? 'border-zp-red'
                : 'border-zp-light-gray'
            }`}
          />
          {error.new && newPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              입력한 비밀번호가 서로 다릅니다. 변경할 Password를 다시
              확인해주세요
            </div>
          )}
          {error.emptyFields && !newPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              값이 입력되지 않았습니다. 입력해주세요
            </div>
          )}

          <div className="mt-6 font-bold text-zp-xl">새 비밀번호 확인</div>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="새 비밀번호를 다시 입력하세요."
              className="w-full px-2 mt-4 font-bold border-none text-zp-xl text-zp-black bg-zp-light-beige focus:outline-none"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {showConfirmPassword ? (
              <PiEyeLight
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <PiEyeSlash
                className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>
          <hr
            className={`mt-2 w-full ${
              error.confirm && confirmPassword
                ? 'border-zp-red'
                : 'border-zp-light-gray'
            }`}
          />
          {error.confirm && confirmPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              입력한 비밀번호가 서로 다릅니다. 변경할 Password를 다시
              확인해주세요
            </div>
          )}
          {error.emptyFields && !confirmPassword && (
            <div className="mt-2 font-bold text-zp-xs text-zp-red">
              값이 입력되지 않았습니다. 입력해주세요
            </div>
          )}

          <button
            className="flex items-center justify-center w-full h-10 mt-6 font-bold bg-zp-sub-color rounded-zp-radius-btn text-zp-xl"
            onClick={handleSubmit}
          >
            변경
          </button>
        </div>
      </div>

      {/* 모달 창 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-zp-black">
          <div className="p-6 bg-zp-white rounded-zp-radius-big">
            <h2 className="mb-4 font-bold text-center text-zp-2xl">
              비밀번호 변경 성공
            </h2>
            <p className="mb-6 text-center text-zp-lg">
              비밀번호가 변경되었습니다. 다시 로그인 해주세요.
            </p>
            <button
              className="flex items-center justify-center w-full h-10 font-bold bg-zp-sub-color rounded-zp-radius-btn text-zp-xl"
              onClick={handleModalConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
