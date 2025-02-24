import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { modifyPlan } from '@apis/scheduler/schedulerApi';

interface Props {
  isOpen: boolean;
  plan: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPlan: (planSerial: number) => void;
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
    height: '23rem',
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

export default function UpdatePlan({
  isOpen,
  setIsOpen,
  plan,
  fetchPlan,
}: Props) {
  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const [newName, setNewName] = useState<string>(plan.planName);
  const [memo, setMemo] = useState<string>(plan.sharedContents || '');
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const updatePlan = async (
    planName: string,
    address: string,
    memo: string
  ) => {
    setLoading(true);
    if (plan.planSerial > 0) {
      await modifyPlan(plan.planSerial, {
        planName: planName,
        address: address,
        sharedContents: memo,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      fetchPlan(plan.planSerial);
      setIsUpdate(false);
    }
  }, [isUpdate]);

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
              width="full"
              height={2}
              radius="btn"
              fontSize="xs"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewName((e.target as HTMLInputElement).value);
              }}
              value={newName}
            />
          )}
        </div>
        <div>
          <p className="text-zp-xs w-[2rem] font-bold">주소</p>
          {loading ? (
            <Skeleton width="100%" height="2rem" />
          ) : (
            <Input
              type="text"
              inputType="normal"
              placeholder="계획명을 입력해주세요."
              width="full"
              height={2}
              radius="btn"
              fontSize="xs"
              value={plan.address}
              additionalStyle="pointer-events-none"
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMemo((e.target as HTMLInputElement).value);
              }}
              value={memo}
            />
          )}
        </div>
        <div className="flex items-center justify-center w-full gap-6">
          {loading ? (
            <>
              <Skeleton width="4rem" height="2rem" />
              <Skeleton width="4rem" height="2rem" />
            </>
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
                children="수정"
                onClick={() => {
                  updatePlan(newName, plan.address, memo);
                  setIsUpdate(true);
                  closeModal();
                  navigate(0);
                }}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
