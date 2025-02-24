import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaPencilAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import { makeChatRoom } from '@/apis/chatroom/chatApi';
import { useLoginUserStore } from '@/stores/loginUserStore';
import type { ChatRoom } from '@/types';
import { CertificatedBadge } from '@assets/svg/icons';
import Button from '@components/common/Button';
import { formatDate } from '@utils/formatDateWithTime';

interface Props {
  schedule: any;
  idx: number;
  planSerial?: number;
  updateContent: (serial: number, content: string) => void;
  chatRoomList: ChatRoom[];
  openReviewModal: (serial: number) => void;
}
export default function SchedulerCardExist({
  schedule,
  idx,
  updateContent,
  chatRoomList,
  openReviewModal,
}: Props) {
  const { loginUser } = useLoginUserStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(schedule.workContent);
  const cardHeight: string = isOpen ? '18rem' : '4rem';
  const handleClickChevron = function () {
    setIsOpen(!isOpen);
  };
  const chatStart = async () => {
    try {
      if (schedule)
        return await makeChatRoom(
          schedule.workSerial,
          schedule.fieldCode.fieldName
        );
    } catch (error) {
      if (chatRoomList && chatRoomList.length > 0 && schedule) {
        const chatRoomSerial: string = chatRoomList.filter(
          (room) =>
            room.fieldName === schedule.fieldCode.fieldName &&
            room.workerName === schedule.workerSerial.userSerial.userName &&
            room.customerName === loginUser?.userName
        )[0].chatroomSerial;
        navigate(`/chatrooms/${chatRoomSerial}`);
      }
    }
  };
  return (
    <>
      <div
        className="relative flex flex-col items-center justify-center w-full gap-4 rounded-zp-radius-big bg-zp-white drop-shadow-zp-slight"
        style={{ height: cardHeight }}
      >
        <div className="absolute flex items-center justify-between w-full px-6 top-5 ">
          <div className="flex items-center gap-1.5 text-zp-xl font-bold">
            {idx}. {schedule.fieldName}{' '}
            {schedule.isCompleted > 0 && (
              <IoMdCheckmarkCircleOutline size={16} color="#34C759" />
            )}
            {isOpen && !isUpdate && (
              <>
                <FaPencilAlt
                  size={16}
                  className="cursor-pointer"
                  onClick={() => setIsUpdate(!isUpdate)}
                />
              </>
            )}
          </div>
          <div>
            {isOpen ? (
              !isUpdate && (
                <FaChevronUp
                  className="cursor-pointer"
                  size={16}
                  onClick={handleClickChevron}
                />
              )
            ) : (
              <FaChevronDown
                className="cursor-pointer"
                width={16}
                height={16}
                onClick={handleClickChevron}
              />
            )}
          </div>
        </div>
        {isOpen && (
          <div className="flex flex-col w-full items-center  gap-4 mt-[1rem]">
            <hr className="w-full border-zp-light-gray" />
            <div className="flex items-start w-full">
              <div className="flex w-[30%] flex-col items-center gap-2">
                <div className="w-[60%] aspect-square text-center  rounded-zp-radius-full">
                  <img
                    className="object-cover w-full h-full rounded-zp-radius-full"
                    src={schedule.workerSerial.userSerial.fileSerial.saveFile}
                  />
                </div>
                <div className="flex gap-1">
                  <p className="font-bold text-zp-2xs">
                    {schedule.workerSerial.userSerial.userName}
                  </p>
                  {schedule.workerSerial.certificate > 0 && (
                    <CertificatedBadge width={12} height={12} />
                  )}
                </div>
                <p className="font-bold text-zp-2xs">
                  {schedule.workerSerial.company}
                </p>
              </div>
              <div className="flex flex-col w-[80%] gap-1 pr-4">
                <p className="font-bold text-zp-2xs">
                  기간 : {formatDate(schedule.startDate)} ~{' '}
                  {formatDate(schedule.endDate)}
                </p>
                <p className="font-bold text-zp-2xs">
                  시공 비용 : {schedule.workPrice}
                </p>
                <p className="font-bold text-zp-2xs">메모</p>
                {isUpdate ? (
                  <textarea
                    className=" w-[70%] h-[3.5rem] border p-4 border-zp-light-gray rounded-zp-radius-big text-zp-2xs"
                    value={newContent}
                    onChange={(e: React.ChangeEvent) => {
                      setNewContent((e.target as HTMLInputElement).value);
                    }}
                    placeholder="작업 메모사항을 적어주세요."
                  />
                ) : (
                  <div className="max-w-[19rem] h-[3.5rem] border border-zp-light-gray rounded-zp-radius-big text-zp-2xs p-1">
                    {schedule.workContent}
                  </div>
                )}
                <div className="flex gap-2">
                  {isUpdate ? (
                    <Button
                      children="수정"
                      buttonType="normal"
                      width={5}
                      height={1.5}
                      radius="big"
                      fontSize="2xs"
                      onClick={() => {
                        updateContent(schedule.workSerial, newContent);
                        setIsUpdate(!isUpdate);
                        navigate(0);
                      }}
                    />
                  ) : (
                    <>
                      <Button
                        children="문의하기"
                        buttonType="normal"
                        width={4}
                        height={1.5}
                        radius="big"
                        fontSize="2xs"
                        onClick={chatStart}
                      />
                      <Button
                        children="계약서"
                        buttonType="normal"
                        width={4}
                        height={1.5}
                        radius="big"
                        fontSize="2xs"
                        onClick={() =>
                          navigate(`/contract/${schedule.workSerial}`)
                        }
                      />
                      {schedule.isCompleted === 1 && (
                        <Button
                          children="평가하기"
                          buttonType="normal"
                          width={4}
                          height={1.5}
                          radius="big"
                          fontSize="2xs"
                          onClick={() => openReviewModal(schedule.workSerial)}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
