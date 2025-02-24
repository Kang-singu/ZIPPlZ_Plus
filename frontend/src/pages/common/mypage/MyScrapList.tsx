import { useState } from 'react';
import { FaRegCircle } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoIosClose } from 'react-icons/io';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Selectbar from '@/components/common/Selectbar';
import Input from '@components/common/Input';

type SortOption = '평점순' | '최신순' | '과거순';

export default function MyScrapList() {
  const options: SortOption[] = ['평점순', '최신순', '과거순'];
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SortOption>('평점순');
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSortSelect = (sortOption: string) => {
    setSelectedValue(sortOption as SortOption);
  };

  const handleGoBack = () => {
    navigate('/mypage');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const toggleSelecting = () => {
    setIsSelecting(!isSelecting);
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
              <span className="font-bold text-zp-lg">스크랩 글 목록</span>
              <div
                onClick={toggleDropdown}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <IoMdArrowDropdown
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  size={24}
                />
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-50 w-64 mt-2 border border-gray-200 rounded-lg shadow-lg top-full bg-zp-white">
              <button
                onClick={() => handleNavigate('/mypage/myscraplist')}
                className="block w-full px-4 py-2 text-left hover:bg-zp-gray"
              >
                스크랩 글 목록
              </button>
              <button
                onClick={() => handleNavigate('/mypage/MyFindWorkerScrapList')}
                className="block w-full px-4 py-2 text-left hover:bg-zp-gray"
              >
                내가 쓴 글 목록
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
                hover="light-gray"
              />
            </div>
          </div>
        </div>

        <div className="font-bold text-zp-xl text-zp-gray">전체 3</div>
        <div className="flex items-center justify-end w-full text-zp-2xs">
          {isSelecting && (
            <div className="flex items-center mr-2 space-x-2">
              <FaRegCircle size={20} />
              <span>전체 선택</span>
            </div>
          )}
          <button
            className="flex items-center p-2 px-3 space-x-2 rounded-zp-radius-big bg-zp-light-gray"
            onClick={toggleSelecting}
          >
            {isSelecting ? (
              <>
                <IoIosClose size={20} />
                <span>선택 삭제</span>
              </>
            ) : (
              <span>선택하기</span>
            )}
          </button>
        </div>
        <hr className="w-full border-zp-main-color" />

        <div className="grid w-full grid-cols-3 gap-4 mt-2 sm:grid-cols-3 md:grid-cols-4"></div>
      </div>
    </>
  );
}
