// import { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
// import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

// import Button from '@components/common/Button';

// interface Props {
//   type: string;
// }

// const customModalStyles: ReactModal.Styles = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 1000,
//   },
//   content: {
//     maxWidth: '468px',
//     minWidth: '350px',
//     maxHeight: '300px',
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     borderRadius: '1rem',
//     backgroundColor: 'white',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     padding: '16px',
//     zIndex: 1500,
//   },
// };
export default function SignUpHead() {
  //({ type }: Props) {
  const navigate = useNavigate();
  // const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  // const openModal = function () {
  //   setModalIsOpen(true);
  // };
  // const closeModal = function () {
  //   setModalIsOpen(false);
  // };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <IoIosArrowRoundBack
          size={27}
          className="cursor-pointer text-zp-gray"
          onClick={() => navigate(-1)}
        />
        {/* {type === 'worker' && (
          <p
            className="cursor-pointer text-zp-light-gray text-zp-2xl"
            onClick={() => openModal()}
          >
            건너뛰기
          </p>
        )} */}
      </div>
      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <p className="absolute top-[1rem] left-0 text-zp-2xl font-bold w-full text-center">
          건너뛰시겠습니까?
        </p>
        <div className="w-full flex flex-col mt-[4rem] items-center gap-6">
          <div className="flex flex-col items-center w-full ">
            <p className="font-bold text-center text-zp-xl">
              포트폴리오를 작성할 때,
            </p>
            <p className="font-bold text-center text-zp-xl">
              해당 추가정보를 입력할 수 있습니다.
            </p>
          </div>
          <Button
            buttonType="second"
            children="확인"
            width={8}
            height={3}
            fontSize="xl"
            radius="big"
            onClick={() => {
              closeModal();
              navigate('/member/join/common/3/agree');
            }}
          />
        </div>
      </Modal> */}
    </>
  );
}
