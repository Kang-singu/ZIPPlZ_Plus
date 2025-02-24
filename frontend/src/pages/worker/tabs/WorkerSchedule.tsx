import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getWorkerSchedule,
  getWorkerScheduleDetail,
} from '@/apis/worker/PortfolioApi';
import Button from '@/components/common/Button';
import { useLoginUserStore } from '@/stores/loginUserStore';
import type { ChatRoom } from '@/types';
import { formatDate } from '@/utils/formatDateWithTime';
import ScheduleCalendar from '@components/common/calendar/ScheduleCalendar';
import { WorkerDate, usePortfolioStore } from '@stores/portfolioStore';

interface Props {
  workerSerial?: number;
  chatRoomList: ChatRoom[];
}

export default function WorkerSchedule({ workerSerial, chatRoomList }: Props) {
  const navigate = useNavigate();
  const { dateList, setDateList, dateDetail, setDateDetail } =
    usePortfolioStore();
  const { id } = useParams<{ id: string }>();
  const { loginUser } = useLoginUserStore();
  const [selectedWorkSerial, setSelectedWorkSerial] = useState<string | null>(
    null
  );

  const fetchWorkerSchedule = async (workerSerial: number) => {
    const response = await getWorkerSchedule(workerSerial);
    setDateList(response.data.data);
  };

  const fetchWorkerScheduleDetail = async (
    workerSerial: number,
    workSerial: number
  ) => {
    const response = await getWorkerScheduleDetail(workerSerial, workSerial);
    setDateDetail(response.data.data);
  };

  useEffect(() => {
    if (workerSerial && workerSerial > 0) {
      fetchWorkerSchedule(workerSerial);
    }
    const storedSerial = localStorage.getItem('workSerial');
    setSelectedWorkSerial(storedSerial);
    return () => {
      localStorage.removeItem('workSerial');
    };
  }, [workerSerial]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'workSerial') {
        setSelectedWorkSerial(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (
      workerSerial &&
      selectedWorkSerial !== null &&
      id &&
      parseInt(id) === loginUser?.userSerial
    ) {
      fetchWorkerScheduleDetail(workerSerial, parseInt(selectedWorkSerial));
    }
  }, [workerSerial, selectedWorkSerial, id, loginUser]);

  const handleCalendarEventClick = (newWorkSerial: string) => {
    setSelectedWorkSerial(newWorkSerial);
    localStorage.setItem('workSerial', newWorkSerial);
  };

  const chatStart = () => {
    if (chatRoomList.length > 0 && dateDetail) {
      const chatRoomSerial: string = chatRoomList.filter(
        (room) =>
          room.fieldName === dateDetail.fieldName &&
          room.workerName === loginUser?.userName &&
          room.customerName === dateDetail.customerName
      )[0].chatroomSerial;
      navigate(`/chatrooms/${chatRoomSerial}`);
    }
  };

  return (
    <div className="relative w-full h-full p-4 rounded-zp-radius-big bg-zp-white drop-shadow-zp-slight">
      <ScheduleCalendar
        workList={
          dateList.length > 0 &&
          dateList.map((item: WorkerDate) => ({
            workSerial: item.workSerial,
            field: item.fieldName,
            startDate: item.startDate.split('T')[0],
            endDate: item.endDate.split('T')[0],
          }))
        }
        onEventClick={handleCalendarEventClick}
      />
      {id &&
        parseInt(id) === loginUser?.userSerial &&
        dateDetail &&
        selectedWorkSerial !== null &&
        workerSerial !== null && (
          <div className="w-full h-[15rem] rounded-zp-radius-big bg-zp-white gap-2 p-6 text-zp-sm flex flex-col font-bold">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-zp-radius-full bg-zp-main-color" />
              <p>{dateDetail.nickname}</p>
            </div>
            <p>
              시공기간 : {formatDate(dateDetail.startDate)} ~{' '}
              {formatDate(dateDetail.endDate)}
            </p>
            <p>출장 장소 : {dateDetail.address}</p>
            <div className="flex w-full h-auto gap-2 overflow-auto flex-nowrap">
              {dateDetail.planImageList.map((image) => (
                <img
                  key={image.saveFile}
                  className="w-[20%] aspect-square"
                  src={image.saveFile}
                  alt="계획 이미지"
                />
              ))}
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
              <Button
                buttonType="normal"
                children="채팅하기"
                radius="btn"
                fontSize="xs"
                onClick={chatStart}
              />
              <Button
                buttonType="normal"
                children="계약서"
                radius="btn"
                fontSize="xs"
                onClick={() => navigate(`/contract/${selectedWorkSerial}`)}
              />
            </div>
          </div>
        )}
    </div>
  );
}
