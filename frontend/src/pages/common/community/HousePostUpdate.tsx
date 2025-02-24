import { ChangeEvent, useEffect, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { useHousePostStore } from '@/stores/housePostStore';



export default function HousePostUpdate() {
  const {boardSerial} = useParams<{boardSerial:string}>()
  const {postDetails, updatePost, fetchPostDetails} = useHousePostStore()
  useEffect(()=>{
    if(boardSerial)
      fetchPostDetails(parseInt(boardSerial))
  },[])
  const [title, setTitle] = useState<string>(postDetails?postDetails.title:'');
  const [boardContent, setBoardContent] = useState<string>(postDetails?postDetails.boardContent:"");
  const navigate = useNavigate();
  const handleConfirm = async () => {
    if(boardSerial){
    await updatePost(parseInt(boardSerial),{title:title,board_content: boardContent})
    await fetchPostDetails(parseInt(boardSerial))
    navigate(`/housepost/${boardSerial}`)
  }
  };
  const handleGoBack = () => {
    navigate('/housepost');
  };
  return (
    <>
      <div className="flex flex-col min-h-screen p-6 mt-24">
          <div className="flex items-center justify-between w-full mt-12">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
              />
            </div>
            <div className="relative flex-1 font-bold text-center right-4 text-zp-2xl">
              자랑하기 수정
            </div>
          </div>


          <div className="flex flex-col items-center justify-center mt-6 ">
            <div className="w-full text-left">
              <div className="mb-2 font-bold text-zp-md">제목</div>
                <Input
                  type="text"
                  placeholder="제목 입력"
                  inputType="login"
                  width="100%"
                  height={2.375}
                  className=""
                  fontSize="xs"
                  radius="none"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-6 ">
            <div className="w-full text-left">
              <div className="mb-2 font-bold text-zp-md">자랑해주세요</div>
            
                <textarea
                  placeholder="집에서 자랑하고 싶은 내용을 입력해주세요."
                  className="w-full h-[10rem] resize-none text-zp-xs border border-zp-main-color bg-zp-transparent rounded-zp-radius-btn p-2"
                  value={boardContent}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setBoardContent(e.target.value)
                  }
                />
            </div>
          </div>
                  <div className='w-full mt-6'>
            <Button
              children="수정하기"
              buttonType="second"
              width="full"
              height={2.375}
              fontSize="xl"
              radius="btn"
              onClick={handleConfirm}
            />
            </div>
      </div>

    
    </>
  );
}
