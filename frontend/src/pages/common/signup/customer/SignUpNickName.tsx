import React, { useEffect, useState } from 'react';

import { Customer } from '@apis/member/MemberApi';
import Input from '@components/common/Input';

interface Props {
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}
export default function SignUpNickName({
  setNext,
  setLink,
  setCustomer,
}: Props) {
  const [nickName, setNickName] = useState<string>('');
  setLink('/member/login');
  useEffect(() => {
    if (nickName) setNext(true);
    else setNext(false);
  });
  return (
    <>
      <p className="w-full font-bold text-zp-xl">닉네임</p>
      <Input
        inputType="signup"
        type="text"
        placeholder="닉네임을 입력하세요."
        fontSize="xl"
        width="full"
        height={2}
        radius="none"
        value={nickName}
        onChange={(e: React.ChangeEvent) => {
          setCustomer((prev: Customer) => ({
            ...prev,
            nickname: (e.target as HTMLInputElement).value,
          }));
          setNickName((e.target as HTMLInputElement).value);
        }}
      />
    </>
  );
}
