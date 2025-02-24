// QuestionPostListItem.tsx
import { useState } from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { PiEyeLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

interface QuestionPost {
  post_serial: number;
  title: string;
  content: string;
  profile_image: string | null;
  nickname: string;
  calendar_image: string | null;
  upload_date: Date;
  view_cnt: number;
  bookmark_cnt: number;
  comment_cnt: number;
  isBookmarked: boolean;
  onBookmarkToggle: (post_serial: number, isBookmarked: boolean) => void;
  post_image?: string | null;
}

export default function QuestionPostListItem({
  post_serial,
  title,
  content,
  profile_image,
  nickname,
  calendar_image,
  upload_date,
  view_cnt,
  bookmark_cnt,
  comment_cnt,
  isBookmarked,
  onBookmarkToggle,
  post_image,
}: QuestionPost) {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 북마크 클릭 시 페이지 이동 방지
    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);
    onBookmarkToggle(post_serial, newBookmarkState); // 부모 컴포넌트에 상태 변경 전달
  };

  return (
    <div
      className="flex items-center w-full h-32 shadow-lg rounded-zp-radius-big"
      onClick={() => navigate(`/questionpost/${post_serial}`)}
    >
      <div className="flex items-center w-full p-2 space-x-4">
        {/* 이미지 */}
        <div className="">
          {post_image ? (
            <img
              src={post_image}
              alt="Post"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className=""></div>
          )}
        </div>

        {/* 제목 + 내용 */}
        <div className="flex flex-col h-20 px-6 border-r basis-3/5">
          <div className="font-bold text-left text-zp-xs">{title}</div>
          <div className="text-left line-clamp-2 text-zp-2xs text-zp-gray">
            {content}
          </div>
        </div>

        {/* 두 번째 요소 */}
        <div className="flex flex-col space-y-3 text-zp-gray basis-2/5">
          <div className="flex items-center justify-start space-x-1">
            {profile_image ? (
              <img
                src={profile_image}
                alt="Profile"
                className="w-4 h-4 rounded-zp-radius-full"
              />
            ) : (
              <CgProfile size={14} />
            )}
            <div className="text-zp-2xs">{nickname}</div>
          </div>
          <div className="flex items-center justify-start space-x-1">
            {calendar_image ? (
              <img
                src={calendar_image}
                alt="Calendar"
                className="w-4 h-4 rounded-zp-radius-full"
              />
            ) : (
              <FaRegCalendarAlt size={14} />
            )}
            <div className="text-zp-2xs">
              {new Date(upload_date).toLocaleDateString('ko-KR', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              })}
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-start space-x-1">
              <PiEyeLight size={14} />
              <div className="text-zp-2xs">{view_cnt}</div>
            </div>
            <div className="flex items-center justify-start ml-1 space-x-1">
              <div onClick={handleBookmarkClick} className="cursor-pointer">
                {bookmarked ? (
                  <IoBookmark size={14} />
                ) : (
                  <IoBookmarkOutline size={14} />
                )}
              </div>
              <div className="text-zp-2xs">{bookmark_cnt}</div>
            </div>
            <div className="flex items-center justify-start ml-1 space-x-1">
              <AiOutlineMessage size={14} />
              <div className="text-zp-2xs">{comment_cnt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
