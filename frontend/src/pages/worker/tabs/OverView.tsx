import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { FaImage } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaCamera } from 'react-icons/fa6';
import { FiPlusCircle } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi2';
import { IoArrowBackSharp } from 'react-icons/io5';
import { PiNotePencil } from 'react-icons/pi';
import { RiMessage2Line } from 'react-icons/ri';
import { TbBuildingCommunity } from 'react-icons/tb';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';

import { checkBusiness } from '@/apis/member/MemberApi';
import {
  addPortfolioImg,
  getPortfolioDetail,
  updatePortfolio,
} from '@/apis/worker/PortfolioApi';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { PortfolioDetail, usePortfolioStore } from '@/stores/portfolioStore';
import type { data } from '@/types';
import NothingIcon from '@assets/nothing-icon.svg?react';

const postCodeStyle = {
  width: '200px',
  height: '30rem',
  zIndex: 200,
};
const customModalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    pointerEvents: 'auto',
  },
  content: {
    maxWidth: '468px',
    minWidth: '350px',
    height: '30rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1rem',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 150,
    pointerEvents: 'auto',
  },
};

interface Props {
  portfolio: PortfolioDetail;
}
export default function OverView({ portfolio }: Props) {
  const [openDaum, setOpenDaum] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { loginUser } = useLoginUserStore();
  const navigate = useNavigate();
  const modifyPortfolio = async (data: data) => {
    return await updatePortfolio(portfolio.portfolioSerial, data);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asPeriod, setAsPeriod] = useState<number>(portfolio.asPeriod);
  const [career, setCareer] = useState<number>(portfolio.career);
  const [company, setCompany] = useState<string>(portfolio.worker.company);
  const [companyAddress, setCompanyAddress] = useState<string>(
    portfolio.worker.companyAddress
  );
  const [businessNumber, setBusinessNumber] = useState<string>(
    portfolio.worker.businessNumber
  );
  const [publicRelation, setPublicRelation] = useState<string>(
    portfolio.publicRelation
  );
  const handleUpload = async (file: File) => {
    if (portfolio) {
      return await addPortfolioImg(portfolio.portfolioSerial, file);
    }
  };
  const { setPortfolioOverview } = usePortfolioStore();
  const fetchPortFolioOverView = async (portfolioSerial: number) => {
    const response = await getPortfolioDetail(portfolioSerial);
    setPortfolioOverview(response.data.data);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && portfolio) {
      await handleUpload(file);
      await fetchPortFolioOverView(portfolio.portfolioSerial);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const onCompletePost = (data: any) => {
    setCompanyAddress(data.address);
    setOpenDaum(false);
  };
  const handleCloseModal = () => {
    setPublicRelation(portfolio.publicRelation);
    setAsPeriod(portfolio.asPeriod);
    setCareer(portfolio.career);
    setCompany(portfolio.worker.company);
    setCompanyAddress(portfolio.worker.companyAddress);
    setBusinessNumber(portfolio.worker.businessNumber);
    setIsModalOpen(false);
  };
  const handleSave = () => {
    if (isOk) {
      modifyPortfolio({
        publicRelation,
        career,
        asPeriod,
        company,
        companyAddress,
        businessNumber,
      });
    } else {
      modifyPortfolio({
        publicRelation,
        career,
        asPeriod,
        company,
        companyAddress,
        businessNumber: '',
      });
    }
    handleCloseModal();
    navigate(0);
  };
  useEffect(() => {
    if (isOk) setIsOk(false);
  }, [businessNumber]);
  const [isOk, setIsOk] = useState<boolean>(false);
  const checkBusinessNumber = async (data: string) => {
    const inputData: any = {
      b_no: [data],
    };
    const response = await checkBusiness(JSON.stringify(inputData));
    if ('match_cnt' in response.data) {
      setIsOk(true);
    } else {
      setIsOk(false);
    }
  };
  return (
    <>
      <IoArrowBackSharp
        size={20}
        onClick={() => navigate(-1)}
        className="absolute top-[3.5rem] cursor-pointer"
      />
      <div className="flex flex-col w-full gap-4">
        {id && loginUser?.userSerial === parseInt(id) && (
          <div className="flex justify-end">
            <PiNotePencil
              onClick={handleOpenModal}
              className="cursor-pointer"
              size={24}
            />
          </div>
        )}
        <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
          <div className="flex items-center gap-1">
            <HiOutlineUser size={16} />
            <p className="font-bold text-zp-sm">기본 프로필</p>
          </div>
          <div className="flex w-full gap-4 pl-4 mt-4">
            <div className="flex flex-col gap-2 pr-6 font-bold border-r text-zp-gray text-zp-xs border-r-zp-sub-color">
              {['나이', 'E-Mail', '경력', 'A/S 기간'].map((label, index) => (
                <p key={index}>{label}</p>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-zp-gray text-zp-xs">
              <p>
                {2024 - parseInt(portfolio.user.birthDate.split('-')[0])} 세
              </p>
              <p>{portfolio.user.email}</p>
              <p>{portfolio.career} 년</p>
              <p>{portfolio.asPeriod} 년</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
          <div className="flex items-center gap-1">
            <FaCamera size={16} />
            <p className="font-bold text-zp-sm">작업 이미지</p>
          </div>
          <div
            className="relative flex w-full gap-4 overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {portfolio && portfolio.imageList.length > 0 ? (
              <>
                {portfolio.imageList.map((image: any) => (
                  <img
                    className="flex-shrink-0 w-[25%] aspect-square border"
                    src={image.saveFile}
                  />
                ))}
                {id && loginUser?.userSerial === parseInt(id) && (
                  <div className="flex items-center ">
                    <FiPlusCircle
                      size={24}
                      className="cursor-pointer aspect-square"
                      onClick={handleClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </>
            ) : id && loginUser?.userSerial === parseInt(id) ? (
              <div className="flex flex-col items-center w-full gap-4">
                <label className="flex flex-col items-center justify-center w-full">
                  <FaImage size={50} />
                  <p className="w-full font-bold text-center">
                    포트폴리오 이미지를 넣어주세요.
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="w-full text-center text-zp-md text-zp-light-gray">
                등록된 이미지가 없습니다.
                <NothingIcon width={80} height={80} className="mx-auto" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
          <div className="flex items-center gap-1">
            <TbBuildingCommunity size={16} />
            <p className="font-bold text-zp-sm">소속업체</p>
          </div>
          <div className="flex w-full gap-4 pl-4 mt-4">
            <div className="flex flex-col gap-2 pr-6 font-bold border-r text-zp-gray text-zp-xs border-r-zp-sub-color">
              {['업체명', '업체 주소', '사업자등록번호'].map((label, index) => (
                <p key={index}>{label}</p>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-zp-gray text-zp-xs">
              <p>{portfolio.worker.company}</p>
              <p>{portfolio.worker.companyAddress}</p>
              <p>{portfolio.worker.businessNumber}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-3 bg-zp-white drop-shadow-zp-slight rounded-zp-radius-big">
          <div className="flex items-center gap-1">
            <RiMessage2Line size={16} />
            <p className="font-bold text-zp-sm">하고 싶은 말</p>
          </div>
          <p className="pl-4 mt-4 text-zp-xs">{portfolio.publicRelation}</p>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="border flex flex-col border-zp-main-color rounded-zp-radius-big bg-zp-white p-6 shadow-lg w-[90%] gap-2">
            <p className="font-bold text-center text-zp-md">정보 수정</p>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">경력</p>
              <Input
                inputType="normal"
                type="number"
                placeholder="경력"
                width={5}
                height={1.5}
                radius="btn"
                fontSize="xs"
                value={career}
                onChange={(e: React.ChangeEvent) =>
                  setCareer(parseInt((e.target as HTMLInputElement).value))
                }
              />
            </div>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">A/S 기간</p>
              <Input
                inputType="normal"
                type="number"
                placeholder="A/S기간"
                width={5}
                height={1.5}
                radius="btn"
                fontSize="xs"
                value={asPeriod}
                onChange={(e: React.ChangeEvent) =>
                  setAsPeriod(parseInt((e.target as HTMLInputElement).value))
                }
              />
            </div>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">업체명</p>
              <Input
                inputType="normal"
                type="text"
                placeholder="업체명을 입력해주세요."
                width="full"
                height={1.5}
                radius="btn"
                fontSize="xs"
                value={company}
                onChange={(e: React.ChangeEvent) =>
                  setCompany((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">업체 주소</p>
              <div className="relative w-full ">
                <Input
                  inputType="normal"
                  type="text"
                  placeholder="업체 주소를 입력해주세요."
                  width="full"
                  height={1.5}
                  radius="btn"
                  fontSize="xs"
                  value={companyAddress}
                  onChange={(e: React.ChangeEvent) =>
                    setCompanyAddress((e.target as HTMLInputElement).value)
                  }
                />
                <FaSearch
                  size={16}
                  className="absolute top-1 right-1"
                  onClick={() => setOpenDaum(true)}
                />
              </div>
            </div>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">사업자 번호</p>
              <div className="flex flex-col w-full">
                <div className="flex w-full gap-4">
                  <Input
                    inputType="normal"
                    type="text"
                    placeholder="숫자 10자리를 입력해주세요."
                    width="full"
                    height={1.5}
                    radius="btn"
                    fontSize="xs"
                    value={businessNumber}
                    onChange={(e: React.ChangeEvent) =>
                      setBusinessNumber((e.target as HTMLInputElement).value)
                    }
                  />
                  <Button
                    buttonType={isOk ? 'light' : 'primary'}
                    width={2}
                    height={1.5}
                    radius="btn"
                    fontSize="2xs"
                    children="인증"
                    onClick={() => checkBusinessNumber(businessNumber)}
                    disabled={isOk}
                  />
                </div>
                {isOk ? (
                  <p className="font-bold text-zp-2xs text-zp-main-color">
                    사업자 번호가 인증되었습니다.
                  </p>
                ) : (
                  <p className="font-bold text-zp-2xs text-zp-red">
                    사업자 번호를 인증해주세요.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col text-zp-xs">
              <p className="font-bold">한줄 소개</p>
              <Input
                inputType="normal"
                type="text"
                placeholder="한 줄로 자기를 소개해주세요."
                width="full"
                height={1.5}
                radius="btn"
                fontSize="xs"
                value={publicRelation}
                onChange={(e: React.ChangeEvent) =>
                  setPublicRelation((e.target as HTMLInputElement).value)
                }
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                children="취소"
                buttonType="second"
                radius="btn"
                width={6}
                height={2}
                fontSize="xs"
                onClick={handleCloseModal}
              />
              <Button
                children="저장"
                buttonType="primary"
                radius="btn"
                width={6}
                height={2}
                fontSize="xs"
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        style={customModalStyles}
        isOpen={openDaum}
        onRequestClose={onCompletePost}
      >
        <DaumPostcode style={postCodeStyle} onComplete={onCompletePost} />
      </Modal>
    </>
  );
}
