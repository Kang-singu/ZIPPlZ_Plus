import { ChangeEvent, useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { CiSearch } from 'react-icons/ci';
import { GoArrowLeft } from 'react-icons/go';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getFIndWorkerDetail,
  getFindWorkerList,
  updateFindWorker,
} from '@/apis/worker/WorkerListApi';
import Selectbar from '@/components/common/Selectbar';
import { useWorkerListStore } from '@/stores/workerListStore';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

const postCodeStyle = {
  width: 'full',
  height: '30rem',
};
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
    maxWidth: '200px',
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
    zIndex: 1500,
  },
};
const fields: string[] = [
  '철거',
  '설비',
  '샷시',
  '목공',
  '전기',
  '욕실',
  '타일',
  '마루',
  '도배',
  '가구',
];
export default function UpdateFindWorker() {
  const { findWorker, setFindWorker } = useWorkerListStore();
  const { boardSerial } = useParams<{ boardSerial: string }>();
  const id: number = boardSerial ? parseInt(boardSerial) : 0;
  const fetchFindWorker = async (boardSerial: number) => {
    const response = await getFIndWorkerDetail(boardSerial);
    setFindWorker(response.data.data);
  };
  const [openDaum, setOpenDaum] = useState<boolean>(false);
  useEffect(() => {
    if (boardSerial && id > 0) {
      fetchFindWorker(id);
    }
  }, []);

  const [title, setTitle] = useState<string>(
    findWorker && findWorker.board ? findWorker.board.title : ''
  );
  const [wishField, setWishField] = useState<string>(
    findWorker ? fields[parseInt(findWorker.field_id) - 1] : ''
  );
  const [address, setAddress] = useState<string>(
    findWorker && findWorker.board ? findWorker.user_address : ''
  );
  const [workDetail, setWorkDetail] = useState<string>(
    findWorker && findWorker.board ? findWorker.board.boardContent : ''
  );
  const onCompletePost = (data: any) => {
    setAddress(data.address);
    setOpenDaum(false);
  };
  const navigate = useNavigate();

  const goList = () => navigate('/workers/findworker');

  const { setFindWorkerList } = useWorkerListStore();
  const fetchFindWorkerList = async () => {
    const response = await getFindWorkerList();
    setFindWorkerList(response.data.data);
  };
  const handleClickRegistButton = async (
    title: string,
    field: string,
    address: string,
    content: string
  ) => {
    if (findWorker && findWorker.board) {
      await updateFindWorker(findWorker?.board?.boardSerial, {
        title: title,
        board_content: content,
        user_address: address,
        field_id: field,
      });
      await fetchFindWorkerList();
    }
  };
  return (
    <>
      <div className="flex flex-col w-full p-6 mt-[3rem] gap-4">
        <div className="w-full relateive">
          {/* 나가기 버튼, 구인 글쓰기 text */}
          <GoArrowLeft className="absolute cursor-pointer" onClick={goList} />
          <p className="w-full font-extrabold text-center align-text-top text-zp-xl">
            구인 글 수정
          </p>
        </div>
        {/* 제목 input */}
        <div className="flex flex-col w-full gap-1">
          <p className="font-bold text-zp-md">제목</p>
          <Input
            type="text"
            placeholder="제목을 입력 해주세요."
            inputType="login"
            width="100%"
            height={2}
            className=""
            fontSize="xs"
            radius="none"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        {/* 희망분야 */}
        <div className="flex flex-col w-full gap-1">
          <p className="font-bold text-zp-md">희망 분야</p>
          <Selectbar
            backgroundColor="light-beige"
            fontColor="black"
            selectedValue={wishField}
            fontSize="xs"
            radius="btn"
            border="main"
            hover="sub"
            options={fields}
            setSelectedValue={setWishField}
            width="full"
            height={2}
          />
        </div>
        {/* 현장 주소 input */}
        <div className="relative flex flex-col w-full gap-1">
          <p className="font-bold text-zp-md">현장 주소</p>
          <Input
            type="text"
            placeholder="작업을 희망하는 주소를 입력해주세요."
            inputType="login"
            width="100%"
            height={2}
            fontSize="xs"
            radius="none"
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
          />
          <CiSearch
            size={16}
            className="absolute right-3 top-[2rem]"
            onClick={() => setOpenDaum(true)}
          />
        </div>
        {/* 작업 내용 input */}
        <div className="flex flex-col w-full gap-4">
          <p className="font-bold text-zp-md">작업내용</p>
          <textarea
            placeholder="희망하시는 작업 또는 시공에 대해 입력해주세요."
            value={workDetail}
            className="w-full h-[15rem] p-4 border text-zp-xs border-zp-main-color rounded-zp-radius-btn bg-zp-transparent"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setWorkDetail((e.target as HTMLTextAreaElement).value)
            }
          />
        </div>
        <Button
          children="확인"
          buttonType="second"
          width="full"
          height={3}
          fontSize="xl"
          radius="btn"
          onClick={() => {
            handleClickRegistButton(
              title,
              (fields.indexOf(wishField) + 1).toString(),
              address,
              workDetail
            );

            setTimeout(() => {
              goList();
            }, 2000); // 1000ms (1초) 후에 실행
          }}
        />
      </div>
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
