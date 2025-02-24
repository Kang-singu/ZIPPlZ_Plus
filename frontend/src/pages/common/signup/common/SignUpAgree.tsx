import React, { useEffect, useState } from 'react';

import Checkbox from '@components/common/Checkbox';

interface Props {
  setNext: React.Dispatch<React.SetStateAction<boolean>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  phrase: string;
}

export default function SignUpAgree({ setNext, setLink, phrase }: Props) {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [privateAgree, setPrivateAgree] = useState<boolean>(false);
  const [serviceAgree, setServiceAgree] = useState<boolean>(false);
  const [marketingAgree, setMarketingAgree] = useState<boolean>(false);

  const handleAllChange = () => {
    const allChecked = !(privateAgree && serviceAgree && marketingAgree);
    setPrivateAgree(allChecked);
    setServiceAgree(allChecked);
    setMarketingAgree(allChecked);
  };

  const handlePrivateChange = () => {
    setPrivateAgree((prev) => !prev);
  };

  const handleServiceChange = () => {
    setServiceAgree((prev) => !prev);
  };

  const handleMarketingChange = () => {
    setMarketingAgree((prev) => !prev);
  };

  useEffect(() => {
    if (serviceAgree && privateAgree) {
      setNext(true);
      if (phrase === 'extra-agree') setLink('/member/join/common/2/extrainfo');
      else setLink('/member/join/common/2/info');
    } else setNext(false);
  }, [privateAgree, serviceAgree, marketingAgree]);

  return (
    <div className="relative overflow-hidden max-h-screen p-4 mb-[6rem]">
      <pre className="mb-1 font-bold text-zp-xl font-noto">
        서비스 이용을 위한 동의 안내
      </pre>

      <div className="flex flex-col items-center justify-center w-full gap-4 mt-10">
        {showDetail && (
          <div className="w-full overflow-auto">
            <p className="font-bold text-zp-xs">서비스 이용약관</p>
            <pre className="py-3 text-zp-2xs font-noto text-zp-gray text-wrap">
              1. 서비스 가입 시 본 약관에 동의한 것으로 간주됩니다.{'\n'}2.
              사용자는 정확한 정보를 제공해야 하며, 허위 정보 제공 시 이용이
              제한될 수 있습니다.{'\n'}3. 사용자는 법을 준수하고, 비윤리적
              행위를 하지 않아야 합니다.{'\n'}4. 개인정보는 법에 따라 보호되며,
              서비스 이용 중 발생한 문제는 사용자가 책임집니다.
            </pre>
          </div>
        )}
        <p
          className="cursor-pointer text-zp-lg text-zp-light-gray"
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? '접기' : '약관 보기'}
        </p>
      </div>
      <div className="w-full fixed left-0 bottom-[7rem]">
        <div className="px-4 max-w-[600px] flex flex-col gap-4 mx-auto">
          <div className="flex items-center justify-between w-full">
            <p className="font-bold text-zp-lg">전체 동의</p>
            <Checkbox
              checked={privateAgree && serviceAgree && marketingAgree}
              onChange={handleAllChange}
            />
          </div>
          <hr className="my-4 text-zp-light-gray" />
          <div className="flex flex-col gap-4 ">
            <div className="flex items-center justify-between w-full">
              <p className="font-bold text-zp-md">[필수] 개인정보 처리방침</p>
              <Checkbox checked={privateAgree} onChange={handlePrivateChange} />
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="font-bold text-zp-md">
                [필수] Zip-plz 서비스 이용약관
              </p>
              <Checkbox checked={serviceAgree} onChange={handleServiceChange} />
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="font-bold text-zp-md">
                [선택] 마케팅 정보 수신 동의
              </p>
              <Checkbox
                checked={marketingAgree}
                onChange={handleMarketingChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
