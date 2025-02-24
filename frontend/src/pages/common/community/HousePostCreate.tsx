import React, { ChangeEvent, useEffect, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { FaCamera, FaRegCircle } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { GoArrowLeft } from 'react-icons/go';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { getWorkerList, searchWorkerList } from '@/apis/worker/WorkerListApi';
import WorkerInfoListItem from '@/components/worker/workerinfolist/WorkerInfoListItem';
import { useBoardStore } from '@/stores/boardStore';
import { useHousePostStore } from '@/stores/housePostStore';
import { WorkerList, useWorkerListStore } from '@/stores/workerListStore';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

export default function HousePostCreate() {
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [workDetail, setWorkDetail] = useState<string>('');
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [tempSelectedWorkers, setTempSelectedWorkers] = useState<WorkerList[]>(
    []
  );

  const navigate = useNavigate();
  const maxImages = 10;

  const { createPost, selectedWorkers, setSelectedWorkers } =
    useHousePostStore();

  useEffect(() => {
    setSelectedWorkers([]);
    fetchWorkerInfoList();
  }, [setSelectedWorkers]);
  const { workerList, setWorkerList } = useWorkerListStore();
  const fetchWorkerInfoList = async () => {
    const response = await getWorkerList();
    setWorkerList(response.data.data);
  };
  const { keyword, setKeyword } = useBoardStore();
  const searchWorker = async () => {
    const response = await searchWorkerList(keyword);
    setWorkerList(response.data.data);
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.slice(0, maxImages - images.length);

    setImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const { fetchHousePosts } = useHousePostStore();
  const handleConfirm = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('board_content', workDetail);

    
    const selectedPortfolioJson = JSON.stringify(
      selectedWorkers.map((worker) => ({
        portfolio_serial: worker.portfolio_serial,
        birth_date: worker.birth_date,
        field_id: worker.field_id,
        field_name: worker.field_name,
        career: worker.career,
        certificated_badge: worker.certificated_badge,
        locations: worker.locations,
        img: worker.img,
      }))
    );
    formData.append('selected_portfolio', selectedPortfolioJson);

    if (images.length === 0) {
      formData.append('images', 'null');
    } else {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      const response = await createPost(token, formData);

      if (response.code === 200) {
        fetchHousePosts();
        navigate('/housepost');
      } else {
        alert(`자랑글 등록에 실패했습니다: ${response.message}`);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/housepost');
  };

  const handleWorkerSelect = (worker: WorkerList) => {
    setTempSelectedWorkers((prevSelected) =>
      prevSelected.includes(worker)
        ? prevSelected.filter((w) => w !== worker)
        : [...prevSelected, worker]
    );
  };

  const handleWorkerModalConfirm = () => {
    const updatedWorkers = tempSelectedWorkers.map((worker) => ({
      ...worker,
      worker: worker.user_serial,
      user_name: worker.user_name,
      temperature: worker.temperature,
    }));

    setSelectedWorkers(updatedWorkers);
    setIsWorkerModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen gap-6 p-6">
        <div className="flex items-center justify-between w-full mt-12">
          <div className="flex items-center">
            <GoArrowLeft
              className="mr-6 cursor-pointer"
              onClick={handleGoBack}
            />
          </div>
          <div className="relative flex-1 font-bold text-center right-4 text-zp-2xl">
            자랑하기
          </div>
        </div>

        <div className="flex items-center justify-start font-bold">
          <div className="text-left">
            <div>현장이나 일과 관련된 사진을 올려주세요.(선택사항)</div>
            <div className="text-zp-2xs text-zp-light-gray">
              사진을 첨부하면 시공자가 작업내용에 대해 보다 상세하게 파악할 수
              있어요.
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-1/6">
            <div className="relative">
              <label
                htmlFor="file-upload-0"
                className="flex items-center justify-center w-24 h-24 p-2 border cursor-pointer bg-zp-white border-zp-light-gray rounded-zp-radius-btn"
              >
                <FaCamera size={36} className="" />
                <div className="absolute flex justify-center w-full font-bold bottom-2 text-zp-xs text-zp-gray">
                  {images.length}/{maxImages}
                </div>
              </label>
              <input
                id="file-upload-0"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
            </div>
          </div>
          <div className="flex flex-1 space-x-4 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 flex-shrink-0 ${
                  index === 0 ? 'ml-7' : ''
                }`}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-full rounded-zp-radius-btn"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <MdClose size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <p className="font-bold text-zp-md">제목</p>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            inputType="login"
            width="100%"
            height={2}
            fontSize="xs"
            radius="none"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <p className="font-bold text-zp-md">자랑해주세요</p>
          <textarea
            className="w-full h-[15rem] border border-zp-main-color p-2 bg-zp-transparent rounded-zp-radius-btn resize-none text-zp-xs focus:outline-none"
            placeholder="집에서 자랑하고 싶은 내용을 입력해주세요."
            value={workDetail}
            onChange={(e: React.ChangeEvent) =>
              setWorkDetail((e.target as HTMLTextAreaElement).value)
            }
          />
        </div>

        <div className="flex flex-col w-full">
          <p className="font-bold text-zp-md">함께한 시공업자들</p>
          <p className="text-zp-xs text-zp-light-gray">
            + 버튼을 클릭하여 함께한 시공업자들을 추가해주세요
          </p>
          <div className="flex justify-center">
            <CiCirclePlus
              style={{ color: 'gray' }}
              size={24}
              onClick={() => setIsWorkerModalOpen(true)}
              className="cursor-pointer"
            />
          </div>
          {selectedWorkers.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {selectedWorkers.map((worker) => (
                <div className="pointer-events-none">
                  <WorkerInfoListItem
                    key={worker.portfolio_serial}
                    worker={worker}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full mt-10">
          <Button
            children="확인"
            buttonType="second"
            width="full"
            height={2}
            fontSize="xl"
            radius="btn"
            onClick={handleConfirm}
          />
        </div>
      </div>

      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-opacity-50 bg-zp-black">
          <div className="p-6 bg-zp-white rounded-zp-radius-big">
            <div className="flex items-center justify-between mb-4">
              <p className="absolute font-bold transform -translate-x-1/2 left-1/2 text-zp-lg">
                시공업자 선택
              </p>
            </div>

            <p className="mt-6 font-bold text-zp-xs">
              시공업자의 이름을 검색하여 추가하고 확인 버튼을 눌러주세요
            </p>

            <div className="relative flex items-center justify-center mt-6 font-bold">
              <Input
                type="text"
                placeholder="시공업자의 이름을 입력해주세요"
                inputType="login"
                width="14rem"
                height={2}
                className="pr-10 mb-4"
                fontSize="xs"
                radius="none"
                value={keyword}
                onChange={(e: React.ChangeEvent) =>
                  setKeyword((e.target as HTMLInputElement).value)
                }
              />
              <HiMagnifyingGlass
                className="absolute transform -translate-y-1/2 right-2 top-1/2"
                onClick={searchWorker}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 overflow-y-auto max-h-96">
              {workerList &&
                workerList.map((worker) => (
                  <div key={worker.portfolio_serial} className="relative ">
                    <div className="pointer-events-none">
                      <WorkerInfoListItem worker={worker} />
                    </div>
                    <div
                      className="absolute cursor-pointer top-2 right-2"
                      onClick={() => handleWorkerSelect(worker)}
                    >
                      {tempSelectedWorkers.includes(worker) ? (
                        <FaRegCircleCheck
                          size={24}
                          className="text-green-500"
                        />
                      ) : (
                        <FaRegCircle size={24} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              <div className="font-bold">
                <Button
                  children="취소"
                  buttonType="light"
                  width="7rem"
                  height={2}
                  fontSize="2xs"
                  radius="full"
                  onClick={() => {
                    setIsWorkerModalOpen(false);
                    setKeyword('');
                  }}
                />
              </div>
              <div className="font-bold">
                <Button
                  children="확인"
                  buttonType="second"
                  width="7rem"
                  height={2}
                  fontSize="2xs"
                  radius="full"
                  onClick={handleWorkerModalConfirm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
