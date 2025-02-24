import { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

import { useLoginUserStore } from '@/stores/loginUserStore';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import HousePostListItem from '@components/community/HousePostListItem';
import { useHousePostStore } from '@stores/housePostStore';

export default function HousePost() {
  const [inputValue, setInputValue] = useState<string>('');

  const navigate = useNavigate();
  const { housePosts, fetchHousePosts } = useHousePostStore();

  useEffect(() => {
    fetchHousePosts();
  }, [fetchHousePosts]);

  const handleWritePost = () => {
    navigate('/housepostcreate');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const { loginUser } = useLoginUserStore();
  return (
    <>
      <div className="flex flex-col min-h-screen gap-6 p-6 mt-12">
        <div className="font-bold text-center text-zp-lg text-zp-black">
          집들이
        </div>

        <div className="relative flex items-center justify-center w-full">
          <HiMagnifyingGlass className="relative left-4" />
          <Input
            placeholder="글의 제목이나 작성자 이름을 입력하세요."
            inputType="signup"
            type="text"
            width={14}
            height={2.5}
            fontSize="2xs"
            radius="none"
            value={inputValue}
            onChange={handleInputChange}
            additionalStyle="pl-6 bg-zp-light-beige border-b-2 font-bold text-zp-gray"
          />
        </div>
        {loginUser && loginUser.role !== '' && (
          <div className="flex justify-end mb-4">
            <Button
              children="글 작성하기"
              buttonType="second"
              width={6}
              height={2}
              fontSize="xs"
              radius="btn"
              onClick={handleWritePost}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {housePosts && housePosts.length > 0 ? (
            housePosts.map((post) => <HousePostListItem board={post} />)
          ) : (
            <div className="col-span-3 text-center text-zp-gray">
              게시물이 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
