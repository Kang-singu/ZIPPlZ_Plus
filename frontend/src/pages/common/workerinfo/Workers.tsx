import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useLoginUserStore } from '@/stores/loginUserStore';
import {
  getWorkerList,
  getWorkerListByField,
  searchWorkerList,
} from '@apis/worker/WorkerListApi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import FieldListItem from '@components/home/FieldListItem';
import FindWorkerList from '@components/worker/findworker/FindWorkerList';
import WorkerInfoList from '@components/worker/workerinfolist/WorkerInfoList';
import { useBoardStore } from '@stores/boardStore';
import { useWorkerListStore } from '@stores/workerListStore';

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
export default function Workers() {
  const { loginUser } = useLoginUserStore();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { setWorkerList } = useWorkerListStore();
  const { category } = useParams<{ category?: string }>();
  const { keyword, setKeyword } = useBoardStore();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const type: string | null = queryParam.get('type');

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('전문 시공자 둘러보기');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const fetchWorkerList = async () => {
    const response = await getWorkerList();
    setWorkerList(response.data.data);
  };
  const fetchWorkerListByField = async (field: number) => {
    const response = getWorkerListByField(field);
    setWorkerList((await response).data.data);
  };
  const selectOption = (option: string) => {
    setSelectedOption(option);
    if (option === '전문 시공자 둘러보기') {
      navigate('/workers/portfolios?type=전체');
    } else {
      navigate('/workers/findworker');
    }
    setIsOpen(false);
  };
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const searchWorker = async () => {
    if (keyword !== '') {
      const response = await searchWorkerList(keyword);
      setWorkerList(response.data.data);
    }
  };
  useEffect(() => {
    if (category === 'portfolios') setSelectedOption('전문 시공자 둘러보기');
    else {
      setSelectedOption('전문 시공자 구하기');
    }
  }, []);
  const fetchData = async () => {
    try {
      if (type === '전체') {
        await fetchWorkerList();
      } else if (type) {
        await fetchWorkerListByField(fields.indexOf(type));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    setKeyword('');
    fetchData();
  }, [category, type]);
  return (
    <>
      <div className="flex flex-col items-center mt-[3rem] gap-4 p-6 min-h-screen">
        <div className="relative w-full text-center">
          <div className="flex items-center justify-center w-full gap-2">
            <p className="font-bold text-center cursor-pointer text-zp-lg">
              {selectedOption}
            </p>
            {!isOpen ? (
              <FaChevronDown
                size={16}
                className="cursor-pointer"
                onClick={toggleDropdown}
              />
            ) : (
              <FaChevronUp
                size={16}
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            )}
          </div>
          {isOpen && (
            <div className="absolute left-0 right-0 w-full ">
              {selectedOption === '전문 시공자 둘러보기' ? (
                <p
                  className="mr-10 cursor-pointer text-zp-lg"
                  onClick={() => selectOption('전문 시공자 구하기')}
                >
                  전문 시공자 구하기
                </p>
              ) : (
                <p
                  className="mr-2 cursor-pointer text-zp-lg "
                  onClick={() => selectOption('전문 시공자 둘러보기')}
                >
                  전문 시공자 둘러보기
                </p>
              )}
            </div>
          )}
        </div>
        {category === 'portfolios' ? (
          <div
            className="flex w-full gap-2 mt-4 overflow-x-scroll flex-nowrap"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {fields.map((field, idx) => (
              <div className="flex-shrink-0 w-1/6 ">
                <FieldListItem
                  key={idx}
                  field={field}
                  handleClickField={() =>
                    navigate(`/workers/portfolios?type=${field}`)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="w-full mt-4 font-bold text-left text-zp-md">
            시공업자를 구하고 계신가요?
          </p>
        )}

        {/* 검색 입력 필드 */}
        <div className="relative flex flex-col items-center w-full">
          <Input
            placeholder={
              selectedOption === '전문 시공자 둘러보기'
                ? '시공업자의 이름을 입력하세요.'
                : '게시글 제목을 입력하세요.'
            }
            inputType="login"
            type="text"
            width="70%"
            height={1.8}
            fontSize="xs"
            radius="none"
            value={keyword}
            onChange={handleInputChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                searchWorker();
              }
            }}
            additionalStyle="text-center relative"
          />
          <HiMagnifyingGlass
            className="absolute left-[15%] top-[0.45rem] cursor-pointer"
            onClick={searchWorker}
          />
          {selectedOption === '전문 시공자 구하기' && (
            <div className="flex items-center justify-end w-full mt-4">
              {loginUser && loginUser.role === 'customer' && (
                <Button
                  buttonType="normal"
                  children="글 작성하기"
                  width={5}
                  height={1.5}
                  fontSize="2xs"
                  radius="btn"
                  onClick={() => navigate('/workers/findworker/write')}
                />
              )}
            </div>
          )}
        </div>
        {category === 'portfolios' && type && (
          <div className="w-full mb-[5rem]">
            {type === '전체' ? (
              <WorkerInfoList keyword={keyword} searchWorker={searchWorker} />
            ) : (
              <WorkerInfoList
                field={fields.indexOf(type)}
                keyword={keyword}
                searchWorker={searchWorker}
              />
            )}
          </div>
        )}
        {category === 'findworker' && (
          <div className="w-full">
            <FindWorkerList />
          </div>
        )}
      </div>
    </>
  );
}
