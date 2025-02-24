import { useEffect, useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';
import { useLocation, useNavigate } from 'react-router-dom';

import { getChatRooms } from '@/apis/chatroom/chatApi';
import ScheduleReviewModal from '@/components/scheduler/ScheduleReviewModal';
import type { ChatRoom, Plan } from '@/types';
import {
  activePlan,
  deletePlan,
  deleteWork,
  getOnePlan,
  getPlans,
  getPrice,
  getWorks,
  modifyWork,
} from '@apis/scheduler/schedulerApi';
import Button from '@components/common/Button';
import ModalComponent from '@components/common/Modal';
import Selectbar from '@components/common/Selectbar';
import ScheduleCalendar from '@components/common/calendar/ScheduleCalendar';
import SchedulerCard from '@components/scheduler/card/SchedulerCard';
import SchedulerCardExist from '@components/scheduler/card/SchedulerCardExist';
import SchedulerCardCustom from '@components/scheduler/card/scheulerCardCustom';
import RegistPlan from '@components/scheduler/regist/RegistPlan';
import ScheduleRegist from '@components/scheduler/regist/ScheduleRegist';
import UpdatePlan from '@components/scheduler/regist/UpdatePlan';
import SharedImg from '@components/scheduler/sharedFile/SharedImg';
import SharedMemo from '@components/scheduler/sharedFile/SharedMemo';
import { useModalActions } from '@stores/modalStore';
import { useScheduleStore } from '@stores/scheduleStore';
import formatNumberWithCommas from '@utils/formatNumberWithCommas';

export default function Schedule() {
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const [loadingChatRooms, setLoadingChatRooms] = useState<boolean>(true);
  console.log(loadingChatRooms);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);
  const [loadingWorks, setLoadingWorks] = useState<boolean>(true);

  const fetchChatRooms = async () => {
    const response = await getChatRooms();
    setChatRoomList(response.data.data);
    setLoadingChatRooms(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const param: string | null = queryParams.get('plan');
  const planSerial: number | null = param ? parseInt(param) : null;
  const navigate = useNavigate();
  const [isOpenRegist, setIsOpenRegist] = useState<boolean>(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const {
    planList,
    setPlanList,
    workList,
    setWorkList,
    plan,
    setPlan,
    fileList,
    setFileList,
    selectedValue,
    setSelectedValue,
  } = useScheduleStore();
  const { openModal, closeModal } = useModalActions();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isOpenReviewModal, setIsOpenReviewModal] = useState<boolean>(false);
  const openReviewModal = () => {
    setIsOpenReviewModal(true);
  };
  const closeReviewModal = () => {
    setIsOpenReviewModal(false);
  };
  const [selectedWorkSerialForReview, setSelectedWorkSerialForReview] =
    useState<number | null>(null);
  const [options, setOptions] = useState<Plan[]>([]);
  const [selectedWorkSerial, setSelectedWorkSerial] = useState<number>(0);

  const handleConfirmDelete = async (
    planSerial: number,
    workSerial: number
  ) => {
    await deleteWork(planSerial, workSerial);
    setSelectedWorkSerial(0);
    fetchWorkList(planSerial);
    closeModal('select');
  };

  const fetchPlanList = async () => {
    const response = await getPlans();
    setPlanList(response.data.data);
    setLoadingPlan(false);
  };

  const fetchWorkList = async (planSerial: number) => {
    const response = await getWorks(planSerial, 0, 20);
    setWorkList(response.data.data);
    setLoadingWorks(false);
  };

  const fetchPlan = async (planSerial: number) => {
    const response = await getOnePlan(planSerial);
    setPlan(response.data.data.plan);
    setFileList(response.data.data.fileList);
    setLoadingPlan(false);
    setLoadingWorks(false);
  };

  const getTotalPrice = async (planSerial: number) => {
    const response = await getPrice(planSerial);
    setTotalPrice(response.data.data);
  };

  const updateWork = async (workSerial: number, workContent: string) => {
    if (planSerial)
      return await modifyWork(planSerial, workSerial, workContent);
  };

  const removePlan = async (planSerial: number) => {
    await deletePlan(planSerial);
    fetchWorkList(planSerial);
    closeModal('mini');
  };

  const setPlanActive = async () => {
    if (planSerial) return await activePlan(planSerial);
  };

  useEffect(() => {
    const savedValue = localStorage.getItem('selectedValue');
    if (savedValue && planSerial) {
      setSelectedValue(savedValue);
    } else {
      setSelectedValue('계획을 선택해주세요.');
    }
    return () => {
      setPlanList(null);
      setWorkList(null);
      setPlan(null);
      setFileList(null);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPlanList();
  }, []);

  useEffect(() => {
    if (planList) {
      const newOptions: Plan[] = planList.map((plan) => ({
        planSerial: plan.planSerial,
        planName: plan.planName,
        status: plan.isActive,
      }));
      setOptions(newOptions);
    }
  }, [planList]);

  useEffect(() => {
    if (selectedValue) {
      localStorage.setItem('selectedValue', selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (options.length > 0 && selectedValue !== '계획을 선택해주세요.') {
      const selectedPlan = options.find(
        (option) => option.planName === selectedValue
      );
      if (selectedPlan) {
        const planSerial: number = selectedPlan.planSerial;
        if (plan?.planSerial !== planSerial) {
          navigate(`/schedule?plan=${planSerial}`);
          fetchPlan(planSerial);
          fetchWorkList(planSerial);
          getTotalPrice(planSerial);
        }
      }
    }
  }, [selectedValue, options, planList, plan]);

  useEffect(() => {
    if (planSerial) fetchPlan(planSerial);
  }, [workList]);

  return (
    <>
      <div className="mt-[5rem] flex flex-col w-full items-center bg-zp-light-beige gap-4 sm lg px-6 mb-[5rem]">
        <div className="flex justify-end w-full gap-4">
          <FaPlus size={16} onClick={() => setIsOpenRegist(true)} />
          {selectedValue !== '계획을 선택해주세요.' &&
            plan &&
            plan.isActive === 1 && (
              <HiOutlinePencilAlt
                size={16}
                onClick={() => {
                  setIsOpenUpdate(true);
                }}
              />
            )}
          {selectedValue !== '계획을 선택해주세요.' && plan && (
            <FaTrashAlt
              size={16}
              onClick={() => {
                openModal('mini');
              }}
            />
          )}

          <RegistPlan
            isOpen={isOpenRegist}
            setIsOpen={setIsOpenRegist}
            fetchPlanList={fetchPlanList}
          />
          {plan && plan.isActive === 1 && (
            <UpdatePlan
              isOpen={isOpenUpdate}
              setIsOpen={setIsOpenUpdate}
              plan={plan}
              fetchPlan={fetchPlan}
            />
          )}
        </div>
        <div className="flex items-center w-full gap-4">
          <Selectbar
            fontColor="main"
            options={options.map((option) => option.planName)}
            status={options.map((option) => option.status)}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            width="full"
            height={2}
            fontSize="lg"
            radius="btn"
            border="main"
            hover="sub"
            backgroundColor="white"
          />
          {plan && selectedValue !== '계획을 선택해주세요.' && (
            <Button
              buttonType={plan && plan.isActive === 1 ? 'second' : 'primary'}
              width={3.5}
              height={1.5}
              fontSize="2xs"
              radius="btn"
              children={plan && plan.isActive === 1 ? '비활성화' : '활성화'}
              onClick={() => {
                if (plan && plan.isActive === 0) setPlanActive();
                navigate(0);
              }}
            />
          )}
        </div>
        <div className="w-full p-4 bg-zp-white rounded-zp-radius-big drop-shadow-zp-slight">
          <ScheduleCalendar
            workList={
              workList &&
              workList.map((work) => ({
                startDate: work.startDate,
                endDate: work.endDate,
                field: work.fieldCode.fieldName,
              }))
            }
          />
        </div>
        {selectedValue !== '계획을 선택해주세요.' && (
          <>
            <p className="w-full font-bold text-zp-xl ">공유 문서</p>
            <div className="flex items-stretch justify-between w-full h-full gap-4">
              <div className="h-full basis-2/3">
                {loadingPlan ? (
                  <Skeleton width="100%" height="200px" />
                ) : (
                  <SharedImg
                    fileList={fileList}
                    planSerial={plan?.planSerial}
                  />
                )}
              </div>
              <div className="h-full basis-1/3">
                {loadingPlan ? (
                  <Skeleton width="100%" height="200px" />
                ) : (
                  <SharedMemo sharedContents={plan?.sharedContents} />
                )}
              </div>
            </div>
            <p className="w-full font-bold text-right text-zp-xl ">
              {loadingPlan ? (
                <Skeleton width="200px" height="20px" />
              ) : (
                `총 시공 가격 : ${formatNumberWithCommas(totalPrice)}원`
              )}
            </p>
            {loadingWorks
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    width="100%"
                    height="120px"
                    className="mb-4"
                  />
                ))
              : workList &&
                workList.map((item, idx) =>
                  item.workerSerial ? (
                    <SchedulerCardExist
                      key={item.workSerial}
                      schedule={item}
                      idx={idx + 1}
                      planSerial={plan?.planSerial}
                      updateContent={updateWork}
                      chatRoomList={chatRoomList}
                      openReviewModal={(workSerial: number) => {
                        setSelectedWorkSerialForReview(workSerial);
                        openReviewModal();
                      }}
                    />
                  ) : item.fieldCode.fieldCode === 0 ? (
                    <SchedulerCardCustom
                      key={item.workSerial}
                      schedule={item}
                      idx={idx + 1}
                      planSerial={plan?.planSerial}
                    />
                  ) : (
                    <SchedulerCard
                      key={item.workSerial}
                      schedule={item}
                      idx={idx + 1}
                      onClickTrash={() => {
                        openModal('select');
                        setSelectedWorkSerial(item.workSerial);
                      }}
                    />
                  )
                )}
            {plan && plan.isActive === 1 && (
              <ScheduleRegist planSerial={plan?.planSerial} />
            )}
          </>
        )}
      </div>
      <ModalComponent
        type="select"
        title="공종 삭제"
        message="해당 공종을 삭제하시겠습니까?"
        onConfirm={() => {
          if (plan) handleConfirmDelete(plan.planSerial, selectedWorkSerial);
        }}
      />
      <ModalComponent
        type="mini"
        title="계획 삭제"
        message="해당 계획을 삭제하시겠습니까?"
        onConfirm={() => {
          if (plan) removePlan(plan.planSerial);
        }}
      />
      {plan && selectedWorkSerialForReview !== null && (
        <ScheduleReviewModal
          isModalOpen={isOpenReviewModal}
          closeModal={closeReviewModal}
          planSerial={plan && plan.planSerial}
          workSerial={selectedWorkSerialForReview}
        />
      )}
    </>
  );
}
