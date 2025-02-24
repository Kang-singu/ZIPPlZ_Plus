import Modal from 'react-modal';

import { useCurrentModals, useModalActions } from '@stores/modalStore';

type ModalType = 'survey' | 'chatRooms' | 'select' | 'mini' | null;

interface ModalProps {
  type: ModalType;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
}

export default function ModalComponent({
  type,
  title,
  message,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  onConfirm,
}: ModalProps) {
  const openModals = useCurrentModals();
  const { closeModal } = useModalActions();

  const isOpen = openModals.includes(type);

  const handleRequestClose = () => {
    closeModal(type);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
        },
        content: {
          maxWidth: '90vw',
          width: 'auto',
          maxHeight: '90vh',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      appElement={document.getElementById('root') || undefined}
      className="flex flex-col px-10 py-6 rounded-zp-radius-big bg-zp-white drop-shadow-zp-normal"
    >
      <h2 className="mb-4 font-bold text-center text-zp-2xl">{title}</h2>
      <p className="mb-6 text-center text-zp-sm break-keep">{message}</p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={handleRequestClose}
          className="px-4 py-2 text-zp-gray rounded-zp-radius-btn bg-zp-light-beige hover:text-zp-black"
        >
          {cancelButtonText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            handleRequestClose();
          }}
          className="px-4 py-2 text-zp-gray rounded-zp-radius-btn bg-zp-sub-color hover:text-zp-black"
        >
          {confirmButtonText}
        </button>
      </div>
    </Modal>
  );
}
