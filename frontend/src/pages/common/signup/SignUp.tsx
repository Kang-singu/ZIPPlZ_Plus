import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Customer, User, Worker, socialUser } from '@apis/member/MemberApi';
import SignBottom from '@components/signup/SignBottom';
import SignUpHead from '@components/signup/SignUpHead';

import SignUpAgree from './common/SignUpAgree';
import SignUpExtraInfo from './common/SignUpExtraInfo';
import SignUpInfo from './common/SignUpInfo';
import SignUpSelectType from './common/SignUpSelectType';
import SignUpNickName from './customer/SignUpNickName';
import SignUpWorkerDetail from './worker/SignUpWorkerDetail';
import SignUpWorkerRegion from './worker/SignUpWorkerRegion';
import SignUpWorkerSkill from './worker/SignUpWorkerSkill';

export default function SignUp() {
  const { order, type, phrase } = useParams<{
    order?: string;
    type?: string;
    phrase?: string;
  }>();
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    userName: '',
    birthDate: '',
    tel: '',
  });
  const [socialUser, setSocialUser] = useState<socialUser>({
    userName: '',
    birthDate: '',
    tel: '',
  });
  const [customer, setCustomer] = useState<Customer>({
    userSerial: 0,
    nickname: '',
  });
  const [worker, setWorker] = useState<Worker>({
    userSerial: 0,
    locationList: [],
    fieldList: [],
    businessNumber: '',
    company: '',
    companyAddress: '',
  });
  const orderNumber: number = order ? parseInt(order) : 0;
  const [next, setNext] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [link, setLink] = useState<string>('');

  return (
    <div className="w-full relative  bg-zp-white  min-h-screen p-4 gap-4 flex flex-col  max-w-[600px] ">
      <SignUpHead />
      {orderNumber === 2 && type === 'common' && phrase === 'info' && (
        <SignUpInfo setActive={setActive} setLink={setLink} setUser={setUser} />
      )}
      {orderNumber === 2 &&
        type === 'common' &&
        (phrase === 'type' || phrase === 'extratype') && (
          <SignUpSelectType
            setNext={setNext}
            setLink={setLink}
            phrase={phrase}
          />
        )}
      {orderNumber === 3 &&
        (phrase === 'nickname' || phrase === 'extranickname') && (
          <SignUpNickName
            setLink={setLink}
            setNext={setNext}
            setCustomer={setCustomer}
          />
        )}
      {(phrase === 'agree' || phrase === 'extra-agree') && (
        <SignUpAgree setLink={setLink} setNext={setNext} phrase={phrase} />
      )}
      {(phrase === 'detail' || phrase === 'extradetail') &&
        type === 'worker' && (
          <SignUpWorkerDetail
            setNext={setNext}
            setLink={setLink}
            setWorker={setWorker}
            phrase={phrase}
            worker={worker}
          />
        )}
      {(phrase === 'skills' || phrase === 'extraskills') &&
        type === 'worker' && (
          <SignUpWorkerSkill
            setNext={setNext}
            setLink={setLink}
            setWorker={setWorker}
          />
        )}
      {(phrase === 'region' || phrase === 'extraregion') &&
        type === 'worker' && (
          <SignUpWorkerRegion
            setNext={setNext}
            setLink={setLink}
            setWorker={setWorker}
            phrase={phrase}
          />
        )}
      {phrase === 'extrainfo' && type === 'common' && orderNumber === 2 && (
        <SignUpExtraInfo
          setNext={setNext}
          setLink={setLink}
          setSocialUser={setSocialUser}
        />
      )}
      <SignBottom
        order={orderNumber}
        phrase={phrase || ''}
        active={active}
        next={next}
        link={link}
        setNext={setNext}
        setActive={setActive}
        setCustomer={setCustomer}
        setWorker={setWorker}
        user={user}
        socialUser={socialUser}
        type={type}
        customer={customer}
        worker={worker}
      />
    </div>
  );
}
