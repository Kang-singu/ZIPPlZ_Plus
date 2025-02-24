import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import Button from '@/components/common/Button';
import { Worker, checkBusiness } from '@apis/member/MemberApi';
import Input from '@components/common/Input';

// import RegistrationInput from '@components/signup/RegistrationInput';

interface Props {
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  setWorker: React.Dispatch<React.SetStateAction<Worker>>;
  phrase: string;
  worker: Worker;
}
interface Data {
  b_no: string[];
}
const customModalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  content: {
    maxWidth: '468px',
    minWidth: '350px',
    maxHeight: '300px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1500,
  },
};
Modal.setAppElement('#root');
export default function SignupWorkerDetail({
  setNext,
  setLink,
  setWorker,
  // worker,
  phrase,
}: Props) {
  const [isOk, setIsOk] = useState<boolean>(false);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const openModal = function () {
    setModalIsOpen(true);
  };
  const closeModal = function () {
    setModalIsOpen(false);
  };
  const [groupName, setGroupName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const checkBusinessNumber = async (data: string) => {
    const inputData: Data = {
      b_no: [data],
    };
    const response = await checkBusiness(JSON.stringify(inputData));
    if ('match_cnt' in response.data) {
      setIsOk(true);
    } else {
      setIsOk(false);
    }
  };
  useEffect(() => {
    if (phrase === 'detail') setLink('/member/join/worker/3/region');
    else setLink('/member/join/worker/3/extraregion');
    setNext(true);
  }, []);
  return (
    <>
      <div className="relative flex flex-col w-full gap-4 p-4 bg-zp-white">
        <p className="font-bold text-zp-lg">사업자등록번호</p>
        <div className="flex">
          <Input
            type="text"
            inputType="signup"
            value={registrationNumber}
            onChange={(e: React.ChangeEvent) => {
              setRegistrationNumber((e.target as HTMLInputElement).value);
            }}
            placeholder="10자리를 입력해주세요"
            width="55%"
            height={2}
            fontSize="xl"
            radius="none"
          />
          <Button
            buttonType="second"
            children="인증하기"
            width={4}
            height={2}
            fontSize="xs"
            radius="btn"
            onClick={() => {
              checkBusinessNumber(registrationNumber);
              openModal();
            }}
          />
        </div>

        <p className="font-bold text-zp-lg">소속업체명</p>

        <Input
          type="text"
          inputType="signup"
          placeholder="업체을 입력하세요"
          width="full"
          height={2}
          value={groupName}
          onChange={(e: React.ChangeEvent) => {
            setGroupName((e.target as HTMLInputElement).value);
            setWorker((prev: Worker) => ({
              ...prev,
              company: (e.target as HTMLInputElement).value,
            }));
          }}
          fontSize="xl"
          className="p-1"
          radius="none"
        />

        <p className="font-bold text-zp-lg">소속업체 주소</p>

        <Input
          type="text"
          inputType="signup"
          placeholder="업체 주소를 입력하세요"
          width="full"
          height={2}
          value={address}
          onChange={(e: React.ChangeEvent) => {
            setAddress((e.target as HTMLInputElement).value);
            setWorker((prev: Worker) => ({
              ...prev,
              companyAddress: (e.target as HTMLInputElement).value,
            }));
          }}
          fontSize="xl"
          className="p-1"
          radius="none"
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <p className="absolute top-[1rem] left-0 text-zp-2xl font-bold w-full text-center">
          인증 결과
        </p>
        <div className="w-full flex flex-col mt-[4rem] items-center gap-6">
          <p className="font-bold text-center text-zp-xl">
            {isOk ? '인증이 완료되었습니다.' : '번호가 올바르지 않습니다.'}
          </p>
          <Button
            buttonType="second"
            children="확인"
            width={8}
            height={3}
            fontSize="xl"
            radius="big"
            onClick={() => {
              closeModal();
              setRegistrationNumber('');
              if (isOk) {
                setWorker((prev: Worker) => ({
                  ...prev,
                  businessNumber: registrationNumber,
                }));
              }
            }}
          />
        </div>
      </Modal>
    </>
  );
}
