import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import { addPlan } from '@/apis/scheduler/schedulerApi';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPlanList: () => void;
}

const postCodeStyle = {
  width: '200px',
  height: '30rem',
};

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
    height: '30rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 1500,
  },
};

export default function RegistPlan({
  isOpen,
  setIsOpen,
  fetchPlanList,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true); // Loading state for Skeleton UI
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [openDaum, setOpenDaum] = useState<boolean>(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const onCompletePost = (data: any) => {
    setAddress(data.address);
    setZipCode(data.zonecode);
    setOpenDaum(false);
  };

  const registPlan = async (
    planName: string,
    address: string,
    memo: string
  ) => {
    setLoading(true);
    await addPlan({
      planName: planName,
      address: address,
      sharedContents: memo,
    });
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={150}
        style={customModalStyles}
      >
        <p className="font-bold text-center text-zp-lg">
          계획 정보를 입력해주세요
        </p>
        <div className="flex flex-col w-full gap-2">
          <p className="text-zp-xs w-[2rem] font-bold">이름</p>
          {loading ? (
            <Skeleton width="100%" height="2rem" />
          ) : (
            <Input
              type="text"
              inputType="normal"
              placeholder="계획명을 입력해주세요."
              value={name}
              width="full"
              height={2}
              radius="btn"
              fontSize="xs"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName((e.target as HTMLInputElement).value);
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-zp-xs">주소 </p>
          <div className="flex w-full gap-4">
            {loading ? (
              <Skeleton width="7rem" height="2rem" />
            ) : (
              <Input
                type="text"
                inputType="normal"
                width={15}
                height={2}
                placeholder="우편번호"
                radius="btn"
                fontSize="xs"
                value={zipCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setZipCode((e.target as HTMLInputElement).value);
                }}
              />
            )}
            {loading ? (
              <Skeleton width="7rem" height="2rem" />
            ) : (
              <Button
                buttonType="primary"
                width={6.5}
                height={2}
                children="우편번호 찾기"
                radius="btn"
                fontSize="xs"
                onClick={() => setOpenDaum(true)}
              />
            )}
          </div>
          {loading ? (
            <Skeleton width="100%" height="2rem" />
          ) : (
            <Input
              type="text"
              inputType="normal"
              width="full"
              height={2}
              placeholder="기본 주소를 입력하세요."
              radius="btn"
              fontSize="xs"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddress((e.target as HTMLInputElement).value);
              }}
            />
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <p className="text-zp-xs w-[2rem] font-bold">메모</p>
          {loading ? (
            <Skeleton width="100%" height="2rem" />
          ) : (
            <Input
              type="text"
              inputType="normal"
              placeholder="공유 메모를 작성해주세요."
              width="full"
              height={2}
              radius="btn"
              fontSize="xs"
              value={memo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMemo((e.target as HTMLInputElement).value);
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-center w-full gap-6">
          {loading ? (
            <Skeleton width="4rem" height="2rem" />
          ) : (
            <>
              <Button
                buttonType="second"
                fontSize="xs"
                radius="btn"
                width={4}
                height={2}
                children="취소"
                onClick={closeModal}
              />
              <Button
                buttonType="primary"
                fontSize="xs"
                radius="btn"
                width={4}
                height={2}
                children="등록"
                onClick={() => {
                  registPlan(name, address, memo);
                  fetchPlanList();
                  closeModal();
                  navigate(0);
                }}
              />
            </>
          )}
        </div>
      </Modal>
      <Modal
        style={customModalStyles}
        isOpen={openDaum}
        onRequestClose={onCompletePost}
      >
        <DaumPostcode style={postCodeStyle} onComplete={onCompletePost} />
      </Modal>
    </>
  );
}
