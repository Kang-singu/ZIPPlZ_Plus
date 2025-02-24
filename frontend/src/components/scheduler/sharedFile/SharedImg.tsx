import React, { useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { LuMaximize2, LuMinimize2 } from 'react-icons/lu';
import { MdCancel } from 'react-icons/md';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import { addImg, deleteImg, getOnePlan } from '@/apis/scheduler/schedulerApi';
import { useScheduleStore } from '@/stores/scheduleStore';

const customModalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  content: {
    maxWidth: '468px',
    minWidth: '350px',
    maxHeight: '468px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1500,
  },
};
Modal.setAppElement('#root');
interface Props {
  fileList: any;
  planSerial?: number;
}
export default function SharedImg({ fileList, planSerial }: Props) {
  const navigate = useNavigate();
  const { setPlan, setFileList } = useScheduleStore();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fetchPlan = async (planSerial: number) => {
    const response = await getOnePlan(planSerial);
    setPlan(response.data.data.plan);
    setFileList(response.data.data.fileList);
  };
  const handleUpload = async (file: File) => {
    if (planSerial) {
      await addImg(planSerial, file);
    }
  };
  const removeImg = async (fileSerial: number) => {
    if (planSerial) return await deleteImg(planSerial, fileSerial);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && planSerial) {
      await handleUpload(file);
      await fetchPlan(planSerial);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const openModal = function () {
    setModalIsOpen(true);
  };
  const closeModal = function () {
    setModalIsOpen(false);
  };
  const openFullscreenImage = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };
  const handleClickDeleteImg = (fileSerial: number) => {
    removeImg(fileSerial);
    if (planSerial) fetchPlan(planSerial);
    navigate(0);
  };
  return (
    <>
      <div className="relative w-full h-[5rem] flex flex-col bg-zp-white gap-1 justify-center items-center rounded-zp-radius-big p-2 min-h-[5rem] max-h-[7rem] drop-shadow-zp-slight">
        {fileList && fileList.length === 0 ? (
          <>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-[5rem] cursor-pointer hover:bg-gray-100 "
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <IoCloudUploadOutline size={28} />
                  <p className="font-bold text-center text-zp-gray text-zp-xs break-keep">
                    공유할 이미지를 업로드 해주세요
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <LuMaximize2
              className="absolute top-[10%] right-[5%] cursor-pointer"
              size="10%"
              onClick={openModal}
            />
            <div className="flex items-center justify-center w-full gap-4">
              <img
                className="w-[20%] aspect-square"
                src={fileList && fileList[0].saveFile}
                onClick={() => openFullscreenImage(fileList[0].saveFile)}
              />
              {fileList && fileList.length > 1 && (
                <img
                  className="w-[20%] aspect-square"
                  src={fileList[1].saveFile}
                  onClick={() => openFullscreenImage(fileList[1].saveFile)}
                />
              )}
              {fileList && fileList.length > 2 && (
                <img
                  className="w-[20%] aspect-square"
                  src={fileList[2].saveFile}
                  onClick={() => openFullscreenImage(fileList[2].saveFile)}
                />
              )}
              <div>
                <FiPlusCircle
                  className="w-auto h-auto cursor-pointer aspect-square"
                  onClick={handleClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <LuMinimize2
            className="absolute top-[1rem] right-[1rem] cursor-pointer"
            size={16}
            onClick={closeModal}
          />
          <hr className="absolute top-[3rem] w-full border border-zp-sub-color" />
          <div className="w-full mt-[4rem] px-[1rem] overflow-auto">
            <div className="grid grid-cols-3 gap-4">
              {fileList &&
                fileList.map((item: any) => (
                  <div
                    className="relative border aspect-square"
                    key={item.fileSerial}
                  >
                    <img
                      className="w-full h-full"
                      src={item.saveFile}
                      onClick={() => openFullscreenImage(item.saveFile)}
                    />
                    <MdCancel
                      size={12}
                      className="absolute top-0 right-0"
                      onClick={() => handleClickDeleteImg(item.fileSerial)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={fullscreenImage !== null}
          onRequestClose={closeFullscreenImage}
          style={customModalStyles}
        >
          <img
            src={fullscreenImage || ''}
            alt="Fullscreen"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onClick={closeFullscreenImage}
          />
        </Modal>
      </div>
    </>
  );
}
