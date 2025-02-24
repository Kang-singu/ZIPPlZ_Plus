import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';

import { getChatRooms } from '@/apis/chatroom/chatApi';
import { getTopWorkerList } from '@/apis/worker/WorkerListApi';
import { useWorkerListStore } from '@/stores/workerListStore';
import type { ChatRoom, TodayWork, Work } from '@/types';
import { getTodayWork, getWorksByUser } from '@apis/scheduler/schedulerApi';
import Button from '@components/common/Button';
import ScheduleCalendar from '@components/common/calendar/ScheduleCalendar';
import FieldListItem from '@components/home/FieldListItem';
import ImageChangeTab from '@components/home/ImageChangeTab';
import ImageChangeViewTab from '@components/home/ImageChangeViewTab';
import TodaySchedule from '@components/home/TodaySchedule';
import WorkerCard from '@components/home/WorkerCard';
import { useLoginUserStore } from '@stores/loginUserStore';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const fields: string[] = [
  '전체',
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
  '기타',
];

export default function Home() {
  const [scheduleList, setScheduleList] = useState<Work[] | null>(null);
  const [todayWork, setTodayWork] = useState<TodayWork[] | null>(null);
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[] | null>(null);
  const { workerList, setWorkerList } = useWorkerListStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loginUser } = useLoginUserStore();
  const fetchChatRooms = async () => {
    const response = await getChatRooms();
    setLoading(true);
    setChatRoomList(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleClickImageChange = () =>
    // (window.location.href = `https://43.201.5.30:8080?user=${loginUser?.userSerial}`);
    // navigate(`/image-change/{loginUser?.userSerial`)
    (window.location.href = `http://localhost:8080/?user=${loginUser?.userSerial}`);
  const fetchWorks = async () => {
    const response = await getWorksByUser();
    setScheduleList(response.data.data);
  };

  const handleClickField = (field: string) => {
    navigate(`/workers/portfolios?type=${field}`);
  };

  const fetchHotWorkers = async () => {
    setLoading(true);
    const response = await getTopWorkerList();
    setWorkerList(response.data.data);
    setLoading(false);
  };

  const fetchTodaySchedule = async () => {
    try {
      const response = await getTodayWork();
      setTodayWork(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotWorkers();
    if (loginUser?.role) {
      fetchWorks();
      fetchTodaySchedule();
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 mt-8 mb-6 overflow-auto bg-zp-light-beige p-7">
      <div className="relative w-full p-4 rounded-zp-radius-big bg-zp-white drop-shadow-zp-slight">
        <ScheduleCalendar workList={scheduleList} loading={loading} />

        {(!loginUser || loginUser.role === '') && (
          <div className="absolute flex justify-center items-center w-full h-full top-0 left-0 rounded-zp-radius-big bg-[rgba(255,255,255,0.5)] z-10">
            <div className="flex flex-col justify-center items-center w-[80%] h-[40%] bg-zp-light-beige opacity-100 z-100 rounded-zp-radius-big gap-4 p-4">
              <p className="font-bold text-center text-zp-xs">
                나만의 시공 업무를 관리하고 싶다면?
              </p>
              <Button
                buttonType="second"
                children="로그인 하기"
                fontSize="xs"
                width="40%"
                height={2}
                radius="btn"
                onClick={() => navigate('/member/login')}
              />
            </div>
          </div>
        )}
      </div>

      {loginUser && loginUser.role !== '' && (
        <div className="flex items-start justify-center w-full gap-2 md:gap-6">
          <div className="basis-7/12">
            <p className="mb-1 font-bold text-zp-xl font-noto">📆 Today</p>
            {todayWork ? (
              todayWork.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                >
                  {todayWork
                    .filter((work) => work.worker !== null)
                    .map((work) => (
                      <SwiperSlide key={work.workSerial}>
                        <TodaySchedule
                          key={work.workSerial}
                          role={loginUser?.role || ''}
                          work={work}
                          chatRoomList={chatRoomList || []}
                          loading={loading}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              ) : (
                <div className="w-full h-[8.3rem] rounded-zp-radius-big bg-zp-white flex items-center justify-center">
                  <p className="font-bold text-zp-md text-zp-light-gray">
                    시공이 없습니다
                  </p>
                </div>
              )
            ) : (
              <Skeleton height={132} count={2} />
            )}
          </div>

          <div className="basis-5/12">
            <p className="mb-1 font-bold text-zp-xl font-noto">
              🤖 AI 자재 입히기
            </p>
            <div className="flex flex-col gap-2">
              <ImageChangeTab onClick={handleClickImageChange} />
              <ImageChangeViewTab onClick={handleClickImageChange} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <p className="mb-1 font-bold text-zp-xl font-noto">
          🔎 찾으시는 시공이 있으신가요?
        </p>
        <p className="font-bold text-zp-2xs text-zp-gray">
          선택한 시공에 맞춰 인증된 전문 기술자를 추천해드립니다.
        </p>
      </div>

      <div className="grid w-full grid-cols-6 gap-4">
        {fields.map((item) => (
          <FieldListItem
            key={item}
            field={item}
            handleClickField={() => handleClickField(item)}
          />
        ))}
      </div>
      <p className="mb-1 font-bold text-zp-xl font-noto">🔥 HOT한 시공업자</p>
      <div
        className="flex w-full overflow-x-auto"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <div className="flex justify-between w-full h-[8rem]">
          {loading ? (
            <Skeleton width={100} height={80} count={5} className="mr-2" />
          ) : (
            workerList?.map((worker) => (
              <WorkerCard key={worker.field_id} worker={worker} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
