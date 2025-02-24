import Modal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  height?: string;
}

export default function FullModal({
  isOpen,
  onRequestClose,
  children,
  maxWidth = '580px',
  height = '94%',
}: ModalProps) {
  return (
    <Modal
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 50,
        },
        content: {
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          maxWidth: maxWidth,
          height: height,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="box-border flex m-auto overflow-hidden rounded-zp-radius-big bg-zp-white drop-shadow-zp-normal"
      appElement={document.getElementById('root') || undefined}
      shouldCloseOnOverlayClick={true}
    >
      {children}
    </Modal>
  );
}
