import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import {
  Customer,
  User,
  Worker,
  signUp,
  signUpCustomer,
  signUpWorker,
  socialSignUp,
  socialUser,
} from '@apis/member/MemberApi';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';

interface Props {
  order: number;
  active: boolean;
  next: boolean;
  phrase?: string;
  link: string;
  user: User;
  socialUser: socialUser;
  type?: string;
  customer: Customer;
  worker: Worker;
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  setWorker: React.Dispatch<React.SetStateAction<Worker>>;
}
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
    maxHeight: '300px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1500,
  },
};
Modal.setAppElement('#root');
export default function SignBottom({
  order,
  active,
  next,
  phrase,
  link,
  user,
  socialUser,
  setNext,
  setActive,
  type,
  setCustomer,
  customer,
  setWorker,
  worker,
}: Props) {
  const [userSerial, setUserSerial] = useState<number>(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const openModal = function () {
    setModalIsOpen(true);
  };
  const closeModal = function () {
    setModalIsOpen(false);
  };
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setModalIsOpen(true);
    }, 3000);
  };
  const registUser = async (user: User) => {
    const response = await signUp(user);
    setUserSerial(response.data.data.userSerial);
  };
  const registSocialUser = async (user: socialUser) => {
    const response = await socialSignUp(user);

    setUserSerial(response.data.data.userSerial);
  };
  const registCustomer = async (customer: Customer) => {
    const response = await signUpCustomer(customer);
    return response.data;
  };
  const registWorker = async (worker: Worker) => {
    const response = await signUpWorker(worker);
    return response.data;
  };
  useEffect(() => {
    if (type === 'customer') {
      setCustomer((prev: Customer) => ({
        ...prev,
        userSerial: userSerial,
      }));
    } else {
      setWorker((prev: Worker) => ({
        ...prev,
        userSerial: userSerial,
      }));
    }
  }, [userSerial]);
  return (
    <>
      <div className="absolute bottom-0 left-0 flex flex-col w-full gap-2 p-4">
        <div className="grid grid-cols-3 gap-0 w-full h-[0.5rem] bg-zp-light-beige">
          <div className="bg-zp-sub-color" />
          <div
            className={order > 1 ? 'bg-zp-sub-color' : 'bg-zp-light-beige'}
          />
          <div
            className={order > 2 ? 'bg-zp-sub-color' : 'bg-zp-light-beige'}
          />
        </div>
        {order === 2 && phrase === 'info' && (
          <Button
            buttonType={active ? 'second' : 'light'}
            radius="btn"
            width="full"
            height={3}
            children="인증"
            fontSize="lg"
            disabled={!active}
            onClick={handleClick}
          />
        )}
        <Button
          buttonType={next ? 'second' : 'light'}
          radius="btn"
          width="full"
          height={3}
          children={
            order < 3 ||
            (phrase !== 'nickname' &&
              phrase !== 'skills' &&
              phrase !== 'extranickname' &&
              phrase !== 'extraskills')
              ? '다음'
              : '회원가입 완료'
          }
          fontSize="lg"
          disabled={!next}
          onClick={() => {
            setNext(false);
            setActive(false);
            if (phrase === 'extrainfo') {
              navigate(link);
            } else {
              if (
                order < 3 ||
                (phrase !== 'nickname' &&
                  phrase !== 'skills' &&
                  phrase !== 'extranickname' &&
                  phrase !== 'extraskills')
              )
                navigate(link);
              else {
                if (phrase == 'nickname' || phrase == 'skills')
                  registUser(user);
                else registSocialUser(socialUser);
                openModal();
              }
            }
          }}
        />
      </div>
      {isLoading && <Loading />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <p className="absolute top-[1rem] left-0 text-zp-2xl font-bold w-full text-center">
          {active ? '인증 완료' : '회원가입 완료'}
        </p>
        <div className="w-full flex flex-col mt-[4rem] items-center gap-6">
          <div className="flex flex-col items-center w-full ">
            <p className="font-bold text-center text-zp-xl">
              {!active && '회원가입이 완료되었습니다.'}
            </p>
            <p className="font-bold text-center text-zp-xl">
              {active
                ? '인증이 완료되었습니다.'
                : '로그인 페이지로 이동하시겠습니까?'}
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
              if (active) {
                setActive(false);
                setNext(true);
                closeModal();
              } else {
                if (type === 'customer') {
                  registCustomer(customer);
                } else {
                  registWorker(worker);
                }
                navigate(link);
              }
            }}
          />
        </div>
      </Modal>
    </>
  );
}
