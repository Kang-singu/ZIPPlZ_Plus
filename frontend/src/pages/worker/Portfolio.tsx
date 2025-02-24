import { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { GrTools } from 'react-icons/gr';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { IoCallOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  getPortfolioDetail,
  getPortfolioList,
} from '@/apis/worker/PortfolioApi';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { ChatRoom } from '@/types';
import { getChatRooms, makeChatRoom } from '@apis/chatroom/chatApi';
import Button from '@components/common/Button';

import OverView from './tabs/OverView';
import WorkerReview from './tabs/WorkerReview';
import WorkerSchedule from './tabs/WorkerSchedule';

export default function Portfolio() {
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const fetchChatRooms = async () => {
    const response = await getChatRooms();
    setChatRoomList(response.data.data);
  };
  useEffect(() => {
    fetchChatRooms();
  }, []);
  const { loginUser } = useLoginUserStore();
  const chatStart = async () => {
    try {
      if (id) {
        const response = await makeChatRoom(parseInt(id), nowField);
        const chatRoomSerial = response.data.data.chatroomSerial;
        navigate(`/chatrooms/${chatRoomSerial}`);
      }
    } catch (e) {
      if (chatRoomList && chatRoomList.length > 0 && portfolioOverview) {
        const chatRoomSerial: string = chatRoomList.filter(
          (room) =>
            room.fieldName === nowField &&
            room.workerName === portfolioOverview.user.userName &&
            room.customerName === loginUser?.userName
        )[0].chatroomSerial;
        navigate(`/chatrooms/${chatRoomSerial}`);
      }
    }
  };

  const {
    portfolioList,
    portfolioOverview,
    setPortfolioList,
    setPortfolioOverview,
  } = usePortfolioStore();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [nowField, setNowField] = useState<string>('');
  const fetchPortfolioList = async (userSerial: number) => {
    const response = await getPortfolioList(userSerial);
    setPortfolioList(response.data.data);
  };
  const fetchPortFolioOverView = async (portfolioSerial: number) => {
    const response = await getPortfolioDetail(portfolioSerial);
    setPortfolioOverview(response.data.data);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchPortfolioList(parseInt(id));
    return () => {
      setPortfolioList([]);
      setPortfolioOverview(null);
    };
  }, []);
  useEffect(() => {
    if (portfolioList && portfolioList.length > 0) {
      fetchPortFolioOverView(portfolioList[0].portfolioSerial);
      setNowField(portfolioList[0].fieldId.fieldName);
    }
  }, [portfolioList, id]);

  const overviewClick = () => {
    if (id) {
      setActiveTab('overview');
      navigate(`/workers/${parseInt(id)}/portfolio?tab=overview`);
    }
  };

  const workerScheduleClick = () => {
    setActiveTab('workerschedule');
    if (id) navigate(`/workers/${parseInt(id)}/portfolio?tab=workerschedule`);
  };

  const reviewClick = () => {
    setActiveTab('review');
    if (id) navigate(`/workers/${parseInt(id)}/portfolio?tab=review`);
  };

  return (
    <>
      <div className="flex flex-col w-full gap-2 min-h-screen p-6 mt-[3rem] mb-10">
        <div className="relative flex items-start w-full gap-6 mt-2 font-bold">
          <div className="flex flex-col items-center">
            <div className="w-[100px] h-[100px] rounded-zp-radius-full drop-shadow-zp-deep ">
              <img
                className="object-cover w-full h-full rounded-zp-radius-full"
                src={portfolioOverview?.userProfile.saveFile}
              />
            </div>
            <p className="font-bold text-zp-lg">
              {portfolioOverview?.user.userName}
            </p>
          </div>

          <div className="flex flex-col mt-4 font-bold text-zp-xs">
            <div className="flex items-center gap-2">
              <CiLocationOn />
              {portfolioOverview?.localList.map((local) => <p>{local}</p>)}
            </div>
            <div className="flex items-center gap-2">
              <IoCallOutline />
              <p>{portfolioOverview?.user.tel}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GrTools />
                <p>Skills</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {portfolioList &&
                  portfolioList.map((item, index) => (
                    <Button
                      buttonType={
                        nowField === item.fieldId.fieldName
                          ? 'primary'
                          : 'second'
                      }
                      disabled={nowField === item.fieldId.fieldName}
                      width={3}
                      height={1.5}
                      fontSize="2xs"
                      radius="btn"
                      key={index}
                      onClick={() => {
                        fetchPortFolioOverView(item.portfolioSerial);
                        setNowField(item.fieldId.fieldName);
                      }}
                    >
                      {item.fieldId.fieldName}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-3 mt-2 font-bold text-zp-sm">
          <div
            className={`p-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'rounded-t-zp-radius-big border-x-2 border-t-2 border-zp-main-color'
                : 'rounded-b-lg border-b-2 border-zp-main-color'
            }`}
          >
            <p
              className="text-center rounded-zp-radius-big"
              onClick={overviewClick}
            >
              종합정보
            </p>
          </div>
          <div
            className={`p-2 cursor-pointer ${
              activeTab === 'workerschedule'
                ? 'rounded-t-zp-radius-big border-x-2 border-t-2 border-zp-main-color'
                : 'rounded-b-lg border-b-2 border-zp-main-color'
            }`}
          >
            <p className="text-center" onClick={workerScheduleClick}>
              시공자 일정
            </p>
          </div>

          <div
            className={`p-2 cursor-pointer ${
              activeTab === 'review'
                ? 'rounded-t-zp-radius-big border-zp-main-color'
                : 'rounded-b-lg border-b-2 border-zp-main-color'
            }`}
          >
            <p className="text-center" onClick={reviewClick}>
              후기
            </p>
          </div>
        </div>
        <div className="mt-2 mb-6">
          {activeTab === 'overview' && portfolioOverview && (
            <OverView portfolio={portfolioOverview} />
          )}
          {activeTab === 'workerschedule' && (
            <WorkerSchedule
              workerSerial={portfolioOverview?.worker.workerSerial}
              chatRoomList={chatRoomList}
            />
          )}
          {activeTab === 'review' && portfolioOverview && (
            <WorkerReview portfolio={portfolioOverview} />
          )}
        </div>
      </div>
      <div
        className="fixed flex flex-col w-full gap-4 z-[30] bg-zp-light-beige max-w-[600px]"
        style={{ bottom: '3.6rem' }}
      >
        {loginUser?.role === 'customer' && (
          <div className="flex flex-col items-center w-full gap-4 mb-6">
            <hr className="w-full text-zp-light-gray" />
            <Button
              buttonType="second"
              width="full"
              height={3}
              fontSize="lg"
              radius="btn"
              onClick={chatStart}
            >
              <IoChatbubblesOutline size={24} />
              <span className="font-bold">채팅하기</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
