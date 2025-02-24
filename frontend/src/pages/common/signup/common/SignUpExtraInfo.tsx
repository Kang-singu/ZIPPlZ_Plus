import { useEffect, useState } from 'react';

import { socialUser } from '@apis/member/MemberApi';
import Input from '@components/common/Input';
import DateInput from '@components/signup/DateInput';
import PhoneInput from '@components/signup/PhoneInput';

interface Props {
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  setSocialUser: React.Dispatch<React.SetStateAction<socialUser>>;
}
export default function SignUpExtraInfo({
  setNext,
  setLink,
  setSocialUser,
}: Props) {
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  function validateInfo() {
    if (name.length >= 2 && birthDate.length === 10 && phone.length === 13) {
      setLink('/member/join/common/2/extratype');
      return true;
    }
  }
  useEffect(() => {
    if (validateInfo()) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [name, birthDate, phone]);
  useEffect(() => {
    setSocialUser((prev: socialUser) => ({
      ...prev,
      birthDate: birthDate,
    }));
  }, [birthDate]);
  useEffect(() => {
    setSocialUser((prev: socialUser) => ({
      ...prev,
      tel: phone,
    }));
  }, [phone]);
  return (
    <div className="relative flex flex-col bg-zp-white w-full p-4 gap-4 overflow-auto mb-[9rem]">
      <p className="text-3xl font-bold">추가정보를 입력해주세요.</p>
      <p className="text-xl font-bold">이름</p>

      <Input
        type="text"
        inputType="signup"
        placeholder="이름을 입력하세요"
        width="full"
        height={2}
        onChange={(e: React.ChangeEvent) => {
          setSocialUser((prev: socialUser) => ({
            ...prev,
            userName: (e.target as HTMLInputElement).value,
          }));
          setName((e.target as HTMLInputElement).value);
        }}
        value={name}
        fontSize="sm"
        className="p-1"
        radius="none"
      />
      <p className="text-xl font-bold">생년월일</p>
      <DateInput
        value={birthDate}
        onChange={setBirthDate}
        placeholder="YYYY/MM/DD"
      />
      <p className="text-xl font-bold">전화번호</p>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        placeholder="010-0000-0000"
        inputType="signup"
        fontSize="sm"
        height={2}
        radius="none"
      />
    </div>
  );
}
