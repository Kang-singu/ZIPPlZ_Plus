import React, { useState } from 'react';

import Button from '@components/common/Button';
import Input from '@components/common/Input';
import PhoneInput from '@components/signup/PhoneInput';

export default function FindPw() {
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  console.log(id, email);
  const [phone, setPhone] = useState<string>('');
  return (
    <>
      <div className="flex flex-col gap-4">
        <Input
          inputType="normal"
          placeholder="아이디"
          width="full"
          height={3}
          fontSize="sm"
          radius="btn"
          type="text"
          onChange={(e: React.ChangeEvent) => {
            setId((e.target as HTMLInputElement).value);
          }}
        />
        <Input
          inputType="normal"
          placeholder="이메일"
          width="full"
          height={3}
          fontSize="sm"
          radius="btn"
          type="text"
          onChange={(e: React.ChangeEvent) => {
            setEmail((e.target as HTMLInputElement).value);
          }}
        />
        <PhoneInput
          inputType="normal"
          placeholder="휴대폰 번호"
          height={3}
          fontSize="sm"
          value={phone}
          onChange={setPhone}
          radius="btn"
        />
        <Button
          buttonType="primary"
          width="full"
          height={3}
          children="확인"
          radius="btn"
          fontSize="lg"
        />
      </div>
    </>
  );
}
