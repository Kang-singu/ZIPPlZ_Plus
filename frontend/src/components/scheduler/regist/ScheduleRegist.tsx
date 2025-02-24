import React, { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { LuMinimize2 } from 'react-icons/lu';
import ReactModal from 'react-modal';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import { addWork } from '@apis/scheduler/schedulerApi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Selectbar from '@components/common/Selectbar';

import PrivateScheduleModal from './PrivateScheduleModal';

const options: string[] = [
  '철거',
  '설비',
  '샷시',
  '목공',
  '전기',
  '욕실',
  '타일',
  '마루',
  '도배',
  '가구',
];
interface Props {
  planSerial?: number;
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
    maxHeight: '468px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1500,
  },
};
export default function ScheduleRegist({ planSerial }: Props) {
  const navigate = useNavigate();
  const [isRegist, setIsRegist] = useState<boolean>(false);
  const [isNormalScehdule, setIsNormalSchedule] = useState<boolean>(false);
  const [isPrivateSchedule, setIsPrivateSchedule] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] =
    useState<string>('시공을 선택해주세요.');
  const [showRegistPrivateModal, setShowRegistPrivateModal] =
    useState<boolean>(false);
  const [newPrivateSchedule, setNewPrivateSchedule] = useState<string>('');
  const handleClickPlus = function () {
    setIsRegist(true);
  };
  const handleClickNormal = function () {
    setIsNormalSchedule(true);
  };
  const handleClickPrivate = function () {
    setIsPrivateSchedule(true);
  };
  const handleKeyDown = function (e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      setShowRegistPrivateModal(true);
      setNewPrivateSchedule((e.target as HTMLInputElement).value);
    }
  };
  const closeModal = function () {
    setShowRegistPrivateModal(false);
    setNewPrivateSchedule('');
    setIsPrivateSchedule(false);
    setIsRegist(false);
  };
  const registMainWork = async (fieldName: string) => {
    if (planSerial) return await addWork(planSerial, { fieldName: fieldName });
  };
  useEffect(() => {
    if (selectedValue !== '시공을 선택해주세요.') {
      registMainWork(selectedValue);
      navigate(0);
    }
    setIsRegist(false);
    setIsNormalSchedule(false);
  }, [selectedValue]);
  return (
    <>
      {!isRegist ? (
        <FiPlusCircle size={32} onClick={handleClickPlus} />
      ) : !isNormalScehdule && !isPrivateSchedule ? (
        <div className="flex items-center justify-center w-full gap-4">
          <Button
            buttonType="primary"
            children="메인 시공"
            fontSize="xs"
            radius="btn"
            width={5}
            height={1.5}
            onClick={handleClickNormal}
          />
          <Button
            buttonType="second"
            children="개인 시공"
            fontSize="xs"
            radius="btn"
            width={5}
            height={1.5}
            onClick={handleClickPrivate}
          />
        </div>
      ) : isNormalScehdule ? (
        <Selectbar
          backgroundColor="white"
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          fontColor="black"
          fontSize="xl"
          border="none"
          hover="sub"
          radius="btn"
          width="full"
          height={2}
          options={options}
        />
      ) : (
        <Input
          placeholder="시공 이름을 입력해주세요."
          type="text"
          inputType="normal"
          height={3}
          radius="btn"
          width="full"
          fontSize="xl"
          value={newPrivateSchedule}
          onChange={(e: React.ChangeEvent) =>
            setNewPrivateSchedule((e.target as HTMLInputElement).value)
          }
          onKeyDown={handleKeyDown}
        />
      )}
      <Modal
        isOpen={showRegistPrivateModal}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <LuMinimize2
          className="absolute top-[1rem] right-[1rem] cursor-pointer"
          size={16}
          onClick={closeModal}
        />
        <PrivateScheduleModal
          newPrivateSchedule={newPrivateSchedule}
          closeModal={closeModal}
          planSerial={planSerial}
        />
      </Modal>
    </>
  );
}
