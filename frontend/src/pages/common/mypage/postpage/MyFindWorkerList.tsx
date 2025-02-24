import { useEffect, useState } from 'react';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { GoArrowLeft } from 'react-icons/go';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoIosClose, IoMdArrowDropdown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import FindWorkerListItem from '@/components/worker/findworker/FindWorkerListItem';
import type { WorkerInfo } from '@/types';
import Input from '@components/common/Input';
import Selectbar from '@components/common/Selectbar';
import { useMyPageStore } from '@stores/myPageStore';

type SortOption = '평점순' | '최신순' | '과거순';

export default function MyFindWorkerList() {
  const options: SortOption[] = ['평점순', '최신순', '과거순'];
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SortOption>('평점순');
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const [workerList, setWorkerList] = useState<WorkerInfo[]>([]);

  const { fetchMyFindWorkerList } = useMyPageStore();

  interface WorkerPost {
    board_serial: number;
    board_type: number;
    user_serial: number;
    title: string;
    board_content: string;
    board_date: string;
    hit: number;
    nickname: string;
    comment_cnt: number;
    wish_cnt: number;
    portfolio_serial?: number;
    name?: string;
    birth_date?: number;
    temp?: number;
    field_id?: number;
    field_name?: string;
    career?: number;
    certificated_badge?: number;
    locations?: string[];
    img?: string;
  }

  useEffect(() => {
    const loadWorkers = async () => {
      const workers: WorkerPost[] = await fetchMyFindWorkerList();

      const workerInfoList: WorkerInfo[] = workers.map((worker) => ({
        board_serial: worker.board_serial,
        board_type: worker.board_type,
        user_serial: worker.user_serial,
        title: worker.title,
        board_content: worker.board_content,
        board_date: worker.board_date,
        hit: worker.hit,
        nickname: worker.nickname,
        comment_cnt: worker.comment_cnt,
        wish_cnt: worker.wish_cnt,
        portfolio_serial: worker.portfolio_serial || 0,
        name: worker.name || '',
        birth_date: worker.birth_date || 0,
        temp: worker.temp || 0,
        field_id: worker.field_id || 0,
        field_name: worker.field_name || '',
        career: worker.career || 0,
        certificated_badge: worker.certificated_badge || 0,
        locations: worker.locations || [],
        img: worker.img || '',
        user_name: worker.name || '',
      }));

      setWorkerList(workerInfoList);
    };

    loadWorkers();
  }, [fetchMyFindWorkerList]);

  const handleWorkerSelect = (user_serial: number) => {
    if (selectedWorkers.includes(user_serial)) {
      setSelectedWorkers(selectedWorkers.filter((id) => id !== user_serial));
    } else {
      setSelectedWorkers([...selectedWorkers, user_serial]);
    }
  };

  const handleGoBack = () => {
    navigate('/mypage');
  };

  const handleSortSelect = (sortOption: string) => {
    setSelectedValue(sortOption as SortOption);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleAllSelected = () => {
    if (isAllSelected) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(workerList.map((worker) => worker.user_serial));
    }
    setIsAllSelected(!isAllSelected);
  };

  const toggleSelecting = () => {
    if (isSelecting) {
      setSelectedWorkers([]);
    }
    setIsSelecting(!isSelecting);
    setIsAllSelected(false);
  };

  const handleDeleteConfirmation = () => {
    setIsModalOpen(true);
  };

  const handleWorkerClick = (user_serial: number) => {
    navigate(`/findworkers/${user_serial}`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-start w-full min-h-screen gap-4 px-6 mb-6">
        <div className="relative flex items-center justify-between w-full h-10 mt-16">
          <div className="flex items-center justify-center w-full gap-2">
            <GoArrowLeft
              className="absolute left-0 cursor-pointer"
              onClick={handleGoBack}
              size={20}
            />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zp-lg">내가 쓴 글 목록</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center w-full space-x-2">
          <span className="font-bold text-zp-lg">시공자 구하기</span>
          <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <IoMdArrowDropdown
              className={`transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              size={24}
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute z-50 w-64 mt-2 border shadow-lg top-full bg-zp-white border-zp-light-gray rounded-zp-radius-big">
              <button
                onClick={() => handleNavigate('/mypage/MyFindWorkerList')}
                className="block w-full px-4 py-2 font-bold text-left hover:bg-gray-100 text-zp-sm hover:bg-zp-light-beige rounded-zp-radius-big"
              >
                시공자 구하기
              </button>
              <button
                onClick={() => handleNavigate('/mypage/MyHousePostList')}
                className="block w-full px-4 py-2 font-bold text-left hover:bg-gray-100 text-zp-sm hover:bg-zp-light-beige rounded-zp-radius-big"
              >
                집들이
              </button>
              <button
                onClick={() => handleNavigate('/mypage/MyQuestionPostList')}
                className="block w-full px-4 py-2 font-bold text-left hover:bg-gray-100 text-zp-sm hover:bg-zp-light-beige rounded-zp-radius-big"
              >
                질문글
              </button>
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-center w-full">
          <HiMagnifyingGlass className="absolute left-[1rem]" />
          <Input
            type="text"
            placeholder="검색어를 입력해주세요."
            inputType="search"
            width="full"
            height={2}
            className="pl-8"
            fontSize="sm"
            radius="big"
          />
          <IoIosClose
            size={30}
            className="absolute right-[7rem] cursor-pointer"
          />
          <div className="relative flex items-center justify-end top-3">
            <div>
              <Selectbar
                backgroundColor="none"
                fontColor="black"
                options={options}
                selectedValue={selectedValue}
                setSelectedValue={handleSortSelect}
                width={6}
                height={2.5}
                fontSize="xs"
                radius="btn"
                border="none"
                hover="main"
              />
            </div>
          </div>
        </div>

        <div className="font-bold text-zp-xl text-zp-gray">
          전체 {workerList.length}
        </div>

        <div className="flex items-center justify-between w-full text-zp-2xs">
          {isSelecting && (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleAllSelected}
            >
              {isAllSelected ? (
                <FaRegCircleCheck size={20} />
              ) : (
                <FaRegCircle size={20} />
              )}
              <span>전체 선택</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              className="flex items-center p-2 px-3 space-x-2 rounded-zp-radius-big bg-zp-light-gray"
              onClick={
                isSelecting && selectedWorkers.length > 0
                  ? handleDeleteConfirmation
                  : toggleSelecting
              }
            >
              {isSelecting ? (
                selectedWorkers.length === 0 ? (
                  <span>선택 취소</span>
                ) : (
                  <>
                    <IoIosClose size={14} />
                    <span>삭제</span>
                  </>
                )
              ) : (
                <span>선택하기</span>
              )}
            </button>
          </div>
        </div>

        <hr className="w-full border-zp-main-color" />

        <div className="grid w-full grid-cols-1 gap-4 mt-2">
          {workerList.map((worker) => (
            <div
              key={worker.board_serial}
              className={`relative rounded-zp-radius-big border border-zp-light-beige shadow-lg flex flex-col items-center ${
                selectedWorkers.includes(worker.user_serial)
                  ? 'bg-zp-light-gray'
                  : ''
              }`}
            >
              {isSelecting && (
                <div
                  className="absolute z-10 top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerSelect(worker.user_serial);
                  }}
                >
                  {selectedWorkers.includes(worker.user_serial) ? (
                    <FaRegCircleCheck />
                  ) : (
                    <FaRegCircle />
                  )}
                </div>
              )}
              <div
                className={`w-full h-full ${
                  isSelecting ? 'pointer-events-none' : ''
                }`}
                onClick={() => handleWorkerClick(worker.board_serial)}
              >
                <FindWorkerListItem board={worker} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-zp-white rounded-zp-radius-big">
            <div className="mb-4 font-bold text-zp-2xl">삭제 확인</div>
            <div className="mb-4 font-bold">
              선택한 항목을 삭제하시겠습니까?
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="w-full px-4 py-2 font-bold bg-zp-light-beige rounded-zp-radius-big"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="w-full px-4 py-2 font-bold bg-zp-sub-color rounded-zp-radius-big"
                onClick={() => {
                  setSelectedWorkers([]);
                  setIsSelecting(false);
                  setIsModalOpen(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
