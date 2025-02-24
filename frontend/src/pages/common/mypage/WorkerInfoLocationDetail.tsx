import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Button from '@components/common/Button';

type Location = {
  city: string;
  district: string;
};

export default function WorkerInfoLocationDetail() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const navigate = useNavigate();
  const maxSelections: number = 8;

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
  };

  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);

    if (selectedCity) {
      const location: Location = { city: selectedCity, district };

      setSelectedLocations((prev) => {
        if (
          !prev.some(
            (loc) => loc.city === selectedCity && loc.district === district
          ) &&
          prev.length < maxSelections
        ) {
          return [...prev, location];
        }
        return prev;
      });
    }
  };

  const handleConfirmClick = () => {
    if (selectedLocations.length > 0) {
      navigate('/mypage/myinformationmodify', {
        state: { locations: selectedLocations },
      });
    }
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  const handleRemoveLocation = (index: number) => {
    setSelectedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const cityButtons: string[] = [
    '서울',
    '부산',
    '경기',
    '대전',
    '대구',
    '인천',
    '울산',
    '광주',
    '강원',
    '세종',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
  ];

  const districtMap: { [key: string]: string[] } = {
    서울: ['강남구', '강북구', '강서구'],
    부산: ['강서구', '금정구', '남구'],
    경기: ['수원시', '용인시', '성남시'],
    대전: ['동구', '중구', '서구'],
    대구: ['북구', '달서구', '수성구'],
    인천: ['남동구', '부평구', '연수구'],
    울산: ['중구', '남구', '동구'],
    광주: ['동구', '서구', '남구'],
    강원: ['춘천시', '원주시', '강릉시'],
    세종: ['조치원읍', '한솔동', '나성동'],
    충북: ['청주시', '충주시', '제천시'],
    충남: ['천안시', '공주시', '보령시'],
    전북: ['전주시', '군산시', '익산시'],
    전남: ['목포시', '여수시', '순천시'],
    경북: ['포항시', '경주시', '김천시'],
    경남: ['창원시', '진주시', '통영시'],
    제주: ['제주시', '서귀포시'],
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex-1 ml-5 font-bold text-center">
            작업 지역 선택
          </div>
          <IoIosClose
            size={40}
            onClick={handleClose}
            className="cursor-pointer"
          />
        </div>

        {/* 밑줄 */}
        <hr className="p-2 my-2" />

        <div className="grid grid-cols-4 gap-4 mb-4">
          {cityButtons.map((city, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded border ${
                selectedCity === city
                  ? 'rounded-zp-radius-btn bg-zp-sub-color border-zp-main-color'
                  : 'rounded-zp-radius-btn border-zp-main-color'
              } focus:outline-none focus:ring-2`}
              onClick={() => handleCityClick(city)}
            >
              {city}
            </button>
          ))}
        </div>

        {/* 밑줄 */}
        <hr className="p-2 my-2" />

        <div className="grid grid-cols-4 gap-4 mb-4">
          {selectedCity &&
            districtMap[selectedCity].map((district, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded border ${
                  selectedDistrict === district
                    ? 'rounded-zp-radius-btn bg-zp-sub-color border-zp-main-color'
                    : 'rounded-zp-radius-btn border-zp-main-color'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onClick={() => handleDistrictClick(district)}
              >
                {district}
              </button>
            ))}
        </div>

        {/* 밑줄 */}
        <hr className="p-2" />

        <div className="flex flex-wrap mb-4">
          {selectedLocations.map((location, index) => (
            <div
              key={index}
              className="flex items-center p-2 mb-2 mr-2 space-x-2 font-bold bg-gray-200 cursor-pointer text-zp-white bg-zp-main-color rounded-zp-radius-big"
              onClick={() => handleRemoveLocation(index)}
            >
              <span>
                {location.city} {location.district}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-4 font-bold text-zp-lg text-zp-light-gray">
          <span>
            {selectedLocations.length}/{maxSelections}
          </span>
        </div>

        <div className="flex items-center justify-between h-20 space-x-2 font-bold first-letter:mb-4">
          <Button
            children="초기화"
            buttonType="second"
            width={8.125}
            height={3.75}
            fontSize="xl"
            radius="btn"
            onClick={() => {
              setSelectedCity(null);
              setSelectedDistrict(null);
              setSelectedLocations([]);
            }}
          />

          <Button
            children="확인"
            buttonType="primary"
            width={25.625}
            height={3.75}
            fontSize="xl"
            radius="btn"
            onClick={handleConfirmClick}
          />
        </div>
      </div>
    </div>
  );
}
