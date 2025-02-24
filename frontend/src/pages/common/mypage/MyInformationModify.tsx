import { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { GoArrowLeft } from 'react-icons/go';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Input from '@components/common/Input';
import { useMyPageStore } from '@stores/myPageStore';

export default function MyInformationModify() {
  const navigate = useNavigate();

  const {
    role,
    nickname,
    phoneNumber,
    address,
    fetchMyPageData,
    updateCustomerInfo,
    updateWorkerInfo,
  } = useMyPageStore();

  const userType = role === 'worker' ? 'worker' : 'customer';

  const [localNickname, setLocalNickname] = useState(nickname || '');
  const [phone, setPhone] = useState(phoneNumber || '');
  const [userAddress, setUserAddress] = useState(address || '');
  const [businessNumber, setBusinessNumber] = useState('123-45-67890');
  const [locationDetails] = useState<string[]>([]);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const [nicknameError, setNicknameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    fetchMyPageData();
  }, [fetchMyPageData]);

  useEffect(() => {
    setLocalNickname(nickname);
    setPhone(phoneNumber);
    setUserAddress(address);
  }, [nickname, phoneNumber, address]);

  const handleGoBack = () => {
    navigate('/mypage');
  };

  const handleSubmit = async () => {
    if (userType === 'customer' && !localNickname)
      setNicknameError('닉네임을 적어주세요');
    else setNicknameError('');

    if (!phone) setPhoneError('휴대폰 번호를 적어주세요');
    else setPhoneError('');

    if (userType === 'customer' && !userAddress)
      setAddressError('자택 주소를 적어주세요');
    else setAddressError('');

    if (
      (userType === 'customer' && localNickname && phone && userAddress) ||
      (userType === 'worker' && phone)
    ) {
      if (userType === 'customer') {
        await updateCustomerInfo(phone, localNickname, userAddress);
      } else if (userType === 'worker') {
        const locationList = locationDetails.map((location) => {
          const [city, district] = location.split(' ');
          return {
            sidoCode: 0,
            gugunCode: 0,
            localName: `${city} ${district}`,
          };
        });
        await updateWorkerInfo(phone, locationList);
      }

      navigate('/mypage');
    }
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? ', ' : '') + data.buildingName;
      }
      fullAddress += extraAddress !== '' ? `(${extraAddress})` : '';
    }

    setUserAddress(fullAddress);
    setIsPostcodeOpen(false);
  };

  return (
    <>
      <div className="flex items-start justify-center min-h-screen p-6">
        <div className="w-full">
          <div className="relative flex items-center justify-between w-full h-12 mt-12">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
                size={20}
              />
            </div>
            <div className="absolute font-bold text-center transform -translate-x-1/2 left-1/2 text-zp-lg">
              내 정보 수정하기
            </div>
          </div>

          {userType === 'customer' && (
            <>
              <div className="mt-6 font-bold text-zp-sm text-zp-gray">
                닉네임
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputType="normal"
                  placeholder="닉네임을 입력하세요"
                  value={localNickname}
                  onChange={(e) => setLocalNickname(e.target.value)}
                  width="full"
                  height={2}
                  fontSize="sm"
                  radius="btn"
                />
                <IoIosClose
                  className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-8"
                  onClick={() => setLocalNickname('')}
                  style={{ width: '24px', height: '24px' }}
                />
                {nicknameError && (
                  <div className="mt-1 font-bold text-zp-red text-zp-xs">
                    {nicknameError}
                  </div>
                )}
              </div>

              <div className="mt-6 font-bold text-zp-sm text-zp-gray">
                자택 주소
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pr-10 mt-2 font-bold border text-zp-sm text-zp-black bg-zp-light-beige border-zp-sub-color rounded-zp-radius-big focus:border-zp-main-color"
                  placeholder="자택 주소를 입력하세요"
                  value={userAddress}
                  onClick={() => setIsPostcodeOpen(true)}
                  readOnly
                />
                <IoIosClose
                  className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-8"
                  onClick={() => setUserAddress('')}
                  style={{ width: '24px', height: '24px' }}
                />
                {addressError && (
                  <div className="mt-1 font-bold text-zp-red text-zp-xs">
                    {addressError}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-6 font-bold text-zp-sm text-zp-gray">
            휴대폰 번호
          </div>
          <div className="relative">
            <input
              className="w-full h-12 px-4 pr-10 mt-2 font-bold border text-zp-sm text-zp-black bg-zp-light-beige border-zp-sub-color rounded-zp-radius-big focus:border-zp-main-color"
              placeholder="010-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <IoIosClose
              className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-8"
              onClick={() => setPhone('')}
              style={{ width: '24px', height: '24px' }}
            />
            {phoneError && (
              <div className="mt-1 font-bold text-zp-red text-zp-xs">
                {phoneError}
              </div>
            )}
          </div>

          {userType === 'worker' && (
            <>
              <div className="mt-6 font-bold text-zp-sm text-zp-gray">
                활동 지역
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pr-10 mt-2 font-bold border text-zp-sm text-zp-black bg-zp-light-beige border-zp-sub-color rounded-zp-radius-big focus:border-zp-main-color"
                  placeholder="활동 지역을 입력하세요"
                  value={locationDetails.join(', ')}
                  readOnly
                />
              </div>

              <div
                className="flex items-center justify-center w-full h-10 mt-6 font-bold cursor-pointer text-zp-sm bg-zp-sub-color rounded-zp-radius-btn"
                onClick={() => navigate('/mypage/workerinfolocationdetail')}
              >
                활동 지역 선택
              </div>

              <div className="mt-6 font-bold text-zp-sm text-zp-gray">
                사업자 등록 번호
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pr-10 mt-2 font-bold border text-zp-sm text-zp-black bg-zp-light-beige border-zp-sub-color rounded-zp-radius-big focus:border-zp-main-color"
                  placeholder="123-45-67890"
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                />
                <IoIosClose
                  className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-8"
                  onClick={() => setBusinessNumber('')}
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
            </>
          )}

          {isPostcodeOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-4 shadow-lg bg-zp-white rounded-zp-radius-btn">
                <DaumPostcode onComplete={handleComplete} />
                <button
                  className="w-full p-2 mt-2 font-bold text-white rounded-md bg-zp-sub-color rounded-zp-radius-btn"
                  onClick={() => setIsPostcodeOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          <div
            className="flex items-center justify-center w-full h-10 mt-6 font-bold cursor-pointer text-zp-sm bg-zp-sub-color rounded-zp-radius-btn"
            onClick={handleSubmit}
          >
            수정완료
          </div>
        </div>
      </div>
    </>
  );
}
