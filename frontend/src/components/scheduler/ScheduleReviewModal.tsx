import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { writeReview } from '@/apis/scheduler/schedulerApi';
import type { Review } from '@/types';

import Button from '../common/Button';

interface Props {
  planSerial: number;
  workSerial: number;
  isModalOpen: boolean;
  closeModal: () => void;
}
const question = [
  {
    type: 'professionalStar',
    question: '시공자의 전문성에 만족하신가요?',
    msg: '시공업자의 업무 지식과 기술력에 대해 체크해주세요.',
  },
  {
    type: 'communicationStar',
    question: '시공자와의 소통이 원활했나요?',
    msg: '시공업자가 요청이나 질문에 대해 적절히 대응했는지 체크해주세요.',
  },
  {
    type: 'attitudeStar',
    question: '시공업자의 태도와 서비스는 만족하신가요??',
    msg: '시공업자가 친절하게 응대했는지 체크해주세요.',
  },
  {
    type: 'qualityStar',
    question: '시공 후 현장의 청결 상태는 어땠나요?',
    msg: '시공업자가 작업 후 뒤처리를 잘했는지 체크해주세요.',
  },
  {
    type: 'reviewContent',
    question:
      '시공업자에게 개선할 점이나 칭찬하고 싶은 점을 자유롭게 적어주세요.',
    msg: null,
  },
];
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

Modal.setAppElement('#root');
export default function ScheduleReviewModal({
  planSerial,
  workSerial,
  isModalOpen,
  closeModal,
}: Props) {
  const [step, setStep] = useState<number>(1);
  const currentType = question[step - 1].type as keyof Review;
  const [content, setContent] = useState<string>('');
  const [review, setReview] = useState<Review>({
    reviewContent: '',
    communicationStar: 0,
    attitudeStar: 0,
    qualityStar: 0,
    professionalStar: 0,
    isVisible: 1,
  });
  const registReview = async (data: Review) => {
    return await writeReview(planSerial, workSerial, data);
  };
  const handleButtonClick = (rating: number) => {
    setReview((prev) => ({
      ...prev,
      [currentType]: rating,
    }));
  };
  useEffect(() => {
    setReview((prev) => ({
      ...prev,
      [currentType]: content,
    }));
  }, [content]);
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
    >
      <hr className="absolute top-[1.5rem] w-full border border-zp-sub-color" />
      <div className="flex flex-col gap-[1.5rem] w-full mt-[1.5rem] overflow-auto">
        <div className="flex flex-col w-full gap-4">
          <p className="font-bold text-zp-sm">{question[step - 1].question}</p>
          <p className="text-zp-xs text-wrap text-zp-gray">
            {question[step - 1].msg}
          </p>
          {step < 5 ? (
            <div className="w-full mt-[2rem] grid grid-cols-5 place-items-center">
              {Array.from({ length: 5 }, (_, idx) => (
                <Button
                  key={idx}
                  buttonType={
                    review[currentType] === idx + 1 ? 'primary' : 'second'
                  }
                  children={idx + 1}
                  fontSize="sm"
                  radius="full"
                  width={3}
                  height={3}
                  onClick={() => handleButtonClick(idx + 1)}
                />
              ))}
            </div>
          ) : (
            <textarea
              className="relative w-full h-[5rem] border  p-2 text-zp-xs"
              placeholder="150자 이내로 작성해주세요."
              onChange={(e: React.ChangeEvent) => {
                setContent((e.target as HTMLInputElement).value);
              }}
              value={content}
            />
          )}
          <Button
            buttonType="primary"
            children={step < 5 ? 'Next' : '평가 완료'}
            fontSize="sm"
            radius="big"
            width="full"
            height={3}
            onClick={() => {
              if (step < 5) setStep(step + 1);
              else {
                registReview(review);
                closeModal();
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
