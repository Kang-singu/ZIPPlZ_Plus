import { PiChatsCircleFill } from 'react-icons/pi';

import Circle from '@assets/gradient-circle.svg?react';
import { useCurrentModals, useModalActions } from '@stores/modalStore';

export default function FloatingChatButton() {
  const { openModal, closeModal } = useModalActions();
  const currentModals = useCurrentModals();

  const handleToggleModal = () => {
    if (currentModals.includes('chatRooms')) {
      closeModal('chatRooms');
    } else {
      openModal('chatRooms');
    }
  };

  return (
    <>
      <button
        onClick={handleToggleModal}
        className="z-50 fixed right-4 drop-shadow-zp-normal hover:drop-shadow-zp-deep bottom-[120px] p-1 -m-1"
      >
        <Circle />
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <PiChatsCircleFill size={20} />
        </div>
      </button>
    </>
  );
}
