import { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import QuestionPostListItem from '@/components/community/QuestionPostListItem';
import { useQuestionPostStore } from '@/stores/QuestionPostStore';
import Input from '@components/common/Input';

export default function QuestionPost() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [bookmarkCounts, setBookmarkCounts] = useState<{
    [key: number]: number;
  }>({});

  const navigate = useNavigate();
  const { questionPosts, fetchQuestionPosts } = useQuestionPostStore();

  useEffect(() => {
    fetchQuestionPosts();
  }, [fetchQuestionPosts]);

  const handleWritePost = () => {
    navigate('/QuestionPostCreate');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBookmarkChange = (postId: number, isBookmarked: boolean) => {
    setBookmarkCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isBookmarked ? 1 : -1),
    }));
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-6">
      <div className="w-full">
        {/* 드롭다운 버튼 */}
        <div className="relative flex items-center justify-center mt-16">
          <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="font-bold text-center text-zp-lg text-zp-black">
              질문글
            </div>
            <IoMdArrowDropdown
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              size={24}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute font-bold border top-full border-zp-light-gray rounded-zp-radius-btn hover:bg-zp-light-beige ">
              <button
                onClick={() => handleNavigate('/HousePost')}
                className="block w-full px-4 py-2 text-left hover:bg-zp-gray"
              >
                집들이
              </button>
              <button
                onClick={() => handleNavigate('/QuestionPost')}
                className="block w-full px-4 py-2 text-left hover:bg-zp-gray"
              >
                질문글
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <div className="py-2 mt-8 text-center bg-white border text-zp-2xs rounded-zp-radius-btn border-zp-main-color">
            <Button
              children="작성하기"
              buttonType="light"
              width={3.5}
              height={0.75}
              fontSize="2xs"
              radius="btn"
              onClick={handleWritePost}
            />
          </div>
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

        <div className="grid grid-cols-1 gap-3 mt-6">
          {questionPosts && questionPosts.length > 0 ? (
            questionPosts.map((post) => (
              <QuestionPostListItem
                key={post.board_serial}
                post_serial={post.board_serial}
                post_image={post.images?.[0] || ''}
                title={post.title}
                content={''}
                calendar_image={null}
                profile_image={null}
                nickname={post.nickname}
                upload_date={new Date(post.board_date)}
                view_cnt={post.hit}
                bookmark_cnt={
                  bookmarkCounts[post.board_serial] !== undefined
                    ? bookmarkCounts[post.board_serial]
                    : post.wish_cnt
                }
                comment_cnt={post.comment_cnt}
                isBookmarked={false}
                onBookmarkToggle={handleBookmarkChange}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-zp-gray">
              게시물이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
