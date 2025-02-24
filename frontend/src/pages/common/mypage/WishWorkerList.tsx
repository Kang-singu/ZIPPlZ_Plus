import { useState } from 'react';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { GoArrowLeft } from 'react-icons/go';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Selectbar from '@/components/common/Selectbar';
import FieldListItem from '@/components/home/FieldListItem';
import WorkerCard from '@/components/home/WorkerCard';
import type { HotWorker } from '@/types';
import Input from '@components/common/Input';

type SortOption = '평점순' | '최신순' | '과거순';

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

const list: HotWorker[] = [
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
  { name: '김현태', region: '서울 강남구', field: '전기', temp: '36.5도' },
];

export default function WishWorkerList() {
  const options: SortOption[] = ['평점순', '최신순', '과거순'];
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState<SortOption>('평점순');
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);

  const handleSortSelect = (sortOption: string) => {
    setSelectedValue(sortOption as SortOption);
  };

  const handleGoBack = () => {
    navigate('/mypage');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const toggleAllSelected = () => {
    if (isAllSelected) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(list.map((_, index) => index));
    }
    setIsAllSelected(!isAllSelected);
  };

  const toggleSelecting = () => {
    setIsSelecting(!isSelecting);
    setSelectedWorkers([]);
    setIsAllSelected(false);
  };

  const handleWorkerSelect = (index: number) => {
    if (selectedWorkers.includes(index)) {
      setSelectedWorkers(selectedWorkers.filter((i) => i !== index));
    } else {
      setSelectedWorkers([...selectedWorkers, index]);
    }
  };

  const handleModalConfirm = () => {
    setSelectedWorkers([]);
    setIsSelecting(false);
    setIsModalOpen(false);
  };

  const handleFieldClick = (field: string) => {
    console.log(`Selected field: ${field}`);
  };

  return (
    <>
      <div className="flex flex-col items-start w-full min-h-screen gap-4 px-6 mb-6">
        <div className="relative flex items-center justify-between w-full h-10 mt-20">
          <div className="flex items-center justify-center w-full gap-2">
            <GoArrowLeft
              className="absolute left-0 cursor-pointer"
              onClick={handleGoBack}
              size={20}
            />
            <div className="flex items-center space-x-2">
              <div className="font-bold text-zp-lg">관심 있는 시공업자</div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-6 gap-4">
          {fields.map((item) => (
            <FieldListItem
              key={item}
              field={item}
              handleClickField={() => handleFieldClick(item)}
            />
          ))}
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
          <div className="relative flex items-center justify-end top-3 left-3">
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
              hover="light-gray"
            />
          </div>
        </div>
        <div className="font-bold text-zp-xl text-zp-gray">
          <div>전체 {list.length}</div>
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
          <button
            className="flex items-center p-2 px-3 ml-auto space-x-2 rounded-zp-radius-big bg-zp-light-gray"
            onClick={() => {
              if (isSelecting && selectedWorkers.length === 0) {
                toggleSelecting();
              } else if (isSelecting && selectedWorkers.length > 0) {
                setIsModalOpen(true);
              } else {
                toggleSelecting();
              }
            }}
          >
            {isSelecting ? (
              selectedWorkers.length === 0 ? (
                <span>삭제 취소</span>
              ) : (
                <>
                  <IoIosClose size={14} />
                  <span>선택 삭제</span>
                </>
              )
            ) : (
              <span>선택하기</span>
            )}
          </button>
        </div>
        <hr className="w-full border-zp-main-color" />

        <div className="grid w-full grid-cols-3 gap-4 mt-2 overflow-x-auto">
          {list.map((worker, index) => (
            <div
              key={index}
              className={`relative h-36 rounded-zp-radius-big border border-zp-light-beige  items-center ${
                selectedWorkers.includes(index) ? '' : ''
              }`}
              onClick={() => handleWorkerSelect(index)}
            >
              {isSelecting && (
                <div className="absolute z-10 top-6 right-2">
                  {selectedWorkers.includes(index) ? (
                    <FaRegCircleCheck size={20} />
                  ) : (
                    <FaRegCircle size={20} />
                  )}
                </div>
              )}
              <WorkerCard
                worker={{
                  user_name: worker.name,
                  locations: [worker.region],
                  field_name: worker.field,
                  temperature: worker.temp,
                }}
              />
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
                onClick={handleModalCancel}
              >
                취소
              </button>
              <button
                className="w-full px-4 py-2 font-bold bg-zp-sub-color rounded-zp-radius-big"
                onClick={handleModalConfirm}
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
