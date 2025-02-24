import React, { useState } from 'react';

import {
  HammerandWrench,
  HammerandWrenchFilled,
  Telescope,
  TelescopeFilled,
} from '@assets/svg/icons';

interface Props {
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  phrase: string;
}

export default function SignUpSelectType({ setNext, setLink, phrase }: Props) {
  const [userType, setUserType] = useState<string>('');
  const [isUserHovered, setIsUserHovered] = useState<boolean>(false);
  const [isWorkerUserHovered, setIsWorkerHovered] = useState<boolean>(false);
  return (
    <>
      <p className="w-full font-bold text-zp-xl">회원 유형</p>
      <div className="w-full max-w-[600px] absolute top-1/4 left-0  flex justify-center items-center  gap-4 px-4">
        <div
          className={`flex flex-col justify-center items-center border rounded-zp-radius-btn border-zp-main-color gap-4 p-10 cursor-pointer hover:bg-zp-sub-color ${userType === 'customer' ? 'bg-zp-sub-color' : ''}`}
          onMouseEnter={() => setIsUserHovered(true)}
          onMouseLeave={() => setIsUserHovered(false)}
          onClick={() => {
            setNext(true);
            if (phrase === 'extratype')
              setLink('/member/join/customer/3/extranickname');
            else setLink('/member/join/customer/3/nickname');
            setUserType('customer');
          }}
        >
          {isUserHovered || userType === 'customer' ? (
            <TelescopeFilled width={'6rem'} height={'6rem'} />
          ) : (
            <Telescope width={'6rem'} height={'6rem'} />
          )}
          <p className="text-center text-zp-2xs text-zp-gray">
            집을 꾸미고 싶어요!
          </p>
          <p className="font-bold text-zp-2xl">고객</p>
        </div>
        <div
          className={`flex flex-col justify-center items-center border rounded-zp-radius-btn border-zp-main-color gap-4 p-10 cursor-pointer hover:bg-zp-sub-color ${userType === 'worker' ? 'bg-zp-sub-color' : ''}`}
          onMouseEnter={() => setIsWorkerHovered(true)}
          onMouseLeave={() => setIsWorkerHovered(false)}
          onClick={() => {
            setNext(true);
            if (phrase === 'extratype')
              setLink('/member/join/worker/3/extradetail');
            else setLink('/member/join/worker/3/detail');
            setUserType('worker');
          }}
        >
          {isWorkerUserHovered || userType === 'worker' ? (
            <HammerandWrenchFilled width={'6rem'} height={'6rem'} />
          ) : (
            <HammerandWrench width={'6rem'} height={'6rem'} />
          )}
          <p className="text-center text-zp-2xs text-zp-gray">
            고객을 찾고 싶어요!
          </p>
          <p className="font-bold text-zp-2xl">시공업자</p>
        </div>
      </div>
    </>
  );
}
