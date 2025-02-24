import { useState } from 'react';
import { LuMaximize2, LuMinimize2 } from 'react-icons/lu';
import Modal from 'react-modal';

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
interface Props {
  sharedContents: string | null | undefined;
}
Modal.setAppElement('#root');
export default function SharedMemo({ sharedContents }: Props) {
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const openListModal = function () {
    setIsListModalOpen(true);
  };
  const closeListModal = function () {
    setIsListModalOpen(false);
  };
  return (
    <>
      <div className="relative w-full h-[5rem] flex flex-col bg-zp-white gap-1 justify-center items-center rounded-zp-radius-big p-4 drop-shadow-zp-slight">
        {!sharedContents ? (
          <div className="w-full h-full text-zp-2xs text-zp-light-gray">
            <p>공유 사항을 추가해주세요.</p>
          </div>
        ) : (
          <>
            <LuMaximize2
              className="absolute top-[10%] right-[5%] cursor-pointer"
              size="10%"
              onClick={openListModal}
            />
            <p
              className="bg-zp-yellow bg-opacity-40 text-center text-zp-2xs text-wrap p-0.5 overflow-hidden truncate"
              onClick={openListModal}
            >
              {sharedContents}
            </p>
          </>
        )}
        <Modal
          isOpen={isListModalOpen}
          onRequestClose={closeListModal}
          style={customModalStyles}
        >
          <LuMinimize2
            className="absolute top-[1rem] right-[1rem] cursor-pointer"
            size={16}
            onClick={closeListModal}
          />
          <hr className="absolute top-[3rem] w-full border border-zp-sub-color" />
          <div className="flex flex-col gap-[1rem] w-full mt-[4rem] overflow-auto">
            <>
              <div className="relative flex flex-col p-[1rem] max-w-[24rem] h-[7rem] bg-zp-yellow bg-opacity-40 gap-[0.5rem]">
                <div className="flex items-start justify-end "></div>
                <p className="text-zp-2xs text-wrap">{sharedContents}</p>
              </div>
            </>
          </div>
        </Modal>
      </div>
    </>
  );
}
