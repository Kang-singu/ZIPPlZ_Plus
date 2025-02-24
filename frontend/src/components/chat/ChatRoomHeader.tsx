import { CiMenuKebab } from 'react-icons/ci';
import { IoIosArrowBack } from 'react-icons/io';
import { IoExitOutline, IoVideocamOutline } from 'react-icons/io5';
import { TiBusinessCard } from 'react-icons/ti';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import Badge from '@assets/certified-icon.svg?react';
import { useCurrentModals, useModalActions } from '@stores/modalStore';

type ChatRoomHeaderProps = {
  name: string;
  certificated: boolean;
  location: string;
  fieldName: string;
  imageUrl?: string;
  otherUserSerial: number;
  handleClickVideo: () => void;
};

export default function ChatRoomHeader({
  name,
  certificated,
  location,
  fieldName,
  imageUrl,
  otherUserSerial,
  handleClickVideo,
}: ChatRoomHeaderProps) {
  const navigate = useNavigate();
  const currentModals = useCurrentModals();
  const { closeModal, openModal } = useModalActions();

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-zp-light-orange">
      <div className="flex items-center gap-x-2">
        <button onClick={() => navigate('/')} aria-label="Back">
          <IoIosArrowBack size={16} fill="#111" />
        </button>
        <img
          src={imageUrl || 'path/to/placeholder-image.png'}
          alt="profile"
          className="w-12 h-12 rounded-zp-radius-full"
        />
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold truncate text-zp-md max-w-28">
              {name}
            </span>
            {certificated && <Badge />}
          </div>
          <div className="flex gap-2 text-zp-gray text-zp-2xs">
            <span className="truncate max-w-20">{fieldName}</span>|
            <span className="truncate max-w-30">{location}</span>
          </div>
        </div>
        <Modal
          isOpen={currentModals.includes('select')}
          onRequestClose={() => closeModal('select')}
          className="absolute right-0 overflow-hidden top-11 max-w-40 shadow-zp-deep rounded-zp-radius-big"
          style={{
            overlay: {
              backgroundColor: 'transparent',
              maxWidth: '600px',
              margin: '0 auto',
            },
          }}
        >
          <div className="w-full p-3 text-zp-2xs">
            <button
              onClick={() => {
                closeModal('select');
                navigate('/');
              }}
              className="flex items-center w-full p-1 border rounded-zp-radius-btn text-zp-gray hover:bg-zp-light-yellow bg-zp-white border-zp-sub-color text-zp-3xs"
            >
              <IoExitOutline size={18} className="mr-2" />
              <span>채팅방 나가기</span>
            </button>
            <button
              onClick={() => {
                closeModal('select');
                navigate(`/workers/${otherUserSerial}/portfolio`);
              }}
              className="flex items-center w-full p-1 border rounded-zp-radius-btn text-zp-gray hover:bg-zp-light-yellow bg-zp-white border-zp-sub-color text-zp-3xs"
            >
              <TiBusinessCard size={18} className="mr-2" />
              <span>포트폴리오 보기</span>
            </button>
          </div>
        </Modal>
      </div>
      <div className="relative flex gap-3">
        <button onClick={handleClickVideo} aria-label="Video Call">
          <IoVideocamOutline size={20} />
        </button>
        <button onClick={() => openModal('select')} aria-label="Options">
          <CiMenuKebab size={20} />
        </button>
      </div>
    </div>
  );
}
